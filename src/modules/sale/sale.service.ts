import mongoose from 'mongoose';

import { Product } from '@/modules/product/product.model';
import { Sale } from '@/modules/sale/sale.model';
import type { CreateSalePayload } from '@/modules/sale/sale.validation';
import { AppError } from '@/utils/AppError';
import { buildQuery } from '@/utils/queryBuilder';
import logger from '@/lib/logger';

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

  const appliedDecrements: { product: string; quantity: number }[] = [];

  const rollbackAppliedDecrements = async () => {
    await Promise.all(
      appliedDecrements.map(({ product, quantity }) =>
        Product.updateOne({ _id: product }, { $inc: { stockQuantity: quantity } }).catch((rollbackError) =>
          logger.error(rollbackError, 'Failed to roll back stock decrement after failed sale'),
        ),
      ),
    );
  };

  try {
    for (const item of payload.items) {
      const result = await Product.updateOne(
        { _id: item.product, stockQuantity: { $gte: item.quantity } },
        { $inc: { stockQuantity: -item.quantity } },
      );

      if (result.modifiedCount !== 1) {
        throw new AppError(400, `Insufficient stock for product ${item.product}`);
      }

      appliedDecrements.push({ product: item.product, quantity: item.quantity });
    }

    return await Sale.create({
      items: saleDocument.saleItems,
      grandTotal: saleDocument.grandTotal,
      createdBy: saleDocument.createdBy,
    });
  } catch (error) {
    await rollbackAppliedDecrements();
    throw error;
  }
};

const isReplicaSet = async (): Promise<boolean> => {
  try {
    if (!mongoose.connection.db) return false;

    const adminDb = mongoose.connection.db.admin();
    const { setName } = await adminDb.command({ replSetGetStatus: 1 }).catch(() => ({
      setName: null,
    }));
    return !!setName;
  } catch {
    return false;
  }
};

export const createSale = async (payload: CreateSalePayload, user: SaleActor) => {
  const replicaSet = await isReplicaSet();

  if (!replicaSet) {
    return createSaleWithoutTransaction(payload, user);
  }

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
  } catch (error) {
    try {
      await session.abortTransaction();
    } catch (abortError) {
      logger.error(abortError, 'Failed to abort sale transaction');
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

export const getSales = async (query: Record<string, unknown>) => buildQuery(Sale, query, []);
