// server/src/utils/tokens.js
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export function signToken(userId) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    return payload.sub;
  } catch {
    return null;
  }
}
