import type { Request } from 'express';

import type {
  CreateProductPayload,
  UpdateProductPayload,
} from '@/modules/product/product.validation';
import { Product } from '@/modules/product/product.model';
import { AppError } from '@/utils/AppError';
import { buildQuery } from '@/utils/queryBuilder';

const getImageUrl = (file?: Express.Multer.File): string | undefined =>
  file ? `/uploads/products/${file.filename}` : undefined;

/**
 * Creates a product and stores the uploaded image path.
 *
 * @param payload - Product fields
 * @param file - Required uploaded product image
 * @returns Created product
 * @throws {AppError} When image is missing
 */
export const createProduct = async (payload: CreateProductPayload, file?: Express.Multer.File) => {
  const image = getImageUrl(file);

  if (!image) {
    throw new AppError(400, 'Product image is required');
  }

  return Product.create({
    ...payload,
    sku: payload.sku.toUpperCase(),
    image,
  });
};

/**
 * Returns searchable and paginated products.
 *
 * @param query - Product list query parameters
 * @returns Paginated product list
 */
export const getProducts = async (query: Request['query']) =>
  buildQuery(Product, query, ['name', 'sku', 'category']);

/**
 * Returns one product by id.
 *
 * @param id - Product id
 * @returns Product document
 * @throws {AppError} When product does not exist
 */
export const getProductById = async (id: string) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  return product;
};

/**
 * Updates product fields and optionally replaces image path.
 *
 * @param id - Product id
 * @param payload - Partial product fields
 * @param file - Optional product image
 * @returns Updated product
 * @throws {AppError} When product does not exist
 */
export const updateProduct = async (
  id: string,
  payload: UpdateProductPayload,
  file?: Express.Multer.File,
) => {
  const image = getImageUrl(file);
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

/**
 * Deletes a product by id.
 *
 * @param id - Product id
 * @returns Deleted product
 * @throws {AppError} When product does not exist
 */
export const deleteProduct = async (id: string) => {
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  return product;
};
