import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as crypto from 'crypto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = (request.headers['x-request-id'] as string) || crypto.randomUUID();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorCode = 'INTERNAL_ERROR';
    let errorMessage = 'An unexpected internal error occurred';
    let validationDetails: any = undefined;

    if (exception instanceof HttpException) {
      const resp = exception.getResponse();
      if (typeof resp === 'string') {
        errorMessage = resp;
      } else if (typeof resp === 'object' && resp !== null) {
        const r = resp as any;
        errorCode = r.error || r.code || 'HTTP_ERROR';
        errorMessage = r.message || exception.message;
        if (Array.isArray(r.message)) {
          validationDetails = r.message;
          errorMessage = 'Input validation failed';
        }
      }
    } else {
      // Never leak stack traces, database schema details, or system paths to client
      this.logger.error(`Unhandled error [${requestId}]: ${(exception as any)?.message || exception}`);
    }

    response.status(status).json({
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
        details: validationDetails,
      },
      requestId,
      timestamp: new Date().toISOString(),
    });
  }
}
