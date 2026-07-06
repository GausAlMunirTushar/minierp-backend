import { Router } from 'express';

import { productImageUpload } from '@/config/upload';
import { authenticate } from '@/middlewares/authenticate';
import { authorize } from '@/middlewares/authorize';
import { validate } from '@/middlewares/validate';
import { ProductController } from '@/modules/product/product.controller';
import {
  createProductValidationSchema,
  productIdValidationSchema,
  productListValidationSchema,
  updateProductValidationSchema,
} from '@/modules/product/product.validation';

export const productRoutes = Router();

productRoutes.use(authenticate);

productRoutes
  .route('/')
  .post(
    authorize('admin', 'manager'),
    productImageUpload.single('image'),
    validate(createProductValidationSchema),
    ProductController.create,
  )
  .get(
    authorize('admin', 'manager', 'employee'),
    validate(productListValidationSchema),
    ProductController.list,
  );

productRoutes
  .route('/:id')
  .get(
    authorize('admin', 'manager', 'employee'),
    validate(productIdValidationSchema),
    ProductController.details,
  )
  .patch(
    authorize('admin', 'manager'),
    productImageUpload.single('image'),
    validate(updateProductValidationSchema),
    ProductController.update,
  )
  .delete(authorize('admin'), validate(productIdValidationSchema), ProductController.delete);
