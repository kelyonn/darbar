import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { startAbandonedCartCron } from './utils/abandonedCartCron';

import { config } from './config/env';
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

// Security
app.use(helmet());
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));

// Global rate limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
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

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
