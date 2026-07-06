import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Wraps async Express handlers and forwards rejected promises to error middleware.
 *
 * @param fn - Async route handler
 * @returns Express request handler
 */
export const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
