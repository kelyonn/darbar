import { Router } from 'express';
import { body } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

const NewsletterSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter', NewsletterSchema);

const router = Router();

router.post('/',
  [body('email').isEmail().normalizeEmail()],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) { res.status(400).json({ message: 'Valid email required' }); return; }
      await Newsletter.findOneAndUpdate(
        { email: req.body.email },
        { email: req.body.email, isActive: true },
        { upsert: true }
      );
      res.json({ success: true, message: 'You are now subscribed to our newsletter.' });
    } catch (err) { next(err); }
  }
);

export default router;
