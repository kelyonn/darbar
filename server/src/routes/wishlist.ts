import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { Response, NextFunction } from 'express';
import { Wishlist } from '../models/Wishlist';
import { Product } from '../models/Product';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();
router.use(authenticate);

// GET /api/wishlist
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user!.id }).populate('productIds', 'name slug price images ratings category');
    res.json({ success: true, products: wishlist?.productIds || [] });
  } catch (err) { next(err); }
});

// POST /api/wishlist/:productId (toggle)
router.post('/:productId', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) { next(createError('Product not found', 404)); return; }

    let wishlist = await Wishlist.findOne({ userId: req.user!.id });
    if (!wishlist) wishlist = new Wishlist({ userId: req.user!.id, productIds: [] });

    const idx = wishlist.productIds.findIndex(id => String(id) === productId);
    let action: string;
    if (idx > -1) {
      wishlist.productIds.splice(idx, 1);
      action = 'removed';
    } else {
      wishlist.productIds.push(product._id as import('mongoose').Types.ObjectId);
      action = 'added';
    }

    await wishlist.save();
    res.json({ success: true, action });
  } catch (err) { next(err); }
});

export default router;
