// server/src/middleware/auth.js
import User from '../models/User.js';
import { verifyToken } from '../utils/tokens.js';
import { AuthError } from '../utils/errors.js';

export async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    const userId = token && verifyToken(token);
    if (!userId) throw new AuthError('Authentication required');
    const user = await User.findById(userId);
    if (!user) throw new AuthError('Account no longer exists');
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const userId = token && verifyToken(token);
  if (userId) {
    User.findById(userId).then((u) => { req.user = u || null; next(); }).catch(() => { req.user = null; next(); });
  } else {
    req.user = null;
    next();
  }
}
