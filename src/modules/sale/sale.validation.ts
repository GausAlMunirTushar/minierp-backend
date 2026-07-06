import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

export const createSaleValidationSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          product: objectIdSchema,
          quantity: z.number().int().positive('Quantity must be greater than zero'),
        }),
      )
      .min(1, 'At least one product is required'),
  }),
});

export const saleListValidationSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    page_size: z.string().optional(),
    limit: z.string().optional(),
    sort: z.string().optional(),
  }),
});

export type CreateSalePayload = z.infer<typeof createSaleValidationSchema>['body'];
