import mongoose from 'mongoose';
import User from './src/models/User';
import { config } from './src/config/env';

mongoose.connect(config.mongoUri).then(async () => {
  const users = await User.find({ email: /kalyan15122005/i });
  console.log(`Found ${users.length} users with email kalyan15122005`);
  for (const u of users) {
    console.log(u.email);
  }
  process.exit(0);
});
