// server/src/app.js
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import env from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import listingRoutes from './routes/listing.routes.js';
import eventRoutes from './routes/event.routes.js';
import conversationRoutes from './routes/conversation.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';
import searchRoutes from './routes/search.routes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();
  app.use(cors({ origin: env.CLIENT_ORIGIN === '*' ? true : env.CLIENT_ORIGIN.split(','), credentials: true }));
  app.use(express.json({ limit: '1mb' }));

  const limiter = rateLimit({ windowMs: 60 * 1000, max: env.RATE_LIMIT_MAX, standardHeaders: true });
  app.use('/api', limiter);

  app.get('/api/health', (_req, res) => res.json({ success: true, uptime: process.uptime() }));
  app.use('/api/auth', authRoutes);
  app.use('/api/listings', listingRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/conversations', conversationRoutes);
  app.use('/api/conversations', messageRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/search', searchRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

export default createApp;
