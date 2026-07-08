import { Product } from '@/modules/product/product.model';
import { DEFAULT_PRODUCTS } from '@/seeders/seedData';
import logger from '@/lib/logger';

export const seedProducts = async () => {
  logger.info('Seeding products...');

  for (const product of DEFAULT_PRODUCTS) {
    const exists = await Product.findOne({ sku: product.sku });

    if (exists) {
      exists.name = product.name;
      exists.category = product.category;
      exists.purchasePrice = product.purchasePrice;
      exists.sellingPrice = product.sellingPrice;
      exists.stockQuantity = product.stockQuantity;
      exists.image = product.image;
      exists.imagePublicId = product.imagePublicId;
      await exists.save();
      logger.info({ sku: product.sku }, 'Product updated');
      continue;
    }

    await Product.create(product);
    logger.info({ sku: product.sku }, 'Product created');
  }

  logger.info('Products seeded');
};
