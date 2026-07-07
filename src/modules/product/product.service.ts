import type { Request } from 'express';

import type {
  CreateProductPayload,
  UpdateProductPayload,
} from '@/modules/product/product.validation';
import { Product } from '@/modules/product/product.model';
import { AppError } from '@/utils/AppError';
import { buildQuery } from '@/utils/queryBuilder';
import { deleteImage, uploadProductImage } from '@/config/cloudinary';

export const createProduct = async (payload: CreateProductPayload, file?: Express.Multer.File) => {
  if (!file) {
    throw new AppError(400, 'Product image is required');
  }

  if (payload.sellingPrice <= payload.purchasePrice) {
    throw new AppError(400, 'Selling price must be greater than purchase price');
  }

  const { url, publicId } = await uploadProductImage(file);

  return Product.create({
    ...payload,
    sku: payload.sku.toUpperCase(),
    image: url,
    imagePublicId: publicId,
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
  if (payload.purchasePrice !== undefined && payload.sellingPrice !== undefined) {
    if (payload.sellingPrice <= payload.purchasePrice) {
      throw new AppError(400, 'Selling price must be greater than purchase price');
    }
  }

  const updatePayload: Record<string, unknown> = {
    ...payload,
    ...(payload.sku ? { sku: payload.sku.toUpperCase() } : {}),
  };

  if (file) {
    const existingProduct = await Product.findById(id).select('imagePublicId');

    const { url, publicId } = await uploadProductImage(file);
    updatePayload.image = url;
    updatePayload.imagePublicId = publicId;

    if (existingProduct?.imagePublicId) {
      deleteImage(existingProduct.imagePublicId);
    }
  }

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

  deleteImage(product.imagePublicId);

  return product;
};
