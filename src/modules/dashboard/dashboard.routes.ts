import { Router } from 'express';

import { authenticate } from '@/middlewares/authenticate';
import { authorize } from '@/middlewares/authorize';
import { DashboardController } from '@/modules/dashboard/dashboard.controller';

export const dashboardRoutes = Router();

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard statistics (Admin, Manager, Employee)
 *     description: Returns total product count, total sale count, and products with stockQuantity < 5.
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Dashboard statistics retrieved successfully }
 *                 data: { $ref: '#/components/schemas/DashboardStats' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
dashboardRoutes.get(
  '/stats',
  authenticate,
  authorize('admin', 'manager', 'employee'),
  DashboardController.stats,
);
