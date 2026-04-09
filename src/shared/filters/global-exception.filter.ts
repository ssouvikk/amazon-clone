import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { FastifyReply, FastifyRequest } from 'fastify';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseData =
      exception instanceof HttpException
        ? (exception.getResponse() as string | Record<string, unknown>)
        : { message: 'Internal server error' };

    const message = (
      typeof responseData === 'object' && responseData !== null && 'message' in responseData
        ? responseData['message']
        : responseData || (exception instanceof Error ? exception.message : 'Internal server error')
    ) as string | string[];

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: Array.isArray(message) ? message[0] : message,
      error: exception instanceof HttpException ? exception.name : 'Error',
    };

    if (status === (HttpStatus.INTERNAL_SERVER_ERROR as number)) {
      this.logger.error(
        `${request.method} ${request.url} ${status} - ${String(message)}`,
        exception instanceof Error ? exception.stack : '',
      );
    } else {
      this.logger.warn(`${request.method} ${request.url} ${status} - ${String(message)}`);
    }

    void response.status(status).send(errorResponse);
  }
}
