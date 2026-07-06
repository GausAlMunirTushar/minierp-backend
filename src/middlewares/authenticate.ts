import jwt from 'jsonwebtoken';

import { env } from '@/config/env';
import { User } from '@/modules/user/user.model';
import { AppError } from '@/utils/AppError';
import { catchAsync } from '@/utils/catchAsync';

type DecodedToken = {
  id: string;
};

/**
 * Verifies a bearer token and attaches the authenticated user to the request.
 *
 * @throws {AppError} When token is missing, invalid, or belongs to an inactive user
 */
export const authenticate = catchAsync(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'Authentication token is required');
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, env.JWT_SECRET) as DecodedToken;
  const user = await User.findById(decoded.id).select('name email role isActive').lean();

  if (!user || !user.isActive) {
    throw new AppError(401, 'Invalid authentication token');
  }

  req.user = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };

  next();
});
