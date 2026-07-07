import type { UserRole } from '@/modules/user/user.interface';
import { ALL_PERMISSIONS } from '@/modules/role/role.interface';

export const DEFAULT_USERS: Array<{
  name: string;
  email: string;
  password: string;
  role: UserRole;
}> = [
  {
    name: 'Admin User',
    email: 'admin@minierp.com',
    password: 'Password123!',
    role: 'admin',
  },
  {
    name: 'Manager User',
    email: 'manager@minierp.com',
    password: 'Password123!',
    role: 'manager',
  },
  {
    name: 'Employee User',
    email: 'employee@minierp.com',
    password: 'Password123!',
    role: 'employee',
  },
];

export const DEFAULT_ROLES: Record<UserRole, string[]> = {
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

export const DEFAULT_CATEGORIES = [
  'Electronics',
  'Stationery',
  'Office Supplies',
  'Furniture',
  'Food & Beverages',
];
