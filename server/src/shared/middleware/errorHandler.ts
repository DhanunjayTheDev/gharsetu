import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';
import logger from '../utils/logger';
import config from '../../config';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    sendError(res, err.message, 400);
    return;
  }

  // Mongoose duplicate key
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue || {})[0];
    sendError(res, `Duplicate value for field: ${field}`, 409);
    return;
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    sendError(res, 'Invalid ID format', 400);
    return;
  }

  logger.error('Unhandled error:', err);
  sendError(
    res,
    config.env === 'production' ? 'Internal server error' : err.message,
    500
  );
};
