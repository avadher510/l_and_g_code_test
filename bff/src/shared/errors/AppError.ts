import { ErrorCode } from './ErrorCode.enum';

/**
 * Base application error class used throughout the BFF.
 * Provides a consistent structure for all domain and infrastructure errors;
 * includes a machine-readable error code and a human-readable message
 * suitable for display to the end user.
 */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly errorCode: ErrorCode,
    public readonly userMessage: string,
    public readonly details?: unknown,
  ) {
    super(userMessage);
    this.name = 'AppError';
  }
}
