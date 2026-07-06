import { createSale, getSales } from '@/modules/sale/sale.service';
import { AppError } from '@/utils/AppError';
import { catchAsync } from '@/utils/catchAsync';
import { sendResponse } from '@/utils/sendResponse';

/**
 * Handles sales HTTP requests.
 */
export const SaleController = {
  create: catchAsync(async (req, res) => {
    if (!req.user) {
      throw new AppError(401, 'Authentication is required');
    }

    const sale = await createSale(req.body, { id: req.user.id });

    sendResponse(res, {
      statusCode: 201,
      message: 'Sale created successfully',
      data: sale,
    });
  }),

  list: catchAsync(async (req, res) => {
    const result = await getSales(req.query);

    sendResponse(res, {
      statusCode: 200,
      message: 'Sales retrieved successfully',
      data: result.data,
      meta: result.meta,
    });
  }),
};
