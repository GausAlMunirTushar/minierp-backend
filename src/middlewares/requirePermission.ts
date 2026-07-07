import { getRolePermissions } from '@/modules/role/role.service';
import { AppError } from '@/utils/AppError';
import { catchAsync } from '@/utils/catchAsync';

/**
 * Restricts a route to authenticated users whose role has at least one of the
 * given permissions, looked up from the database (see `role.service.ts`).
 *
 * @param permissions - Permissions allowed to access the route (any-of match)
 * @throws {AppError} When the user's role lacks every listed permission
 */
export const requirePermission = (...permissions: string[]) =>
  catchAsync(async (req, _res, next) => {
    if (!req.user) {
      throw new AppError(401, 'Authentication is required');
    }

    const rolePermissions = await getRolePermissions(req.user.role);
    const hasPermission = permissions.some((permission) => rolePermissions.includes(permission));

    if (!hasPermission) {
      throw new AppError(403, 'You do not have permission to perform this action');
    }

    next();
  });
