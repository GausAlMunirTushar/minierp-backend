import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

export const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
  }),
});

export const updateCategoryValidationSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    name: z.string().min(1).max(100),
  }),
});

export const categoryIdValidationSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const categoryListValidationSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    page_size: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    sort: z.string().optional(),
  }),
});

export type CreateCategoryPayload = z.infer<typeof createCategoryValidationSchema>['body'];
export type UpdateCategoryPayload = z.infer<typeof updateCategoryValidationSchema>['body'];
