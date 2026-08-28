// server/src/controllers/authController.js
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken } from '../utils/tokens.js';
import { ok, fail } from '../utils/apiResponse.js';
import { publicUser } from '../utils/serialize.js';
import { validateRegister, validateLogin } from '../validation/validators.js';
import { AuthError } from '../utils/errors.js';

export async function register(req, res, next) {
  try {
    const data = validateRegister(req.body);
    const exists = await User.findOne({ email: data.email });
    if (exists) return fail(res, 'An account with this email already exists', 409);
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await User.create({ ...data, passwordHash, verified: true });
    const token = signToken(user._id.toString());
    return ok(res, { token, user: publicUser(user) }, null, 201);
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = validateLogin(req.body);
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new AuthError('Incorrect email or password');
    }
    const token = signToken(user._id.toString());
    return ok(res, { token, user: publicUser(user) });
  } catch (err) { next(err); }
}

export async function me(req, res) {
  return ok(res, { user: publicUser(req.user) });
}
