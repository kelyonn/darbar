import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { verifyPayment } from '../controllers/orderController';

const router = Router();
router.post('/verify', authenticate, verifyPayment);
export default router;
