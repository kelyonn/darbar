import { Router, Response, NextFunction } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';
import { config } from '../config/env';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'));
    } else {
      cb(null, true);
    }
  },
});

const router = Router();
router.use(authenticate);

// POST /api/upload  — upload a single image, return Cloudinary URL
router.post('/', upload.single('image'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) { res.status(400).json({ message: 'No file provided' }); return; }

    // If Cloudinary is not configured, return a placeholder to allow dev without cloud creds
    if (!config.cloudinary.cloudName) {
      res.json({ success: true, url: '/placeholder.jpg', public_id: 'placeholder' });
      return;
    }

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'darbar', resource_type: 'image', quality: 'auto', fetch_format: 'auto' },
        (err, result) => {
          if (err || !result) reject(err);
          else resolve(result as { secure_url: string; public_id: string });
        }
      ).end(req.file!.buffer);
    });

    res.json({ success: true, url: result.secure_url, public_id: result.public_id });
  } catch (err) { next(err); }
});

export default router;
