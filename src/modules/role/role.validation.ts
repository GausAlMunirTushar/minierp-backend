import { z } from 'zod';

import { USER_ROLES } from '@/modules/user/user.interface';

export const updateRoleValidationSchema = z.object({
  params: z.object({
    name: z.enum(USER_ROLES),
  }),
  body: z.object({
    permissions: z.array(z.string()),
  }),
});

export const roleNameValidationSchema = z.object({
  params: z.object({
    name: z.enum(USER_ROLES),
  }),
});

export type UpdateRolePayload = z.infer<typeof updateRoleValidationSchema>['body'];
