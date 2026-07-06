import { z } from 'zod';

export const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email('A valid email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export type LoginPayload = z.infer<typeof loginValidationSchema>['body'];
