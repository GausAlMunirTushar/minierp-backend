import { Router } from 'express';

import { authenticate } from '@/middlewares/authenticate';
import { authorize } from '@/middlewares/authorize';
import { DashboardController } from '@/modules/dashboard/dashboard.controller';

export const dashboardRoutes = Router();

dashboardRoutes.get(
  '/stats',
  authenticate,
  authorize('admin', 'manager', 'employee'),
  DashboardController.stats,
);
