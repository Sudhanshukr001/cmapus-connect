// server/src/config/env.js
import dotenv from 'dotenv';
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 4000,
  JWT_SECRET: process.env.JWT_SECRET || 'campus-connect-dev-secret-change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  MONGODB_URI: process.env.MONGODB_URI || '', // empty => use in-memory server
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || '*',
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX) || 200,
};

export default env;
