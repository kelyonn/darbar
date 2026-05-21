import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { getOrders, getOrder, createOrder, updateOrderStatus } from '../controllers/orderController';

const router = Router();
router.use(authenticate);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);
router.put('/:id/status', requireRole('seller', 'admin'), updateOrderStatus);
export default router;
