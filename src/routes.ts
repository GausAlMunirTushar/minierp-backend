import { Router } from 'express';

import { authRoutes } from '@/modules/auth/auth.routes';
import { categoryRoutes } from '@/modules/category/category.routes';
import { dashboardRoutes } from '@/modules/dashboard/dashboard.routes';
import { productRoutes } from '@/modules/product/product.routes';
import { saleRoutes } from '@/modules/sale/sale.routes';
import { setupRoutes } from '@/modules/setup/setup.routes';

export const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/products', productRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/sales', saleRoutes);
routes.use('/dashboard', dashboardRoutes);
routes.use('/setup', setupRoutes);
