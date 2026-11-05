import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { Coupon } from '../models/Coupon';
import { paidItems } from '../utils/stats';

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

// GET /api/admin/analytics?period=30d|7d|90d|1y
router.get('/analytics', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { period = '30d' } = req.query as Record<string, string>;
    const days = period === '7d' ? 7 : period === '90d' ? 90 : period === '1y' ? 365 : 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const prevSince = new Date(Date.now() - 2 * days * 24 * 60 * 60 * 1000);

    const [items, totalUsers, totalProducts] = await Promise.all([
      paidItems({ createdAt: { $gte: prevSince } }),
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
    ]);

    const orders = await Order.find({ paymentStatus: 'paid', createdAt: { $gte: prevSince } }).select('total createdAt').lean();
    const cur = orders.filter(o => o.createdAt >= since);
    const prv = orders.filter(o => o.createdAt < since);
    const summary = [{ total: cur.reduce((s, o) => s + o.total, 0), count: cur.length }];
    const prevSummary = [{ total: prv.reduce((s, o) => s + o.total, 0), count: prv.length }];

    // Monthly revenue buckets
    const buckets = new Map<string, { year: number; month: number; revenue: number; orders: number }>();
    for (const o of cur) {
      const d = new Date(o.createdAt);
      const key = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}`;
      const b = buckets.get(key) || { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, revenue: 0, orders: 0 };
      b.revenue += o.total; b.orders += 1; buckets.set(key, b);
    }
    const monthly = [...buckets.values()]
      .sort((a, b) => a.year - b.year || a.month - b.month)
      .map(b => ({ _id: { year: b.year, month: b.month }, revenue: b.revenue, orders: b.orders }));

    const curItems = items.filter(i => i.createdAt >= since);
    const prodDocs = await Product.find({ _id: { $in: [...new Set(curItems.map(i => String(i.productId)))] } }).select('category').lean();
    const categoryOf = new Map(prodDocs.map(p => [String(p._id), p.category as string]));
    for (const i of curItems) i.category = categoryOf.get(String(i.productId)) || 'other';
    const catMap = new Map<string, { _id: string; count: number; revenue: number }>();
    const prodMap = new Map<string, { _id: unknown; name: string; sold: number; revenue: number }>();
    for (const i of curItems) {
      const c = catMap.get(i.category || 'other') || { _id: i.category || 'other', count: 0, revenue: 0 };
      c.count += i.quantity; c.revenue += i.price * i.quantity; catMap.set(c._id, c);
      const k = String(i.productId);
      const p = prodMap.get(k) || { _id: i.productId, name: i.name, sold: 0, revenue: 0 };
      p.sold += i.quantity; p.revenue += i.price * i.quantity; prodMap.set(k, p);
    }
    const categories = [...catMap.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 6);
    const topProducts = [...prodMap.values()].sort((a, b) => b.sold - a.sold).slice(0, 10);

    const curr = summary[0] || { total: 0, count: 0 };
    const prev = prevSummary[0] || { total: 0, count: 0 };
    const revenueChange = prev.total > 0 ? Math.round(((curr.total - prev.total) / prev.total) * 100) : 0;
    const orderChange = prev.count > 0 ? Math.round(((curr.count - prev.count) / prev.count) * 100) : 0;

    res.json({
      success: true,
      monthly,
      categories,
      topProducts,
      summary: {
        totalRevenue: curr.total,
        totalOrders: curr.count,
        totalUsers,
        totalProducts,
        revenueChange,
        orderChange,
      },
    });
  } catch (err) { next(err); }
});

export default router;

