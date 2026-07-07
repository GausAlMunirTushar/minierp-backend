import { Router } from 'express';

import { productImageUpload } from '@/config/upload';
import { authenticate } from '@/middlewares/authenticate';
import { requirePermission } from '@/middlewares/requirePermission';
import { validate } from '@/middlewares/validate';
import { ProductController } from '@/modules/product/product.controller';
import {
  createProductValidationSchema,
  productIdValidationSchema,
  productListValidationSchema,
  updateProductValidationSchema,
} from '@/modules/product/product.validation';

export const productRoutes = Router();

productRoutes.use(authenticate);

/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Create a product (Admin, Manager)
 *     description: Product image is required. Send as multipart/form-data.
 *     consumes: [multipart/form-data]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, sku, category, purchasePrice, sellingPrice, stockQuantity, image]
 *             properties:
 *               name: { type: string, example: Wireless Mouse }
 *               sku: { type: string, example: WM-1001 }
 *               category: { type: string, example: Electronics }
 *               purchasePrice: { type: number, example: 8.5 }
 *               sellingPrice: { type: number, example: 14.99 }
 *               stockQuantity: { type: integer, example: 42 }
 *               image: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Product created successfully }
 *                 data: { $ref: '#/components/schemas/Product' }
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *   get:
 *     tags: [Products]
 *     summary: List products (Admin, Manager, Employee)
 *     description: Supports case-insensitive search across name/sku/category, category filter, sort, and pagination.
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Free-text search across name, sku, category
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema: { type: string, example: -createdAt }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Products retrieved successfully }
 *                 data: { type: array, items: { $ref: '#/components/schemas/Product' } }
 *                 meta: { $ref: '#/components/schemas/PaginationMeta' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
productRoutes
  .route('/')
  .post(
    requirePermission('products.create'),
    productImageUpload.single('image'),
    validate(createProductValidationSchema),
    ProductController.create,
  )
  .get(
    requirePermission('products.view'),
    validate(productListValidationSchema),
    ProductController.list,
  );

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get a product by id (Admin, Manager, Employee)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Product retrieved successfully }
 *                 data: { $ref: '#/components/schemas/Product' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     tags: [Products]
 *     summary: Update a product (Admin, Manager)
 *     description: Product image is optional on update. Send as multipart/form-data.
 *     consumes: [multipart/form-data]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               sku: { type: string }
 *               category: { type: string }
 *               purchasePrice: { type: number }
 *               sellingPrice: { type: number }
 *               stockQuantity: { type: integer }
 *               image: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Product updated successfully }
 *                 data: { $ref: '#/components/schemas/Product' }
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     tags: [Products]
 *     summary: Delete a product (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Product deleted successfully }
 *                 data: { $ref: '#/components/schemas/Product' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
productRoutes
  .route('/:id')
  .get(
    requirePermission('products.view'),
    validate(productIdValidationSchema),
    ProductController.details,
  )
  .patch(
    requirePermission('products.update'),
    productImageUpload.single('image'),
    validate(updateProductValidationSchema),
    ProductController.update,
  )
  .delete(requirePermission('products.delete'), validate(productIdValidationSchema), ProductController.delete);
