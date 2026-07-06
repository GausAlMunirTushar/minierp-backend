import type { FilterQuery, Model, QueryOptions } from 'mongoose';

export type QueryMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type QueryResult<T> = {
  data: T[];
  meta: QueryMeta;
};

type QueryParams = Record<string, unknown>;

/**
 * Applies common search, filter, sort, and pagination behavior to a Mongoose model.
 *
 * @param model - Mongoose model to query
 * @param query - Incoming query parameters
 * @param searchableFields - Fields included in case-insensitive text search
 * @param baseFilter - Extra filter always applied to the query
 * @returns Paginated data and pagination metadata
 */
export const buildQuery = async <T>(
  model: Model<T>,
  query: QueryParams,
  searchableFields: string[],
  baseFilter: FilterQuery<T> = {},
): Promise<QueryResult<T>> => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit || query.page_size) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const search = typeof query.search === 'string' ? query.search.trim() : '';
  const sort = typeof query.sort === 'string' ? query.sort : '-createdAt';

  const filter: FilterQuery<T> = { ...baseFilter };

  if (search) {
    filter.$or = searchableFields.map((field) => ({
      [field]: { $regex: search, $options: 'i' },
    })) as FilterQuery<T>[];
  }

  if (typeof query.category === 'string' && query.category.trim()) {
    (filter as Record<string, unknown>).category = query.category.trim();
  }

  const options: QueryOptions = { sort, skip, limit };
  const [data, total] = await Promise.all([
    model.find(filter, null, options).lean<T[]>(),
    model.countDocuments(filter),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};
