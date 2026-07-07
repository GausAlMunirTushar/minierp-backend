import type { Response } from 'express';

import type { SuccessResponse } from '@/types/response';

type ApiResponse<T> = {
  statusCode: number;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
};

export const sendResponse = <T>(res: Response, payload: ApiResponse<T>): void => {
  const { statusCode, message, data = null, meta } = payload;

  const body: SuccessResponse<T> = {
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  };

  res.status(statusCode).json(body);
};
