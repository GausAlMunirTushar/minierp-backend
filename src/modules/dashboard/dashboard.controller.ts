import { getDashboardStats } from '@/modules/dashboard/dashboard.service';
import { catchAsync } from '@/utils/catchAsync';
import { sendResponse } from '@/utils/sendResponse';

/**
 * Handles dashboard HTTP requests.
 */
export const DashboardController = {
  stats: catchAsync(async (_req, res) => {
    const stats = await getDashboardStats();

    sendResponse(res, {
      statusCode: 200,
      message: 'Dashboard statistics retrieved successfully',
      data: stats,
    });
  }),
};
