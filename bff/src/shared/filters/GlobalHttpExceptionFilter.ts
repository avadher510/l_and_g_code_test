import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AppError } from '../errors/AppError';

/**
 * Global exception filter that catches all exceptions thrown within the application.
 * Formats AppError instances with their specific error codes and status codes;
 * handles HttpException instances from NestJS; catches all other unknown errors
 * and returns a generic 500 response with a British English message.
 */
@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof AppError) {
      response.status(exception.statusCode).json({
        success: false,
        error: {
          code: exception.errorCode,
          message: exception.userMessage,
          details: exception.details,
        },
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      let message: string;
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const responseMessage = exceptionResponse.message;
        message = Array.isArray(responseMessage)
          ? responseMessage.join(', ')
          : String(responseMessage);
      } else {
        message = exception.message;
      }

      response.status(status).json({
        success: false,
        error: {
          code: 'HTTP_EXCEPTION',
          message,
        },
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred; please try again.',
      },
    });
  }
}
