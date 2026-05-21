import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { Coupon } from '../models/Coupon';

const router = Router();
router.use(authenticate, requireRole('admin'));

// GET /api/admin/dashboard
router.get('/dashboard', async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [totalUsers, totalProducts, recentOrders, revenue] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.find({ paymentStatus: 'paid' }).sort({ createdAt: -1 }).limit(10).select('orderNumber total orderStatus createdAt'),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders: revenue[0]?.count || 0,
        totalRevenue: revenue[0]?.total || 0,
      },
      recentOrders,
    });
  } catch (err) { next(err); }
});

// GET /api/admin/users
router.get('/users', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = '1', role, search } = req.query as Record<string, string>;
    const filter: Record<string, unknown> = {};
    if (role) filter.role = role;
    if (search) filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
    const pageNum = parseInt(page), limit = 20;
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * limit).limit(limit).select('-passwordHash'),
      User.countDocuments(filter),
    ]);
    res.json({ success: true, users, pagination: { page: pageNum, total, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
});

// PUT /api/admin/users/:id/role
router.put('/users/:id/role', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body;
    if (!['customer', 'seller', 'admin'].includes(role)) { res.status(400).json({ message: 'Invalid role' }); return; }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-passwordHash');
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

// PUT /api/admin/users/:id/status
router.put('/users/:id/status', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true }).select('-passwordHash');
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

// GET /api/admin/orders
router.get('/orders', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = '1', status } = req.query as Record<string, string>;
    const filter: Record<string, unknown> = {};
    if (status) filter.orderStatus = status;
    const pageNum = parseInt(page), limit = 20;
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * limit).limit(limit),
      Order.countDocuments(filter),
    ]);
    res.json({ success: true, orders, pagination: { page: pageNum, total, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
});

// POST /api/admin/coupons
router.post('/coupons', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (err) { next(err); }
});

// PUT /api/admin/coupons/:id
router.put('/coupons/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, coupon });
  } catch (err) { next(err); }
});

// GET /api/admin/coupons
router.get('/coupons', async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (err) { next(err); }
});

export default router;
