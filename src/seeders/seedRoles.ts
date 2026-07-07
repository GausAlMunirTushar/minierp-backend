import { Role } from '@/modules/role/role.model';
import { DEFAULT_ROLES } from '@/seeders/seedData';
import logger from '@/lib/logger';

export const seedRoles = async () => {
  logger.info('Seeding roles...');

  for (const [name, permissions] of Object.entries(DEFAULT_ROLES)) {
    await Role.findOneAndUpdate(
      { name },
      { permissions },
      { upsert: true, new: true },
    );
    logger.info({ name, count: permissions.length }, 'Role seeded');
  }

  logger.info('Roles seeded');
};
