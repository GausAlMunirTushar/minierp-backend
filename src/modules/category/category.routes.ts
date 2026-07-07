import { Router } from 'express';

import { authenticate } from '@/middlewares/authenticate';
import { requirePermission } from '@/middlewares/requirePermission';
import { validate } from '@/middlewares/validate';
import { CategoryController } from '@/modules/category/category.controller';
import {
  categoryIdValidationSchema,
  categoryListValidationSchema,
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
} from '@/modules/category/category.validation';

export const categoryRoutes = Router();

categoryRoutes.use(authenticate);

/**
 * @swagger
 * /categories:
 *   post:
 *     tags: [Categories]
 *     summary: Create a category (Admin, Manager)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: Electronics }
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Category created successfully }
 *                 data: { $ref: '#/components/schemas/Category' }
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *   get:
 *     tags: [Categories]
 *     summary: List categories (Admin, Manager, Employee)
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema: { type: string, example: name }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Categories retrieved successfully }
 *                 data: { type: array, items: { $ref: '#/components/schemas/Category' } }
 *                 meta: { $ref: '#/components/schemas/PaginationMeta' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
categoryRoutes
  .route('/')
  .post(
    requirePermission('categories.create'),
    validate(createCategoryValidationSchema),
    CategoryController.create,
  )
  .get(
    requirePermission('categories.view'),
    validate(categoryListValidationSchema),
    CategoryController.list,
  );

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Get a category by id (Admin, Manager, Employee)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Category retrieved successfully }
 *                 data: { $ref: '#/components/schemas/Category' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     tags: [Categories]
 *     summary: Update a category (Admin, Manager)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Category updated successfully }
 *                 data: { $ref: '#/components/schemas/Category' }
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     tags: [Categories]
 *     summary: Delete a category (Admin, Manager)
 *     description: Fails with 400 if any product still references this category's name.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Category deleted successfully }
 *                 data: { $ref: '#/components/schemas/Category' }
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
categoryRoutes
  .route('/:id')
  .get(
    requirePermission('categories.view'),
    validate(categoryIdValidationSchema),
    CategoryController.details,
  )
  .patch(
    requirePermission('categories.update'),
    validate(updateCategoryValidationSchema),
    CategoryController.update,
  )
  .delete(
    requirePermission('categories.delete'),
    validate(categoryIdValidationSchema),
    CategoryController.delete,
  );
