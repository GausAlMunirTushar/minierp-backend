import { ALL_PERMISSIONS } from '@/modules/role/role.interface';
import { getRoles, updateRolePermissions } from '@/modules/role/role.service';
import type { UserRole } from '@/modules/user/user.interface';
import { catchAsync } from '@/utils/catchAsync';
import { sendResponse } from '@/utils/sendResponse';

/**
 * Handles role HTTP requests.
 */
export const RoleController = {
  list: catchAsync(async (_req, res) => {
    const roles = await getRoles();

    sendResponse(res, {
      statusCode: 200,
      message: 'Roles retrieved successfully',
      data: { roles, allPermissions: ALL_PERMISSIONS },
    });
  }),

  update: catchAsync(async (req, res) => {
    const role = await updateRolePermissions(req.params.name as UserRole, req.body);

    sendResponse(res, {
      statusCode: 200,
      message: 'Role updated successfully',
      data: role,
    });
  }),
};
