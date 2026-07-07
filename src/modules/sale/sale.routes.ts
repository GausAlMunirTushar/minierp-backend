import { Router } from 'express';

import { authenticate } from '@/middlewares/authenticate';
import { requirePermission } from '@/middlewares/requirePermission';
import { validate } from '@/middlewares/validate';
import { SaleController } from '@/modules/sale/sale.controller';
import {
  createSaleValidationSchema,
  saleListValidationSchema,
} from '@/modules/sale/sale.validation';

export const saleRoutes = Router();

saleRoutes.use(authenticate);

/**
 * @swagger
 * /sales:
 *   post:
 *     tags: [Sales]
 *     summary: Create a sale (Admin, Manager, Employee)
 *     description: >
 *       Accepts one or more product/quantity line items. Stock is atomically validated and
 *       reduced per item; the request fails with 400 if any item has insufficient stock or
 *       duplicate products are supplied. Grand total is calculated and stored server-side.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items: { $ref: '#/components/schemas/SaleItemInput' }
 *     responses:
 *       201:
 *         description: Sale created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Sale created successfully }
 *                 data: { $ref: '#/components/schemas/Sale' }
 *       400:
 *         description: Validation failed, insufficient stock, or duplicate product in items
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: One or more products were not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *   get:
 *     tags: [Sales]
 *     summary: List sale history (Admin, Manager)
 *     parameters:
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
 *         description: Sales retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Sales retrieved successfully }
 *                 data: { type: array, items: { $ref: '#/components/schemas/Sale' } }
 *                 meta: { $ref: '#/components/schemas/PaginationMeta' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
saleRoutes
  .route('/')
  .post(
    requirePermission('sales.create'),
    validate(createSaleValidationSchema),
    SaleController.create,
  )
  .get(requirePermission('sales.view'), validate(saleListValidationSchema), SaleController.list);
