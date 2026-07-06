import type { Document, Types } from 'mongoose';

export const USER_ROLES = ['admin', 'manager', 'employee'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface IUser extends Document<Types.ObjectId> {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};
