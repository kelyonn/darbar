import { Response, NextFunction } from 'express';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

// GET /api/cart
export const getCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cart = await Cart.findOne({ userId: req.user!.id });
    res.json({ success: true, cart: cart || { items: [] } });
  } catch (err) { next(err); }
};

// POST /api/cart
export const addToCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId, quantity = 1, size, color } = req.body;

    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) { next(createError('Product not found', 404)); return; }
    if (product.stock < quantity) { res.status(400).json({ message: 'Insufficient stock' }); return; }

    let cart = await Cart.findOne({ userId: req.user!.id });
    if (!cart) {
      cart = new Cart({ userId: req.user!.id, items: [] });
    }

    const existingIdx = cart.items.findIndex(
      i => String(i.productId) === productId && i.size === size && i.color === color
    );

    if (existingIdx > -1) {
      cart.items[existingIdx].quantity = Math.min(cart.items[existingIdx].quantity + quantity, product.stock);
    } else {
      cart.items.push({
        productId: product._id as unknown as import('mongoose').Types.ObjectId,
        sellerId: product.sellerId,
        name: product.name,
        price: product.price,
        image: product.images.find(i => i.isPrimary)?.url || product.images[0]?.url || '',
        size, color, quantity,
      });
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) { next(err); }
};

// PUT /api/cart/:itemId
export const updateCartItem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user!.id });
    if (!cart) { next(createError('Cart not found', 404)); return; }

    const item = cart.items.find(i => String((i as { _id?: unknown })._id) === req.params.itemId);
    if (!item) { next(createError('Item not found', 404)); return; }

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => String((i as { _id?: unknown })._id) !== req.params.itemId) as typeof cart.items;
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) { next(err); }
};

// DELETE /api/cart/:itemId
export const removeFromCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cart = await Cart.findOne({ userId: req.user!.id });
    if (!cart) { next(createError('Cart not found', 404)); return; }

    const item = cart.items.find(i => String((i as { _id?: unknown })._id) === req.params.itemId);
    if (item) {
      cart.items = cart.items.filter(i => String((i as { _id?: unknown })._id) !== req.params.itemId) as typeof cart.items;
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) { next(err); }
};

// DELETE /api/cart
export const clearCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await Cart.findOneAndUpdate({ userId: req.user!.id }, { items: [] });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) { next(err); }
};
