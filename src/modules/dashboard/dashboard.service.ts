import { Product } from '@/modules/product/product.model';
import { Sale } from '@/modules/sale/sale.model';

/**
 * Calculates dashboard statistics for products and sales.
 *
 * @returns Product count, sale count, and low-stock product list
 */
export const getDashboardStats = async () => {
  const [totalProducts, totalSales, lowStockProducts] = await Promise.all([
    Product.countDocuments(),
    Sale.countDocuments(),
    Product.find({ stockQuantity: { $lt: 5 } })
      .sort({ stockQuantity: 1 })
      .lean(),
  ]);

  return {
    totalProducts,
    totalSales,
    lowStockProducts,
  };
};
