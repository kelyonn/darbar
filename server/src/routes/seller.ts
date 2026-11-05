import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Product } from '../models/Product';
import { Order } from '../models/Order';

import { sellerTotals } from '../utils/stats';
const router = Router();
router.use(authenticate, requireRole('seller', 'admin'));

// GET /api/seller/dashboard
router.get('/dashboard', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [products, totals] = await Promise.all([
      Product.countDocuments({ sellerId: req.user!.id, isActive: true }),
      sellerTotals(req.user!.id),
    ]);

    res.json({
      success: true,
      stats: {
        activeProducts: products,
        totalRevenue: totals.revenue,
        totalOrders: totals.orders,
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
