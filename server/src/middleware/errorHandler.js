// server/src/middleware/errorHandler.js
import { ValidationError, AppError } from '../utils/errors.js';
import { fail } from '../utils/apiResponse.js';

export function notFound(_req, res) {
  fail(res, 'Route not found', 404);
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof ValidationError) return fail(res, err.message, 422, err.details);
  if (err instanceof AppError) return fail(res, err.message, err.status);
  if (err.name === 'ValidationError' && err.errors) {
    const details = Object.values(err.errors).map((e) => e.message);
    return fail(res, 'Validation failed', 422, details);
  }
  if (err.code === 11000) return fail(res, 'A duplicate record already exists', 409);
  console.error('[error]', err);
  return fail(res, 'Something went wrong on our side', 500);
}
