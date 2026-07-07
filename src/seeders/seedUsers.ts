import { User } from '@/modules/user/user.model';
import { DEFAULT_USERS } from '@/seeders/seedData';
import logger from '@/lib/logger';

export const seedUsers = async () => {
  logger.info('Seeding users...');

  for (const user of DEFAULT_USERS) {
    const exists = await User.findOne({ email: user.email });

    if (exists) {
      exists.name = user.name;
      exists.role = user.role;
      exists.isActive = true;
      exists.password = user.password;
      await exists.save();
      logger.info({ email: user.email }, 'User updated');
      continue;
    }

    await User.create(user);
    logger.info({ email: user.email }, 'User created');
  }

  logger.info('Users seeded');
};
