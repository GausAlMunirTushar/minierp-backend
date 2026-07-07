import { connectDatabase, disconnectDatabase } from '@/config/database';
import type { UserRole } from '@/modules/user/user.interface';
import { User } from '@/modules/user/user.model';
import logger from '@/lib/logger';

const defaultUsers: Array<{
  name: string;
  email: string;
  password: string;
  role: UserRole;
}> = [
  {
    name: 'Admin User',
    email: 'admin@minierp.com',
    password: 'Password123!',
    role: 'admin',
  },
  {
    name: 'Manager User',
    email: 'manager@minierp.com',
    password: 'Password123!',
    role: 'manager',
  },
  {
    name: 'Employee User',
    email: 'employee@minierp.com',
    password: 'Password123!',
    role: 'employee',
  },
];

const seedUsers = async () => {
  await connectDatabase();

  for (const user of defaultUsers) {
    const exists = await User.findOne({ email: user.email });

    if (exists) {
      await User.updateOne(
        { email: user.email },
        {
          $set: {
            name: user.name,
            role: user.role,
            isActive: true,
          },
        },
      );
      continue;
    }

    await User.create(user);
  }


  await disconnectDatabase();
  logger.info('Default users seeded successfully');
};

seedUsers().catch(async (error) => {
  logger.error(error, 'Failed to seed users');
  await disconnectDatabase().catch(() => undefined);
  process.exit(1);
});
