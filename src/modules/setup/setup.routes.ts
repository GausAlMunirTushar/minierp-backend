import { Router } from 'express';

import { authenticate } from '@/middlewares/authenticate';
import { SetupController } from '@/modules/setup/setup.controller';

export const setupRoutes = Router();

setupRoutes.get('/', authenticate, SetupController.setup);
