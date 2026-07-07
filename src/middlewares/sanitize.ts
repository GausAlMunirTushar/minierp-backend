import type { RequestHandler } from 'express';

const MONGODB_OPERATORS = /^\$/;

const stripOperators = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(stripOperators);
  }

  if (value !== null && typeof value === 'object') {
    const sanitized: Record<string, unknown> = {};

    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (MONGODB_OPERATORS.test(key) || key.includes('.')) {
        continue;
      }

      sanitized[key] = stripOperators(val);
    }

    return sanitized;
  }

  return value;
};

export const sanitize: RequestHandler = (req, _res, next) => {
  if (req.body) {
    req.body = stripOperators(req.body);
  }

  if (req.query) {
    req.query = stripOperators(req.query) as Record<string, string>;
  }

  if (req.params) {
    req.params = stripOperators(req.params) as Record<string, string>;
  }

  next();
};
