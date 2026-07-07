import type { ErrorRequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { ZodError } from 'zod';

import { env } from '@/config/env';
import { AppError } from '@/utils/AppError';
import logger from '@/lib/logger';
import type { ErrorItem, ErrorResponse } from '@/types/response';

const formatZodErrors = (error: ZodError): ErrorItem[] =>
  error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
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
  } else if ((error as Record<string, unknown>)?.code === 11000) {
    statusCode = 409;
    message = 'Duplicate value already exists';
    const keyValue = (error as Record<string, unknown>).keyValue as Record<string, unknown> | undefined;
    errors = Object.keys(keyValue || {}).map((key) => ({
      path: key,
      message: `${key} already exists`,
    }));
  } else if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
    statusCode = 401;
    message = 'Invalid or expired authentication token';
  } else if ((error as Record<string, unknown>)?.name === 'MulterError') {
    statusCode = 400;
    message = (error as Error).message;
  }

  if (statusCode >= 500) {
    logger.error(
      {
        requestId: req.requestId,
        method: req.method,
        url: req.originalUrl,
        statusCode,
      },
      error.message,
    );
  }

  const response: ErrorResponse = {
    success: false,
    message,
    errors,
    ...(req.requestId ? { requestId: req.requestId } : {}),
  };

  if (env.NODE_ENV !== 'production') {
    response.stack = (error as Error)?.stack;
  }

  res.status(statusCode).json(response);
};
