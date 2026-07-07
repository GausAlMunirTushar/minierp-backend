import { Router } from 'express';

import { AuthController } from '@/modules/auth/auth.controller';
import { loginValidationSchema } from '@/modules/auth/auth.validation';
import { validate } from '@/middlewares/validate';

export const authRoutes = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Authenticate with email and password
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, example: admin@minierp.com }
 *               password: { type: string, format: password, example: Password123! }
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Login successful }
 *                 data: { $ref: '#/components/schemas/LoginResponse' }
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */
authRoutes.post('/login', validate(loginValidationSchema), AuthController.login);
