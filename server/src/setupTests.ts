import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Use TEST_MONGODB_URI if provided, otherwise spin up an in-memory MongoDB.
  const sharedUri = process.env.TEST_MONGODB_URI
    ? process.env.TEST_MONGODB_URI.replace(/(\/[^/?]*)(\?|$)/, `$1-w${process.env.JEST_WORKER_ID || 0}$2`) // one DB per jest worker
    : undefined;
  const mongoUri = sharedUri || (mongoServer = await MongoMemoryServer.create()).getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
