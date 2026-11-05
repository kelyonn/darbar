import mongoose from 'mongoose';
import { config } from './env';

const connect = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) return; // already connected (warm serverless instance)
  if (inflight) return inflight;
  inflight = doConnect().finally(() => { inflight = null; });
  return inflight;
};

let inflight: Promise<void> | null = null;

const doConnect = async (): Promise<void> => {
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    try {
      await mongoose.connect(config.mongoUri);
      console.log('MongoDB connected');
      return;
    } catch (err) {
      attempts++;
      console.error(`MongoDB connection attempt ${attempts} failed:`, (err as Error).message);
      if (attempts === maxAttempts) {
        throw new Error('MongoDB connection failed after maximum attempts');
      }
      await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
    }
  }
};

export default connect;
