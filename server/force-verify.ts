import mongoose from 'mongoose';
import { config } from './src/config/env';

mongoose.connect(config.mongoUri).then(async () => {
  const db = mongoose.connection.db;
  if (!db) return;
  const collection = db.collection('users');
  const result = await collection.updateOne({ email: 'kalyan15122005@gmail.com' }, { $set: { isEmailVerified: true, verificationToken: null, verificationTokenExpiry: null } });
  console.log(`Verified ${result.modifiedCount} users`);
  process.exit(0);
});
