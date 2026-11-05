import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { startAbandonedCartCron, sendAbandonedCartEmails } from './utils/abandonedCartCron';

import { config, missingEnv } from './config/env';
import connectDatabase from './config/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Route imports (stubs — to be filled in Phase 2)
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import cartRoutes from './routes/cart';
import wishlistRoutes from './routes/wishlist';
import orderRoutes from './routes/orders';
import reviewRoutes from './routes/reviews';
import paymentRoutes from './routes/payments';
import couponRoutes from './routes/coupons';
import contactRoutes from './routes/contact';
import newsletterRoutes from './routes/newsletter';
import adminRoutes from './routes/admin';
import sellerRoutes from './routes/seller';
import sellersRoutes from './routes/sellers';
import uploadRoutes from './routes/upload';

const app = express();
const httpServer = http.createServer(app);

// Socket.IO setup
export const io = new SocketServer(httpServer, {
  cors: {
    origin: config.clientUrl,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', socket => {
  socket.on('disconnect', () => {});
});

// Behind a reverse proxy (Render etc.) use the real client IP for rate limiting
app.set('trust proxy', 1);

// Security
// CSP is relaxed because the storefront loads Razorpay, Google Fonts and remote images
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));

// Global rate limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.nodeEnv === 'production' ? 300 : 5000,
  message: { message: 'Too many requests, please try again later' },
}));

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
}

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: config.nodeEnv });
});

// Diagnostics: shows what is misconfigured without exposing any secret values
app.get('/api/diagnostics', async (_req, res) => {
  let db = 'not attempted';
  if (!missingEnv.length) {
    try { await connectDatabase(); db = 'connected'; } catch (err) { db = (err as Error).message; }
  }
  res.json({
    ok: !missingEnv.length && db === 'connected',
    missingEnv,
    database: db,
    emailVerification: config.autoVerifyEmail ? 'auto-verify on' : 'email link required',
    payments: config.allowMockPayments ? 'simulated allowed' : 'razorpay required in production',
  });
});

// Serverless (Vercel): connect lazily and reuse the connection across invocations
if (config.isVercel) {
  app.use('/api', async (_req, res, next) => {
    if (missingEnv.length) {
      res.status(503).json({ success: false, message: `Server is not configured: set ${missingEnv.join(', ')} in the Vercel project's environment variables and redeploy.` });
      return;
    }
    try { await connectDatabase(); next(); } catch (err) { next(err); }
  });
}

// Scheduled job entry point (Vercel Cron sends Authorization: Bearer $CRON_SECRET)
app.get('/api/cron/abandoned-cart', async (req, res, next) => {
  try {
    const secret = process.env.CRON_SECRET;
    if (!secret || req.headers.authorization !== `Bearer ${secret}`) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    await sendAbandonedCartEmails();
    res.json({ success: true });
  } catch (err) { next(err); }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/sellers', sellersRoutes);
app.use('/api/upload', uploadRoutes);

// Serve the built frontend (single-service deployment)
const clientDist = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(path.join(clientDist, 'index.html'))) {
  app.use(express.static(clientDist, { maxAge: '1h', index: false }));
  app.get(/^\/(?!api\/|socket\.io\/|health).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// 404 and error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const start = async () => {
  await connectDatabase();
  startAbandonedCartCron();
  httpServer.listen(config.port, () => {
    console.log(`Server running on port ${config.port} [${config.nodeEnv}]`);
  });
};

if (config.nodeEnv !== 'test' && !config.isVercel) {
  start().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

export default app;
