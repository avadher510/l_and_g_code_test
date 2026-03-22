import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Global interceptor that wraps all successful responses in a consistent envelope.
 * Transforms the response to include a success flag, the original data, and a timestamp;
 * this provides a uniform API contract for all endpoints throughout the BFF.
 */
@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, { success: boolean; data: T; timestamp: string }>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ success: boolean; data: T; timestamp: string }> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
