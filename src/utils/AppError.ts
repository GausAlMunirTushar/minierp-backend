/**
 * Operational error type handled by the global error middleware.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  /**
   * Creates an application error with a safe public message.
   *
   * @param statusCode - HTTP status code to send
   * @param message - Public error message
   */
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
