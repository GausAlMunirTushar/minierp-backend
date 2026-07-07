import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '@/modules/category/category.service';
import { catchAsync } from '@/utils/catchAsync';
import { sendResponse } from '@/utils/sendResponse';

/**
 * Handles category HTTP requests.
 */
export const CategoryController = {
  create: catchAsync(async (req, res) => {
    const category = await createCategory(req.body);

    sendResponse(res, {
      statusCode: 201,
      message: 'Category created successfully',
      data: category,
    });
  }),

  list: catchAsync(async (req, res) => {
    const result = await getCategories(req.query);

    sendResponse(res, {
      statusCode: 200,
      message: 'Categories retrieved successfully',
      data: result.data,
      meta: result.meta,
    });
  }),

  details: catchAsync(async (req, res) => {
    const category = await getCategoryById(req.params.id);

    sendResponse(res, {
      statusCode: 200,
      message: 'Category retrieved successfully',
      data: category,
    });
  }),

  update: catchAsync(async (req, res) => {
    const category = await updateCategory(req.params.id, req.body);

    sendResponse(res, {
      statusCode: 200,
      message: 'Category updated successfully',
      data: category,
    });
  }),

  delete: catchAsync(async (req, res) => {
    const category = await deleteCategory(req.params.id);

    sendResponse(res, {
      statusCode: 200,
      message: 'Category deleted successfully',
      data: category,
    });
  }),
};
