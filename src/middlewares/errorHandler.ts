import type { ErrorRequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { ZodError } from 'zod';

import { env } from '@/config/env';
import { AppError } from '@/utils/AppError';

type ErrorItem = {
  path?: string;
  message: string;
};

const formatZodErrors = (error: ZodError): ErrorItem[] =>
  error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));

/**
 * Converts known operational failures into consistent API error responses.
 */
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  let statusCode = 500;
  let message = 'Something went wrong';
  let errors: ErrorItem[] = [];

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = formatZodErrors(error);
  } else if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid resource identifier';
    errors = [{ path: error.path, message: error.message }];
  } else if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(error.errors).map((item) => ({
      path: item.path,
      message: item.message,
    }));
  } else if (error?.code === 11000) {
    statusCode = 409;
    message = 'Duplicate value already exists';
    errors = Object.keys(error.keyValue || {}).map((key) => ({
      path: key,
      message: `${key} already exists`,
    }));
  } else if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
    statusCode = 401;
    message = 'Invalid or expired authentication token';
  } else if (error?.name === 'MulterError') {
    statusCode = 400;
    message = error.message;
  }

  const response: Record<string, unknown> = {
    success: false,
    message,
    errors,
  };

  if (env.NODE_ENV !== 'production') {
    response.stack = error?.stack;
  }

  res.status(statusCode).json(response);
};
