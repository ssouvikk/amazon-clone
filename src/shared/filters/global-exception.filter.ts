import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

interface MongoError {
  code?: number;
  message?: string;
  keyPattern?: Record<string, number>;
  keyValue?: Record<string, unknown>;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let errorCode = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();
      if (typeof responseBody === 'object' && responseBody !== null) {
        const body = responseBody as Record<string, unknown>;
        message = (body['message'] as string | string[]) || exception.message;
      } else {
        message = responseBody || exception.message;
      }
      errorCode = this.getErrorCode(status);
    } else if (this.isMongoError(exception)) {
      const mongoError = exception as MongoError;
      if (mongoError.code === 11000) {
        status = HttpStatus.CONFLICT;
        const field = Object.keys(mongoError.keyPattern || {}).join(', ');
        message = `Resource already exists with this ${field}`;
        errorCode = 'DUPLICATE_RESOURCE';
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse = {
      success: false,
      message: Array.isArray(message) ? message[0] : message,
      errorCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} ${status} - ${String(message)}`,
        exception instanceof Error ? exception.stack : '',
      );
    } else {
      this.logger.warn(`${request.method} ${request.url} ${status} - ${String(message)}`);
    }

    void response.status(status).send(errorResponse);
  }

  private isMongoError(error: unknown): boolean {
    if (typeof error !== 'object' || error === null) {
      return false;
    }
    const err = error as Record<string, unknown>;
    return (
      ('code' in err || 'name' in err) &&
      (err['name'] === 'MongoServerError' || err['code'] === 11000)
    );
  }

  private getErrorCode(status: number): string {
    switch (status as HttpStatus) {
      case HttpStatus.BAD_REQUEST:
        return 'VALIDATION_ERROR';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }
}
