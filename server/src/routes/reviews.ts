import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, optionalAuth } from '../middleware/auth';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Review } from '../models/Review';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

// GET /api/reviews/product/:productId
router.get('/product/:productId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sort = 'createdAt', page = '1' } = req.query as Record<string, string>;
    const sortObj: Record<string, 1 | -1> = sort === 'rating' ? { rating: -1 } : { createdAt: -1 };
    const pageNum = parseInt(page);
    const limit = 10;

    const [reviews, total] = await Promise.all([
      Review.find({ productId: req.params.productId })
        .sort(sortObj).skip((pageNum - 1) * limit).limit(limit)
        .populate('userId', 'firstName lastName avatar'),
      Review.countDocuments({ productId: req.params.productId }),
    ]);

    const aggregate = await Review.aggregate([
      { $match: { productId: new (await import('mongoose')).default.Types.ObjectId(req.params.productId) } },
      { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    res.json({
      success: true, reviews, total,
      average: aggregate[0]?.average || 0,
      count: aggregate[0]?.count || 0,
    });
  } catch (err) { next(err); }
});

// POST /api/reviews
router.post('/',
  authenticate,
  [
    body('productId').notEmpty(),
    body('orderId').notEmpty(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('title').trim().notEmpty().isLength({ max: 150 }),
    body('body').trim().isLength({ min: 20, max: 1000 }),
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) { res.status(400).json({ message: 'Validation failed', errors: errors.array() }); return; }

      const { productId, orderId, rating, title, body: reviewBody } = req.body;

      // Verify purchase
      const order = await Order.findOne({
        _id: orderId,
        userId: req.user!.id,
        'items.productId': productId,
        paymentStatus: 'paid',
      });
      if (!order) { next(createError('You can only review products you have purchased', 403)); return; }

      const existing = await Review.findOne({ userId: req.user!.id, productId });
      if (existing) { res.status(409).json({ message: 'You have already reviewed this product' }); return; }

      const review = await Review.create({
        userId: req.user!.id, productId, orderId, rating, title, body: reviewBody, isVerifiedPurchase: true,
      });

      // Update product rating aggregate
      const agg = await Review.aggregate([
        { $match: { productId: new (await import('mongoose')).default.Types.ObjectId(productId) } },
        { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } },
      ]);
      await Product.findByIdAndUpdate(productId, { 'ratings.average': agg[0]?.average || 0, 'ratings.count': agg[0]?.count || 0 });

      res.status(201).json({ success: true, review });
    } catch (err) { next(err); }
  }
);

export default router;
