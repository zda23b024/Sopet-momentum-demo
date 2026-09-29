import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const requestId = (request.headers['x-request-id'] as string) || crypto.randomUUID();
    request.headers['x-request-id'] = requestId;

    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        // Sanitized structured log (method, URL, status duration, requestId)
        // Never logs body contents or private developmental text!
        this.logger.log(`[${requestId}] ${method} ${url} - ${duration}ms`);
      }),
    );
  }
}
