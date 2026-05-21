import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { Request, Response, NextFunction } from 'express';
import { Coupon } from '../models/Coupon';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/coupons/validate
router.post('/validate', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) { res.status(400).json({ message: 'Coupon code is required' }); return; }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
    });

    if (!coupon || coupon.usedCount >= coupon.maxUses) {
      res.status(400).json({ message: 'Invalid or expired coupon code' }); return;
    }

    if (subtotal < coupon.minPurchase) {
      res.status(400).json({ message: `Minimum purchase of ₹${coupon.minPurchase.toLocaleString('en-IN')} required` });
      return;
    }

    let discount = 0;
    if (coupon.type === 'percentage') discount = Math.min((subtotal * coupon.value) / 100, coupon.maxDiscount || Infinity);
    else if (coupon.type === 'fixed') discount = Math.min(coupon.value, subtotal);
    else if (coupon.type === 'free_shipping') discount = 0; // handled on frontend

    res.json({
      success: true,
      discount: Math.round(discount),
      type: coupon.type,
      value: coupon.value,
      message: `Coupon applied — ₹${Math.round(discount).toLocaleString('en-IN')} discount`,
    });
  } catch (err) { next(err); }
});

export default router;
