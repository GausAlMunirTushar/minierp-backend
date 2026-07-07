import type { RequestHandler } from 'express';
import type { AnyZodObject } from 'zod';

export const validate =
  (schema: AnyZodObject): RequestHandler =>
  (req, _res, next) => {
    schema
      .parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
        file: req.file,
        files: req.files,
      })
      .then(() => next())
      .catch(next);
  };
