import { getSetup } from '@/modules/setup/setup.service';
import { AppError } from '@/utils/AppError';
import { catchAsync } from '@/utils/catchAsync';
import { sendResponse } from '@/utils/sendResponse';

/**
 * Handles application setup bootstrap requests.
 */
export const SetupController = {
  setup: catchAsync(async (req, res) => {
    if (!req.user) {
      throw new AppError(401, 'Authentication is required');
    }

    const setup = await getSetup(req.user.id);

    sendResponse(res, {
      statusCode: 200,
      message: 'Setup data retrieved successfully',
      data: setup,
    });
  }),
};
