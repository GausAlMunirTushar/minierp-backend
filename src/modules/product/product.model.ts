import { model, Schema } from 'mongoose';

import type { IProduct } from '@/modules/product/product.interface';

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: 80,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    purchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

productSchema.index({ name: 'text', sku: 'text', category: 'text' });

export const Product = model<IProduct>('Product', productSchema);
