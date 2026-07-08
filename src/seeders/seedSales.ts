import { Sale } from '@/modules/sale/sale.model';
import { Product } from '@/modules/product/product.model';
import { User } from '@/modules/user/user.model';
import logger from '@/lib/logger';

export const seedSales = async () => {
  logger.info('Seeding sales history...');

  const exists = await Sale.findOne();
  if (exists) {
    logger.info('Sales history already exists — skipping');
    return;
  }

  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    logger.error('Admin user not found, cannot seed sales history');
    return;
  }

  const mouse = await Product.findOne({ sku: 'MS-WIRELESS-01' });
  const keyboard = await Product.findOne({ sku: 'KB-MECH-02' });
  const chair = await Product.findOne({ sku: 'CH-ERGO-03' });
  const bottle = await Product.findOne({ sku: 'BT-STEEL-04' });

  if (!mouse || !keyboard || !chair || !bottle) {
    logger.error('Default products not found, cannot seed sales history');
    return;
  }

  // Sale 1: 2 Mice and 1 Keyboard
  const sale1Items = [
    {
      product: mouse._id,
      name: mouse.name,
      sku: mouse.sku,
      quantity: 2,
      unitPrice: mouse.sellingPrice,
      lineTotal: mouse.sellingPrice * 2,
    },
    {
      product: keyboard._id,
      name: keyboard.name,
      sku: keyboard.sku,
      quantity: 1,
      unitPrice: keyboard.sellingPrice,
      lineTotal: keyboard.sellingPrice * 1,
    },
  ];
  const total1 = sale1Items.reduce((sum, item) => sum + item.lineTotal, 0);

  await Sale.create({
    items: sale1Items,
    grandTotal: total1,
    createdBy: admin._id,
  });

  mouse.stockQuantity -= 2;
  await mouse.save();
  keyboard.stockQuantity -= 1;
  await keyboard.save();

  // Sale 2: 1 Chair
  const sale2Items = [
    {
      product: chair._id,
      name: chair.name,
      sku: chair.sku,
      quantity: 1,
      unitPrice: chair.sellingPrice,
      lineTotal: chair.sellingPrice * 1,
    },
  ];
  const total2 = sale2Items.reduce((sum, item) => sum + item.lineTotal, 0);

  await Sale.create({
    items: sale2Items,
    grandTotal: total2,
    createdBy: admin._id,
  });

  chair.stockQuantity -= 1;
  await chair.save();

  // Sale 3: 3 Bottles
  const sale3Items = [
    {
      product: bottle._id,
      name: bottle.name,
      sku: bottle.sku,
      quantity: 3,
      unitPrice: bottle.sellingPrice,
      lineTotal: bottle.sellingPrice * 3,
    },
  ];
  const total3 = sale3Items.reduce((sum, item) => sum + item.lineTotal, 0);

  await Sale.create({
    items: sale3Items,
    grandTotal: total3,
    createdBy: admin._id,
  });

  bottle.stockQuantity -= 3;
  await bottle.save();

  logger.info('Sales history seeded successfully');
};
