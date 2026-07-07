import { env } from '@/config/env';
import { enrichUserPermissions } from '@/modules/user/user.permissions';
import { User } from '@/modules/user/user.model';
import { AppError } from '@/utils/AppError';

export const getSetup = async (userId: string) => {
  const user = await User.findById(userId).select('name email role isActive').lean();

  if (!user || !user.isActive) {
    throw new AppError(401, 'Authenticated user was not found');
  }

  return {
    user: enrichUserPermissions({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    }),
    university: {},
    fiscal_years: [],
    current_fiscal_year: {},
    system_configs: {},
    app_version: '1.0.0',
    environment: env.NODE_ENV,
    language: 'en',
    timezone: 'Asia/Dhaka',
  };
};
