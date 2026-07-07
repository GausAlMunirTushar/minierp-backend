import { getRolePermissions } from '@/modules/role/role.service';
import type { SafeUser } from '@/modules/user/user.interface';

/**
 * Adds frontend-friendly role and permission fields to a safe user payload.
 *
 * @param user - Safe user profile
 * @returns User profile with role arrays and permissions
 */
export const enrichUserPermissions = async (user: SafeUser) => ({
  ...user,
  roles: [user.role],
  permissions: await getRolePermissions(user.role),
});
