import type { Document, Types } from 'mongoose';

export type SaleItem = {
  product: Types.ObjectId;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export interface ISale extends Document<Types.ObjectId> {
  items: SaleItem[];
  grandTotal: number;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
