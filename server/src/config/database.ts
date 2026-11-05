import mongoose from 'mongoose';
import { config } from './env';
import { createError } from '../middleware/errorHandler';

const connect = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) return; // already connected (warm serverless instance)
  if (inflight) return inflight;
  inflight = doConnect().finally(() => { inflight = null; });
  return inflight;
};

let inflight: Promise<void> | null = null;

const doConnect = async (): Promise<void> => {
  let attempts = 0;
  const maxAttempts = config.isVercel ? 1 : 5; // serverless requests must fail fast

  while (attempts < maxAttempts) {
    try {
      await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: config.isVercel ? 8000 : 30000 });
      console.log('MongoDB connected');
      return;
    } catch (err) {
      attempts++;
      console.error(`MongoDB connection attempt ${attempts} failed:`, (err as Error).message);
      if (attempts === maxAttempts) {
        throw createError(`Database connection failed: ${(err as Error).message}`, 503);
      }
      await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
    }
  }
};

export default connect;
