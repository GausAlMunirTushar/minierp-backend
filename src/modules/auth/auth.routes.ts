import { Router } from 'express';

import { AuthController } from '@/modules/auth/auth.controller';
import { loginValidationSchema } from '@/modules/auth/auth.validation';
import { validate } from '@/middlewares/validate';

export const authRoutes = Router();

authRoutes.post('/login', validate(loginValidationSchema), AuthController.login);
