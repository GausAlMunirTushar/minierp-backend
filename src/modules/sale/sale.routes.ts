import { Router } from 'express';

import { authenticate } from '@/middlewares/authenticate';
import { authorize } from '@/middlewares/authorize';
import { validate } from '@/middlewares/validate';
import { SaleController } from '@/modules/sale/sale.controller';
import {
  createSaleValidationSchema,
  saleListValidationSchema,
} from '@/modules/sale/sale.validation';

export const saleRoutes = Router();

saleRoutes.use(authenticate);

saleRoutes
  .route('/')
  .post(
    authorize('admin', 'manager', 'employee'),
    validate(createSaleValidationSchema),
    SaleController.create,
  )
  .get(authorize('admin', 'manager'), validate(saleListValidationSchema), SaleController.list);
