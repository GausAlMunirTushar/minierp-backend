import type { Document, Types } from 'mongoose';

export interface ICategory extends Document<Types.ObjectId> {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
