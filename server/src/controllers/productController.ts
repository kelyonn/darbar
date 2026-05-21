import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Product } from '../models/Product';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

// GET /api/products
export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      category, subcategory, minPrice, maxPrice,
      fabric, color, sort = 'createdAt', order = 'desc',
      page = '1', limit = '12', search,
    } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = { isActive: true };

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (fabric) filter.fabric = { $regex: fabric, $options: 'i' };
    if (color) filter.colors = { $in: [new RegExp(color, 'i')] };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (filter.price as Record<string, number>).$lte = Number(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const sortObj: Record<string, 1 | -1> = { [sort]: order === 'asc' ? 1 : -1 };
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(48, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(limitNum).select('-__v'),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      products,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) { next(err); }
};

// GET /api/products/trending
export const getTrending = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ purchaseCount: -1, viewCount: -1 })
      .limit(8)
      .select('name slug price images category ratings');
    res.json({ success: true, products });
  } catch (err) { next(err); }
};

// GET /api/products/featured
export const getFeatured = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true })
      .limit(8)
      .select('name slug price images category ratings');
    res.json({ success: true, products });
  } catch (err) { next(err); }
};

// GET /api/products/:slug
export const getProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug, isActive: true })
      .populate('sellerId', 'firstName lastName');
    if (!product) { next(createError('Product not found', 404)); return; }

    // Increment view count
    Product.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } }).exec();

    res.json({ success: true, product });
  } catch (err) { next(err); }
};

// GET /api/products/:id/recommendations
export const getRecommendations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).select('category price tags');
    if (!product) { next(createError('Product not found', 404)); return; }

    const complementaryCategory = product.category === 'mens' || product.category === 'womens'
      ? 'accessories'
      : product.category === 'accessories' ? 'womens' : product.category;

    const [similar, completeTheLook] = await Promise.all([
      Product.find({ _id: { $ne: product._id }, category: product.category, isActive: true })
        .sort({ 'ratings.average': -1 }).limit(4).select('name slug price images ratings'),
      Product.find({ category: complementaryCategory, isActive: true })
        .sort({ purchaseCount: -1 }).limit(4).select('name slug price images ratings'),
    ]);

    res.json({ success: true, similar, completeTheLook });
  } catch (err) { next(err); }
};

// POST /api/products (seller/admin)
export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ message: 'Validation failed', errors: errors.array() }); return; }

    const slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    const product = await Product.create({ ...req.body, slug, sellerId: req.user!.id });
    res.status(201).json({ success: true, product });
  } catch (err) { next(err); }
};

// PUT /api/products/:id (seller/admin)
export const updateProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) { next(createError('Product not found', 404)); return; }
    if (req.user!.role !== 'admin' && String(product.sellerId) !== req.user!.id) {
      next(createError('Forbidden', 403)); return;
    }
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, product: updated });
  } catch (err) { next(err); }
};

// DELETE /api/products/:id (seller/admin)
export const deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) { next(createError('Product not found', 404)); return; }
    if (req.user!.role !== 'admin' && String(product.sellerId) !== req.user!.id) {
      next(createError('Forbidden', 403)); return;
    }
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Product removed' });
  } catch (err) { next(err); }
};
