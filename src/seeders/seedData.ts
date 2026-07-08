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

export const DEFAULT_PRODUCTS = [
  {
    name: 'Wireless Mouse',
    sku: 'MS-WIRELESS-01',
    category: 'Electronics',
    purchasePrice: 10,
    sellingPrice: 18,
    stockQuantity: 50,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=300&auto=format&fit=crop',
    imagePublicId: 'placeholder_mouse',
  },
  {
    name: 'Mechanical Keyboard',
    sku: 'KB-MECH-02',
    category: 'Electronics',
    purchasePrice: 45,
    sellingPrice: 75,
    stockQuantity: 25,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=300&auto=format&fit=crop',
    imagePublicId: 'placeholder_keyboard',
  },
  {
    name: 'Premium Gel Pens (12 Pack)',
    sku: 'PN-GEL-12',
    category: 'Stationery',
    purchasePrice: 4,
    sellingPrice: 8,
    stockQuantity: 100,
    image: 'https://images.unsplash.com/photo-1585336139080-b019d0b2d3dd?q=80&w=300&auto=format&fit=crop',
    imagePublicId: 'placeholder_pens',
  },
  {
    name: 'Ergonomic Office Chair',
    sku: 'CH-ERGO-03',
    category: 'Furniture',
    purchasePrice: 120,
    sellingPrice: 199,
    stockQuantity: 15,
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=300&auto=format&fit=crop',
    imagePublicId: 'placeholder_chair',
  },
  {
    name: 'Stainless Steel Water Bottle',
    sku: 'BT-STEEL-04',
    category: 'Office Supplies',
    purchasePrice: 8,
    sellingPrice: 15,
    stockQuantity: 40,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=300&auto=format&fit=crop',
    imagePublicId: 'placeholder_bottle',
  },
];

