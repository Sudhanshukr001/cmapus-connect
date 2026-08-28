// server/src/config/db.js
// Connects to MongoDB. If MONGODB_URI is not provided, spins up an
// in-memory MongoDB instance so the project runs with zero external setup.
import fs from 'fs';
import path from 'path';
import os from 'os';
import mongoose from 'mongoose';
import env from './env.js';

let memoryServer = null;

// /tmp on this box is a small tmpfs; put the in-memory mongod's data dir on a
// filesystem with real space so it doesn't hit EDQUOT and abort mid-seed.
const MONGO_TMP = process.env.MONGOMS_TMP_DIR
  || path.join(process.cwd(), '.mongotmp');

export async function connectDB() {
  if (env.MONGODB_URI) {
    await mongoose.connect(env.MONGODB_URI);
    console.log('[db] connected to MongoDB (MONGODB_URI)');
    return mongoose.connection;
  }

  fs.mkdirSync(MONGO_TMP, { recursive: true });
  const dbPath = fs.mkdtempSync(path.join(MONGO_TMP, 'mongo-mem-'));

  // Lazy-load memory server only when needed (dev / zero-config).
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create({ instance: { dbPath } });
  const uri = memoryServer.getUri();
  await mongoose.connect(uri);
  console.log('[db] connected to in-memory MongoDB');
  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
}

export default { connectDB, disconnectDB };
