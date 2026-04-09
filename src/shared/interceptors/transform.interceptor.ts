import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';
import { FastifyReply } from 'fastify';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse<FastifyReply>();
    return next.handle().pipe(
      map((data: T) => ({
        success: true,
        data,
        message: 'Success',
        statusCode: response.statusCode,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
