import type { Response } from 'express';

type ApiResponse<T> = {
  statusCode: number;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
};

/**
 * Sends a consistent API success response.
 *
 * @param res - Express response object
 * @param payload - Response status, message, data, and optional metadata
 */
export const sendResponse = <T>(res: Response, payload: ApiResponse<T>): void => {
  const { statusCode, message, data = null, meta } = payload;

  res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
};
