import type { RequestHandler } from 'express';

import { AppError } from '@/utils/AppError';

/**
 * Handles unmatched API routes.
 */
export const notFound: RequestHandler = (req, _res, next) => {
  next(new AppError(404, `Route ${req.originalUrl} not found`));
};
