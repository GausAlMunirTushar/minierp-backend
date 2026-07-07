import { ALL_PERMISSIONS } from '@/modules/role/role.interface';
import { Role } from '@/modules/role/role.model';
import type { UpdateRolePayload } from '@/modules/role/role.validation';
import type { UserRole } from '@/modules/user/user.interface';
import { AppError } from '@/utils/AppError';
import logger from '@/lib/logger';

const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [...ALL_PERMISSIONS],
  manager: [
    'dashboard.view',
    'products.view',
    'products.create',
    'products.update',
    'categories.view',
    'categories.create',
    'categories.update',
    'sales.view',
    'sales.create',
  ],
  employee: ['dashboard.view', 'products.view', 'sales.create'],
};

export const getRoles = async () => Role.find().sort('name');

export const getRolePermissions = async (role: UserRole): Promise<string[]> => {
  const roleDoc = await Role.findOne({ name: role }).lean();
  return roleDoc?.permissions ?? [];
};

export const updateRolePermissions = async (name: UserRole, payload: UpdateRolePayload) => {
  const permissions = payload.permissions.filter((permission) =>
    (ALL_PERMISSIONS as readonly string[]).includes(permission),
  );

  const role = await Role.findOneAndUpdate(
    { name },
    { permissions },
    { new: true, upsert: true },
  );

  if (!role) {
    throw new AppError(404, 'Role not found');
  }

  return role;
};

/**
 * Upserts the default role→permissions mapping without overwriting roles that
 * already exist (so an admin's edits survive server restarts).
 */
export const ensureDefaultRoles = async () => {
  await Promise.all(
    Object.entries(DEFAULT_ROLE_PERMISSIONS).map(([name, permissions]) =>
      Role.updateOne(
        { name },
        { $setOnInsert: { name, permissions } },
        { upsert: true },
      ),
    ),
  ).catch((error) => {
    logger.error(error, 'Failed to ensure default roles');
    throw error;
  });
};
