// server/src/server.js
import { createServer } from 'http';
import { Server } from 'socket.io';
import env from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { createApp } from './app.js';
import { setupSockets } from './sockets/index.js';
import { runSeed } from './seed/seed.js';

async function start() {
  await connectDB();
  await runSeed();

  const app = createApp();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: env.CLIENT_ORIGIN === '*' ? true : env.CLIENT_ORIGIN.split(','), credentials: true },
  });
  setupSockets(io);
  app.set('io', io);

  httpServer.listen(env.PORT, () => {
    console.log(`\n  Campus Connect API → http://localhost:${env.PORT}`);
    console.log('  Realtime (Socket.IO) ready\n');
  });
}

async function shutdown(signal) {
  console.log(`\n[server] ${signal} received — shutting down…`);
  try {
    await disconnectDB();
  } catch (_) { /* ignore */ }
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
