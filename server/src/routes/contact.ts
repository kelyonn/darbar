import { Router } from 'express';
import { body } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5 });

// Inline model + controller for simplicity
const ContactSchema = new mongoose.Schema({
  name: String, email: String, message: String, isRead: { type: Boolean, default: false },
}, { timestamps: true });
const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

const router = Router();

router.post('/',
  contactLimiter,
  [body('name').trim().notEmpty(), body('email').isEmail().normalizeEmail(), body('message').trim().isLength({ min: 10 })],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) { res.status(400).json({ message: 'Please fill all fields correctly', errors: errors.array() }); return; }
      await Contact.create(req.body);
      // Email forwarding would fire here in production
      res.json({ success: true, message: 'Message received. We will respond within 24 hours.' });
    } catch (err) { next(err); }
  }
);

export default router;
