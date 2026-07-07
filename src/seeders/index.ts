import { connectDatabase, disconnectDatabase } from '@/config/database';
import { seedCategories } from '@/seeders/seedCategories';
import { seedRoles } from '@/seeders/seedRoles';
import { seedUsers } from '@/seeders/seedUsers';
import logger from '@/lib/logger';

const seedAll = async () => {
  try {
    await connectDatabase();
    logger.info('Database connected — running seeders');

    await seedRoles();
    await seedCategories();
    await seedUsers();

    logger.info('All seeders completed successfully');
    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    logger.fatal(error, 'Seeder failed');
    await disconnectDatabase().catch(() => undefined);
    process.exit(1);
  }
};

seedAll();
