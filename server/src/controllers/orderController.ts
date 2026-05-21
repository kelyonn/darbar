import { Response, NextFunction } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { Cart } from '../models/Cart';
import { Order } from '../models/Order';
import { Coupon } from '../models/Coupon';
import { Product } from '../models/Product';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { sendOrderConfirmationEmail } from '../services/email';
import { io } from '../index';
import { config } from '../config/env';

const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

const generateOrderNumber = (): string => {
  return 'DBR-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
};

// GET /api/orders
export const getOrders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filter = req.user!.role === 'seller'
      ? { 'items.sellerId': req.user!.id }
      : { userId: req.user!.id };

    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, orders });
  } catch (err) { next(err); }
};

// GET /api/orders/:id
export const getOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) { next(createError('Order not found', 404)); return; }

    const isOwner = String(order.userId) === req.user!.id;
    const isSeller = order.items.some(i => String(i.sellerId) === req.user!.id);
    const isAdmin = req.user!.role === 'admin';

    if (!isOwner && !isSeller && !isAdmin) { next(createError('Forbidden', 403)); return; }
    res.json({ success: true, order });
  } catch (err) { next(err); }
};

// POST /api/orders
export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { shippingAddress, couponCode } = req.body;

    const cart = await Cart.findOne({ userId: req.user!.id });
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: 'Cart is empty' }); return;
    }

    // Validate stock for all items
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        res.status(400).json({ message: `Product "${item.name}" is no longer available` }); return;
      }
      if (product.stock < item.quantity) {
        res.status(400).json({ message: `Insufficient stock for "${item.name}"` }); return;
      }
    }

    let subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    let discount = 0;

    // Apply coupon
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
        $where: function (this: { usedCount: number; maxUses: number }) { return this.usedCount < this.maxUses; },
      });

      if (coupon && subtotal >= coupon.minPurchase) {
        if (coupon.type === 'percentage') discount = Math.min((subtotal * coupon.value) / 100, coupon.maxDiscount || Infinity);
        else if (coupon.type === 'fixed') discount = Math.min(coupon.value, subtotal);
        await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
      }
    }

    const total = Math.max(0, subtotal - discount);

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // paise
      currency: 'INR',
      receipt: generateOrderNumber(),
    });

    // Create order in DB (pending payment)
    const order = await Order.create({
      userId: req.user!.id,
      orderNumber: razorpayOrder.receipt,
      items: cart.items.map(i => ({
        productId: i.productId,
        sellerId: i.sellerId,
        name: i.name,
        price: i.price,
        image: i.image,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        itemStatus: 'pending',
      })),
      shippingAddress,
      subtotal,
      discount,
      tax: 0,
      total,
      couponCode: couponCode?.toUpperCase(),
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      timeline: [{ status: 'pending', timestamp: new Date() }],
    });

    res.status(201).json({
      success: true,
      order,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: config.razorpay.keyId,
    });
  } catch (err) { next(err); }
};

// POST /api/payments/verify
export const verifyPayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      res.status(400).json({ message: 'Payment verification failed' }); return;
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentId: razorpayPaymentId,
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
        $push: { timeline: { status: 'confirmed', timestamp: new Date(), note: 'Payment received' } },
      },
      { new: true }
    );

    if (!order) { next(createError('Order not found', 404)); return; }

    // Reduce stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity, purchaseCount: item.quantity },
      });
    }

    // Clear cart
    await Cart.findOneAndUpdate({ userId: req.user!.id }, { items: [] });

    // Emit real-time purchase event
    io.emit('purchase', {
      productName: order.items[0].name,
      city: (order.shippingAddress as { city?: string }).city || 'India',
    });

    // Send confirmation email
    const user = await import('../models/User').then(m => m.User.findById(req.user!.id));
    if (user) {
      sendOrderConfirmationEmail(
        user.email,
        user.firstName,
        order.orderNumber,
        order.total.toLocaleString('en-IN')
      ).catch(() => {});
    }

    res.json({ success: true, order });
  } catch (err) { next(err); }
};

// PUT /api/orders/:id/status (seller/admin)
export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, note, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) { next(createError('Order not found', 404)); return; }

    const updateData: Record<string, unknown> = {
      orderStatus: status,
      $push: { timeline: { status, timestamp: new Date(), note } },
    };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;

    const updated = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, order: updated });
  } catch (err) { next(err); }
};
