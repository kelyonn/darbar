import mongoose from 'mongoose';
import { config } from './src/config/env';

mongoose.connect(config.mongoUri).then(async () => {
  const db = mongoose.connection.db;
  if (!db) return;
  const collection = db.collection('users');
  const result = await collection.deleteMany({ email: 'kalyan15122005@gmail.com' });
  console.log(`Deleted ${result.deletedCount} users`);
  process.exit(0);
});
