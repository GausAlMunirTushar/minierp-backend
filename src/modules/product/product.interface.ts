import type { Document, Types } from 'mongoose';

export interface IProduct extends Document<Types.ObjectId> {
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  image: string;
  imagePublicId: string;
  createdAt: Date;
  updatedAt: Date;
}
