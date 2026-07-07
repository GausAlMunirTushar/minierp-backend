export type ErrorItem = {
  path?: string;
  message: string;
};

export type ErrorResponse = {
  success: false;
  message: string;
  errors: ErrorItem[];
  stack?: string;
  requestId?: string;
};

export type SuccessResponse<T = unknown> = {
  success: true;
  message: string;
  data: T | null;
  meta?: Record<string, unknown>;
};
