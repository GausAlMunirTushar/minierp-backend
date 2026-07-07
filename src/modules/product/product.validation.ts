import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');
const numberFromFormData = z.preprocess((value) => Number(value), z.number().min(0));
const stockFromFormData = z.preprocess(
  (value) => Number(value),
  z.number().int().min(0, 'Stock quantity cannot be negative'),
);

const imageFileSchema = z.object({
  buffer: z.instanceof(Buffer),
  mimetype: z.string().startsWith('image/'),
}).passthrough();

export const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(150),
    sku: z.string().min(1).max(80),
    category: z.string().min(1).max(100),
    purchasePrice: numberFromFormData,
    sellingPrice: numberFromFormData,
    stockQuantity: stockFromFormData,
  }),
  file: imageFileSchema,
});

export const updateProductValidationSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z
    .object({
      name: z.string().min(1).max(150).optional(),
      sku: z.string().min(1).max(80).optional(),
      category: z.string().min(1).max(100).optional(),
      purchasePrice: numberFromFormData.optional(),
      sellingPrice: numberFromFormData.optional(),
      stockQuantity: stockFromFormData.optional(),
    })
    .optional()
    .default({}),
  file: imageFileSchema.optional(),
});

export const productIdValidationSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const productListValidationSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    page_size: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    category: z.string().optional(),
    sort: z.string().optional(),
  }),
});

export type CreateProductPayload = z.infer<typeof createProductValidationSchema>['body'];
export type UpdateProductPayload = z.infer<typeof updateProductValidationSchema>['body'];
