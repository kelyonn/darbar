import { Router, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { SellerProfile } from '../models/SellerProfile';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Order } from '../models/Order';

const router = Router();
router.use(authenticate);

// ── Seller self-serve routes ──────────────────────────────────────────────

// GET /api/sellers/me  — check if current user has a seller profile
router.get('/me', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await SellerProfile.findOne({ userId: req.user!.id });
    res.json({ success: true, profile });
  } catch (err) { next(err); }
});

// POST /api/sellers/apply  — submit seller application
router.post(
  '/apply',
  [
    body('businessName').trim().notEmpty().withMessage('Business name is required'),
    body('description').trim().isLength({ min: 30 }).withMessage('Description must be at least 30 characters'),
    body('bankAccountName').trim().notEmpty(),
    body('bankAccountNumber').trim().notEmpty(),
    body('bankIfsc').trim().notEmpty(),
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) { res.status(400).json({ message: 'Validation failed', errors: errors.array() }); return; }

      const existing = await SellerProfile.findOne({ userId: req.user!.id });
      if (existing) { res.status(409).json({ message: 'You have already submitted an application' }); return; }

      const profile = await SellerProfile.create({
        userId: req.user!.id,
        businessName: req.body.businessName,
        description: req.body.description,
        gstin: req.body.gstin,
        bankAccountName: req.body.bankAccountName,
        bankAccountNumber: req.body.bankAccountNumber,
        bankIfsc: req.body.bankIfsc,
        isApproved: false,
      });

      res.status(201).json({ success: true, profile });
    } catch (err) { next(err); }
  }
);

// ── Admin seller management routes ───────────────────────────────────────

// GET /api/sellers  — admin: list all seller applications
router.get('/', requireRole('admin'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status = 'pending', page = '1' } = req.query as Record<string, string>;
    const filter: Record<string, unknown> = {};
    if (status === 'pending') filter.isApproved = false;
    if (status === 'approved') filter.isApproved = true;

    const pageNum = parseInt(page), limit = 20;
    const [profiles, total] = await Promise.all([
      SellerProfile.find(filter)
        .populate('userId', 'firstName lastName email createdAt')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limit)
        .limit(limit),
      SellerProfile.countDocuments(filter),
    ]);

    res.json({ success: true, profiles, pagination: { page: pageNum, total, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
});

// PUT /api/sellers/:id/approve  — admin: approve or reject
router.put('/:id/approve', requireRole('admin'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { approved } = req.body; // boolean
    const profile = await SellerProfile.findById(req.params.id).populate('userId');
    if (!profile) { res.status(404).json({ message: 'Seller profile not found' }); return; }

    profile.isApproved = approved;
    if (approved) {
      profile.approvedBy = req.user!.id as unknown as typeof profile.approvedBy;
      profile.approvedAt = new Date();
      // Upgrade user role to seller
      await User.findByIdAndUpdate(profile.userId, { role: 'seller' });
    }
    await profile.save();

    res.json({ success: true, profile });
  } catch (err) { next(err); }
});

// GET /api/sellers/:id/stats  — admin: seller performance
router.get('/:id/stats', requireRole('admin'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [productCount, revenue] = await Promise.all([
      Product.countDocuments({ sellerId: req.params.id, isActive: true }),
      Order.aggregate([
        { $unwind: '$items' },
        {
          $match: {
            'items.sellerId': new (await import('mongoose')).default.Types.ObjectId(req.params.id),
            paymentStatus: 'paid',
          } as Record<string, unknown>,
        },
        { $group: { _id: null, total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }, orders: { $addToSet: '$_id' } } },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        productCount,
        totalRevenue: revenue[0]?.total || 0,
        totalOrders: revenue[0]?.orders?.length || 0,
      },
    });
  } catch (err) { next(err); }
});

export default router;
