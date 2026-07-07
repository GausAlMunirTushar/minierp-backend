import { Router } from 'express';

import { authenticate } from '@/middlewares/authenticate';
import { SetupController } from '@/modules/setup/setup.controller';

export const setupRoutes = Router();

/**
 * @swagger
 * /setup:
 *   get:
 *     tags: [Setup]
 *     summary: Get authenticated app bootstrap payload
 *     description: Returns the current user profile (with role/permissions) plus lightweight app metadata, used by the frontend shell on load.
 *     responses:
 *       200:
 *         description: Setup data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Setup data retrieved successfully }
 *                 data:
 *                   type: object
 *                   properties:
 *                     user: { $ref: '#/components/schemas/User' }
 *                     app_version: { type: string, example: 1.0.0 }
 *                     environment: { type: string, example: development }
 *                     language: { type: string, example: en }
 *                     timezone: { type: string, example: Asia/Dhaka }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
setupRoutes.get('/', authenticate, SetupController.setup);
