import { loginUser } from '@/modules/auth/auth.service';
import { catchAsync } from '@/utils/catchAsync';
import { sendResponse } from '@/utils/sendResponse';

/**
 * Handles authentication HTTP requests.
 */
export const AuthController = {
  login: catchAsync(async (req, res) => {
    const result = await loginUser(req.body);

    sendResponse(res, {
      statusCode: 200,
      message: 'Login successful',
      data: result,
    });
  }),
};
