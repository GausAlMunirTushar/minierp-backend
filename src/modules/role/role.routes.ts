import { Router } from 'express';

import { authenticate } from '@/middlewares/authenticate';
import { authorize } from '@/middlewares/authorize';
import { validate } from '@/middlewares/validate';
import { RoleController } from '@/modules/role/role.controller';
import { updateRoleValidationSchema } from '@/modules/role/role.validation';

export const roleRoutes = Router();

roleRoutes.use(authenticate);

/**
 * @swagger
 * /roles:
 *   get:
 *     tags: [Roles]
 *     summary: List roles and their permissions (Admin only)
 *     responses:
 *       200:
 *         description: Roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Roles retrieved successfully }
 *                 data:
 *                   type: object
 *                   properties:
 *                     roles: { type: array, items: { $ref: '#/components/schemas/Role' } }
 *                     allPermissions: { type: array, items: { type: string } }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
roleRoutes.get('/', authorize('admin'), RoleController.list);

/**
 * @swagger
 * /roles/{name}:
 *   patch:
 *     tags: [Roles]
 *     summary: Update a role's permissions (Admin only)
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema: { type: string, enum: [admin, manager, employee] }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [permissions]
 *             properties:
 *               permissions:
 *                 type: array
 *                 items: { type: string }
 *                 example: ['dashboard.view', 'products.view']
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Role updated successfully }
 *                 data: { $ref: '#/components/schemas/Role' }
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
roleRoutes.patch(
  '/:name',
  authorize('admin'),
  validate(updateRoleValidationSchema),
  RoleController.update,
);
