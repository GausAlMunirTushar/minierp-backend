import { connectDatabase, disconnectDatabase } from '@/config/database';
import type { UserRole } from '@/modules/user/user.interface';
import { User } from '@/modules/user/user.model';

const defaultUsers: Array<{
  name: string;
  email: string;
  password: string;
  role: UserRole;
}> = [
  {
    name: 'Admin User',
    email: 'admin@minierp.local',
    password: 'Admin123!',
    role: 'admin',
  },
  {
    name: 'Manager User',
    email: 'manager@minierp.local',
    password: 'Manager123!',
    role: 'manager',
  },
  {
    name: 'Employee User',
    email: 'employee@minierp.local',
    password: 'Employee123!',
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
  console.log('Default users seeded successfully');
};

seedUsers().catch(async (error) => {
  console.error('Failed to seed users', error);
  await disconnectDatabase().catch(() => undefined);
  process.exit(1);
});
