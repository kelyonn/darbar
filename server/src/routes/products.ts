import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth';
import {
  getProducts, getProduct, getTrending, getFeatured,
  getRecommendations, createProduct, updateProduct, deleteProduct,
} from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.get('/trending', getTrending);
router.get('/featured', getFeatured);
router.get('/:slug', getProduct);
router.get('/:id/recommendations', getRecommendations);

router.post('/',
  authenticate, requireRole('seller', 'admin'),
  [
    body('name').trim().notEmpty(),
    body('description').notEmpty(),
    body('shortDescription').notEmpty(),
    body('price').isNumeric().isFloat({ min: 0 }),
    body('category').isIn(['mens', 'womens', 'accessories', 'footwear']),
    body('subcategory').notEmpty(),
  ],
  createProduct
);

router.put('/:id', authenticate, requireRole('seller', 'admin'), updateProduct);
router.delete('/:id', authenticate, requireRole('seller', 'admin'), deleteProduct);

export default router;
