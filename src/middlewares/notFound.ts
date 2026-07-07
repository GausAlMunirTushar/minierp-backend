import type { RequestHandler } from 'express';

import { AppError } from '@/utils/AppError';
import logger from '@/lib/logger';

export const notFound: RequestHandler = (req, _res, next) => {
  logger.warn({ method: req.method, url: req.originalUrl }, 'Route not found');
  next(new AppError(404, `Route ${req.originalUrl} not found`));
};
