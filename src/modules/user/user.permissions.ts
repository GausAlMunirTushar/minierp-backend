import type { SafeUser, UserRole } from '@/modules/user/user.interface';

const rolePermissions: Record<UserRole, string[]> = {
  admin: [
    'dashboard.view',
    'products.view',
    'products.create',
    'products.update',
    'products.delete',
    'sales.view',
    'sales.create',
  ],
  manager: [
    'dashboard.view',
    'products.view',
    'products.create',
    'products.update',
    'sales.view',
    'sales.create',
  ],
  employee: ['dashboard.view', 'products.view', 'sales.create'],
};

/**
 * Returns static permissions assigned to a Mini ERP role.
 *
 * @param role - User role
 * @returns Permission keys used by backend policies and frontend navigation
 */
export const getRolePermissions = (role: UserRole): string[] => rolePermissions[role] ?? [];

/**
 * Adds frontend-friendly role and permission fields to a safe user payload.
 *
 * @param user - Safe user profile
 * @returns User profile with role arrays and permissions
 */
export const enrichUserPermissions = (user: SafeUser) => ({
  ...user,
  roles: [user.role],
  permissions: getRolePermissions(user.role),
});
