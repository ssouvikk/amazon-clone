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

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseData = exception instanceof HttpException
        ? (exception.getResponse() as Record<string, any>)
        : { message: 'Internal server error' };

    const message = responseData['message'] || (exception instanceof Error ? exception.message : 'Internal server error');

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: Array.isArray(message) ? message[0] : message,
      error: exception instanceof HttpException ? exception.name : 'Error',
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} ${status} - ${message}`,
        exception instanceof Error ? exception.stack : '',
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} ${status} - ${message}`,
      );
    }

    void response.status(status).send(errorResponse);
  }
}
