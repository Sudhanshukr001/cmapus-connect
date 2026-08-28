// server/src/utils/errors.js
export class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
    this.isOperational = true;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') { super(message, 404); }
}
export class AuthError extends AppError {
  constructor(message = 'Unauthorized') { super(message, 401); }
}
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') { super(message, 403); }
}
export class ValidationError extends AppError {
  constructor(message, details = null) { super(message, 422); this.details = details; }
}
