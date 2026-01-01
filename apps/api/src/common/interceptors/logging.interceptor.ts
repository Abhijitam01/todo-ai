import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

import type { Logger } from '../logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const requestId = request.headers['x-request-id'] || crypto.randomUUID();

    // Add request ID to request object
    request.requestId = requestId;

    const startTime = Date.now();

    this.logger.debug({
      requestId,
      method,
      url,
      ip,
      userAgent,
    }, 'Incoming request');

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const statusCode = response.statusCode;
          const duration = Date.now() - startTime;

          this.logger.info({
            requestId,
            method,
            url,
            statusCode,
            duration,
          }, 'Request completed');
        },
        error: (error) => {
          const duration = Date.now() - startTime;

          this.logger.error({
            requestId,
            method,
            url,
            duration,
            error: error.message,
          }, 'Request failed');
        },
      })
    );
  }
}

