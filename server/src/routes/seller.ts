import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Product } from '../models/Product';
import { Order } from '../models/Order';

const router = Router();
router.use(authenticate, requireRole('seller', 'admin'));

// GET /api/seller/dashboard
router.get('/dashboard', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [products, orderStats] = await Promise.all([
      Product.countDocuments({ sellerId: req.user!.id, isActive: true }),
      Order.aggregate([
        { $unwind: '$items' },
        { $match: { 'items.sellerId': new (await import('mongoose')).default.Types.ObjectId(req.user!.id), paymentStatus: 'paid' } as Record<string, unknown> },
        { $group: { _id: null, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }, orders: { $addToSet: '$_id' } } },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        activeProducts: products,
        totalRevenue: orderStats[0]?.revenue || 0,
        totalOrders: orderStats[0]?.orders?.length || 0,
      },
    });
  } catch (err) { next(err); }
});

// GET /api/seller/products
router.get('/products', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({ sellerId: req.user!.id }).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) { next(err); }
});

// GET /api/seller/orders
router.get('/orders', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find({ 'items.sellerId': req.user!.id, paymentStatus: 'paid' }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, orders });
  } catch (err) { next(err); }
});

export default router;
