import type { Document, Types } from 'mongoose';

import type { UserRole } from '@/modules/user/user.interface';

export const ALL_PERMISSIONS = [
  'dashboard.view',
  'products.view',
  'products.create',
  'products.update',
  'products.delete',
  'categories.view',
  'categories.create',
  'categories.update',
  'categories.delete',
  'sales.view',
  'sales.create',
] as const;

export type Permission = (typeof ALL_PERMISSIONS)[number];

export interface IRole extends Document<Types.ObjectId> {
  name: UserRole;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}
