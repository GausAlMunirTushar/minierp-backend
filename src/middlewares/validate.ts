import type { RequestHandler } from 'express';
import type { AnyZodObject } from 'zod';

/**
 * Validates request body, params, query, and files with a Zod schema.
 *
 * @param schema - Zod object containing request segment schemas
 * @returns Express validation middleware
 */
export const validate =
  (schema: AnyZodObject): RequestHandler =>
  async (req, _res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
        file: req.file,
        files: req.files,
      });
      next();
    } catch (error) {
      next(error);
    }
  };
