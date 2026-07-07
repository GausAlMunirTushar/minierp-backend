import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '@/config/env';
import type { LoginPayload } from '@/modules/auth/auth.validation';
import type { SafeUser } from '@/modules/user/user.interface';
import { User } from '@/modules/user/user.model';
import { enrichUserPermissions } from '@/modules/user/user.permissions';
import { AppError } from '@/utils/AppError';

type LoginResult = {
  accessToken: string;
  expiresIn: string;
  user: SafeUser;
};

const toSafeUser = (user: {
  _id: unknown;
  name: string;
  email: string;
  role: SafeUser['role'];
}) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
});

/**
 * Authenticates a user by email and password and returns a signed JWT.
 *
 * @param payload - Login credentials
 * @returns Access token and authenticated user profile
 * @throws {AppError} When credentials are invalid or account is inactive
 */
export const loginUser = async (payload: LoginPayload): Promise<LoginResult> => {
  const user = await User.findOne({ email: payload.email }).select('+password');

  if (!user || !user.isActive) {
    throw new AppError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid email or password');
  }

  const accessToken = jwt.sign({ id: user._id.toString(), role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });

  return {
    accessToken,
    expiresIn: env.JWT_EXPIRES_IN,
    user: enrichUserPermissions(toSafeUser(user)),
  };
};
