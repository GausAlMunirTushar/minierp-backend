import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '@/modules/product/product.service';
import { catchAsync } from '@/utils/catchAsync';
import { sendResponse } from '@/utils/sendResponse';

/**
 * Handles product HTTP requests.
 */
export const ProductController = {
  create: catchAsync(async (req, res) => {
    const product = await createProduct(req.body, req.file);

    sendResponse(res, {
      statusCode: 201,
      message: 'Product created successfully',
      data: product,
    });
  }),

  list: catchAsync(async (req, res) => {
    const result = await getProducts(req.query);

    sendResponse(res, {
      statusCode: 200,
      message: 'Products retrieved successfully',
      data: result.data,
      meta: result.meta,
    });
  }),

  details: catchAsync(async (req, res) => {
    const product = await getProductById(req.params.id);

    sendResponse(res, {
      statusCode: 200,
      message: 'Product retrieved successfully',
      data: product,
    });
  }),

  update: catchAsync(async (req, res) => {
    const product = await updateProduct(req.params.id, req.body, req.file);

    sendResponse(res, {
      statusCode: 200,
      message: 'Product updated successfully',
      data: product,
    });
  }),

  delete: catchAsync(async (req, res) => {
    const product = await deleteProduct(req.params.id);

    sendResponse(res, {
      statusCode: 200,
      message: 'Product deleted successfully',
      data: product,
    });
  }),
};
