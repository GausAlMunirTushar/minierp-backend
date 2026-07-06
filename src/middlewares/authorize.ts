import type { RequestHandler } from 'express';

import type { UserRole } from '@/modules/user/user.interface';
import { AppError } from '@/utils/AppError';

/**
 * Restricts a route to authenticated users with one of the provided roles.
 *
 * @param roles - Roles allowed to access the route
 * @throws {AppError} When the user role is not permitted
 */
export const authorize =
  (...roles: UserRole[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) {
      next(new AppError(401, 'Authentication is required'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError(403, 'You do not have permission to perform this action'));
      return;
    }

    next();
  };
