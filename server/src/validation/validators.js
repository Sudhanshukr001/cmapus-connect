// server/src/validation/validators.js
import validator from 'validator';
import { ValidationError } from '../utils/errors.js';
import Listing from '../models/Listing.js';
import Event from '../models/Event.js';

const isStr = (v) => typeof v === 'string';
const clean = (v) => (isStr(v) ? v.trim() : v);

export function validateRegister(body = {}) {
  const { name, email, password, campus } = body;
  const errors = [];
  if (!isStr(name) || name.trim().length < 2) errors.push('Name is required');
  if (!isStr(email) || !validator.isEmail(email)) errors.push('A valid email is required');
  if (!isStr(password) || password.length < 6) errors.push('Password must be at least 6 characters');
  if (errors.length) throw new ValidationError('Invalid registration', errors);
  return { name: name.trim(), email: email.trim().toLowerCase(), password, campus: campus?.trim() || 'Campus' };
}

export function validateLogin(body = {}) {
  const { email, password } = body;
  if (!isStr(email) || !isStr(password)) throw new ValidationError('Email and password are required');
  return { email: email.trim().toLowerCase(), password };
}

export function validateListing(body = {}) {
  const errors = [];
  const title = clean(body.title);
  const description = clean(body.description) || '';
  const price = Number(body.price);
  const category = clean(body.category);
  const condition = clean(body.condition) || 'good';
  const location = clean(body.location) || '';
  const images = Array.isArray(body.images) ? body.images.filter(isStr).slice(0, 8) : [];

  if (!title || title.length < 2) errors.push('Title is required');
  if (!Number.isFinite(price) || price < 0) errors.push('A valid price is required');
  if (!category || !Listing.CATEGORIES.includes(category)) errors.push('A valid category is required');
  if (condition && !Listing.CONDITIONS.includes(condition)) errors.push('Invalid condition');
  if (errors.length) throw new ValidationError('Invalid listing', errors);

  return { title, description, price, category, condition, location, images };
}

export function validateEvent(body = {}) {
  const errors = [];
  const title = clean(body.title);
  const description = clean(body.description) || '';
  const category = clean(body.category);
  const location = clean(body.location) || '';
  const cover = clean(body.cover) || '';
  const startTime = new Date(body.startTime);
  const endTime = body.endTime ? new Date(body.endTime) : undefined;

  if (!title || title.length < 2) errors.push('Title is required');
  if (!category || !Event.CATEGORIES.includes(category)) errors.push('A valid category is required');
  if (isNaN(startTime.getTime())) errors.push('A valid start time is required');
  if (endTime && isNaN(endTime.getTime())) errors.push('Invalid end time');
  if (errors.length) throw new ValidationError('Invalid event', errors);

  return { title, description, category, location, cover, startTime, endTime };
}

export function validateMessage(body = {}) {
  const body_text = clean(body.body);
  const attachments = Array.isArray(body.attachments) ? body.attachments.filter(isStr).slice(0, 4) : [];
  if (!body_text && attachments.length === 0) throw new ValidationError('Message cannot be empty');
  return { body: body_text, attachments };
}
