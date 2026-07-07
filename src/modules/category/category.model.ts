import { model, Schema } from 'mongoose';

import type { ICategory } from '@/modules/category/category.interface';

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Category = model<ICategory>('Category', categorySchema);
