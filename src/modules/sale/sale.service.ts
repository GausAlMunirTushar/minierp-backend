import mongoose from 'mongoose';

import { Product } from '@/modules/product/product.model';
import { Sale } from '@/modules/sale/sale.model';
import type { CreateSalePayload } from '@/modules/sale/sale.validation';
import { AppError } from '@/utils/AppError';
import { buildQuery } from '@/utils/queryBuilder';

type SaleActor = {
  id: string;
};

const buildSaleDocument = async (payload: CreateSalePayload, user: SaleActor) => {
  const duplicateProduct = payload.items.find(
    (item, index) => payload.items.findIndex((inner) => inner.product === item.product) !== index,
  );

  if (duplicateProduct) {
    throw new AppError(400, 'Duplicate products are not allowed in a sale');
  }

  const productIds = payload.items.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== productIds.length) {
    throw new AppError(404, 'One or more products were not found');
  }

  const saleItems = payload.items.map((item) => {
    const product = products.find((productItem) => productItem._id.toString() === item.product);

    if (!product) {
      throw new AppError(404, 'Product not found');
    }

    if (product.stockQuantity < item.quantity) {
      throw new AppError(400, `Insufficient stock for ${product.name}`);
    }

    const lineTotal = product.sellingPrice * item.quantity;

    return {
      product: product._id,
      name: product.name,
      sku: product.sku,
      quantity: item.quantity,
      unitPrice: product.sellingPrice,
      lineTotal,
    };
  });

  const grandTotal = saleItems.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    saleItems,
    grandTotal,
    createdBy: new mongoose.Types.ObjectId(user.id),
  };
};

const createSaleWithoutTransaction = async (payload: CreateSalePayload, user: SaleActor) => {
  const saleDocument = await buildSaleDocument(payload, user);

  await Promise.all(
    payload.items.map((item) =>
      Product.updateOne(
        { _id: item.product, stockQuantity: { $gte: item.quantity } },
        { $inc: { stockQuantity: -item.quantity } },
      ),
    ),
  );

  return Sale.create({
    items: saleDocument.saleItems,
    grandTotal: saleDocument.grandTotal,
    createdBy: saleDocument.createdBy,
  });
};

/**
 * Creates a sale, reduces product stock, and stores immutable sale item snapshots.
 *
 * @param payload - Sale item list
 * @param user - Authenticated user creating the sale
 * @returns Created sale
 * @throws {AppError} When stock is unavailable or product ids are invalid
 */
export const createSale = async (payload: CreateSalePayload, user: SaleActor) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const saleDocument = await buildSaleDocument(payload, user);

    for (const item of payload.items) {
      const result = await Product.updateOne(
        { _id: item.product, stockQuantity: { $gte: item.quantity } },
        { $inc: { stockQuantity: -item.quantity } },
        { session },
      );

      if (result.modifiedCount !== 1) {
        throw new AppError(400, 'Insufficient stock while creating sale');
      }
    }

    const [sale] = await Sale.create(
      [
        {
          items: saleDocument.saleItems,
          grandTotal: saleDocument.grandTotal,
          createdBy: saleDocument.createdBy,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    return sale;
  } catch (error: any) {
    await session.abortTransaction().catch(() => undefined);

    if (error?.message?.includes('Transaction numbers are only allowed')) {
      return createSaleWithoutTransaction(payload, user);
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

/**
 * Returns paginated sale history.
 *
 * @param query - Sale list query parameters
 * @returns Paginated sales
 */
export const getSales = async (query: Record<string, unknown>) => buildQuery(Sale, query, []);
