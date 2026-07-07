import { model, Schema } from 'mongoose';

import { USER_ROLES } from '@/modules/user/user.interface';
import type { IRole } from '@/modules/role/role.interface';

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      enum: USER_ROLES,
      required: true,
      unique: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Role = model<IRole>('Role', roleSchema);
