import fs from 'node:fs';
import path from 'node:path';

import type { Request } from 'express';

import type {
  CreateProductPayload,
  UpdateProductPayload,
} from '@/modules/product/product.validation';
import { Product } from '@/modules/product/product.model';
import { AppError } from '@/utils/AppError';
import { buildQuery } from '@/utils/queryBuilder';
import logger from '@/lib/logger';

const getImageUrl = (file?: Express.Multer.File): string | undefined =>
  file ? `/uploads/products/${file.filename}` : undefined;

const deleteImageFile = (imagePath?: string): void => {
  if (!imagePath || !imagePath.startsWith('/uploads/')) return;

  const fullPath = path.join(process.cwd(), imagePath);

  fs.unlink(fullPath, (error) => {
    if (error && (error as NodeJS.ErrnoException).code !== 'ENOENT') {
      logger.warn({ path: fullPath }, 'Failed to delete product image file');
    }
  });
};

export const createProduct = async (payload: CreateProductPayload, file?: Express.Multer.File) => {
  const image = getImageUrl(file);

  if (!image) {
    throw new AppError(400, 'Product image is required');
  }

  if (payload.sellingPrice <= payload.purchasePrice) {
    throw new AppError(400, 'Selling price must be greater than purchase price');
  }

  return Product.create({
    ...payload,
    sku: payload.sku.toUpperCase(),
    image,
  });
};

export const getProducts = async (query: Request['query']) =>
  buildQuery(Product, query, ['name', 'sku', 'category']);

export const getProductById = async (id: string) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  return product;
};

export const updateProduct = async (
  id: string,
  payload: UpdateProductPayload,
  file?: Express.Multer.File,
) => {
  const image = getImageUrl(file);

  if (payload.purchasePrice !== undefined && payload.sellingPrice !== undefined) {
    if (payload.sellingPrice <= payload.purchasePrice) {
      throw new AppError(400, 'Selling price must be greater than purchase price');
    }
  }

  if (image) {
    const existingProduct = await Product.findById(id).select('image');
    if (existingProduct?.image) {
      deleteImageFile(existingProduct.image);
    }
  }

  const updatePayload = {
    ...payload,
    ...(payload.sku ? { sku: payload.sku.toUpperCase() } : {}),
    ...(image ? { image } : {}),
  };

  const product = await Product.findByIdAndUpdate(id, updatePayload, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  return product;
};

export const deleteProduct = async (id: string) => {
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  deleteImageFile(product.image);

  return product;
};
