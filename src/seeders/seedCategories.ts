import { Category } from '@/modules/category/category.model';
import { DEFAULT_CATEGORIES } from '@/seeders/seedData';
import logger from '@/lib/logger';

export const seedCategories = async () => {
  logger.info('Seeding categories...');

  for (const name of DEFAULT_CATEGORIES) {
    const exists = await Category.findOne({ name });

    if (exists) {
      logger.info({ name }, 'Category already exists — skipped');
      continue;
    }

    await Category.create({ name });
    logger.info({ name }, 'Category created');
  }

  logger.info('Categories seeded');
};
