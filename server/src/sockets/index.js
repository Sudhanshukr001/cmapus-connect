// server/src/sockets/index.js
import { verifyToken } from '../utils/tokens.js';
import User from '../models/User.js';

export function setupSockets(io) {
  // middleware: authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      const userId = token && verifyToken(token);
      if (!userId) return next(new Error('unauthorized'));
      const user = await User.findById(userId).select('_id name');
      if (!user) return next(new Error('unauthorized'));
      socket.user = user;
      next();
    } catch {
      next(new Error('unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('conversation:join', (conversationId) => {
      if (conversationId) socket.join(`conversation:${conversationId}`);
    });
    socket.on('conversation:leave', (conversationId) => {
      if (conversationId) socket.leave(`conversation:${conversationId}`);
    });
    socket.on('event:join', (eventId) => {
      if (eventId) socket.join(`event:${eventId}`);
    });
    socket.on('typing', ({ conversationId, isTyping }) => {
      if (!conversationId) return;
      socket.to(`conversation:${conversationId}`).emit('typing', {
        conversationId, userId: socket.user._id, isTyping: !!isTyping,
      });
    });
    socket.on('disconnect', () => {});
  });

  return io;
}
