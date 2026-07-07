import type { Request } from 'express';

import type {
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '@/modules/category/category.validation';
import { Category } from '@/modules/category/category.model';
import { Product } from '@/modules/product/product.model';
import { AppError } from '@/utils/AppError';
import { buildQuery } from '@/utils/queryBuilder';

export const createCategory = async (payload: CreateCategoryPayload) => {
  const existing = await Category.findOne({ name: payload.name });

  if (existing) {
    throw new AppError(400, 'Category already exists');
  }

  return Category.create(payload);
};

export const getCategories = async (query: Request['query']) =>
  buildQuery(Category, query, ['name']);

export const getCategoryById = async (id: string) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  return category;
};

export const updateCategory = async (id: string, payload: UpdateCategoryPayload) => {
  const category = await getCategoryById(id);

  if (payload.name !== category.name) {
    const duplicate = await Category.findOne({ name: payload.name });

    if (duplicate) {
      throw new AppError(400, 'Category already exists');
    }
  }

  category.name = payload.name;
  await category.save();

  return category;
};

export const deleteCategory = async (id: string) => {
  const category = await getCategoryById(id);

  const inUse = await Product.exists({ category: category.name });

  if (inUse) {
    throw new AppError(400, 'Cannot delete a category that is in use by products');
  }

  await category.deleteOne();

  return category;
};
