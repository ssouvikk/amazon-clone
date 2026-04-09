import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FastifyRequest } from 'fastify';
import { UserDocument } from '../../modules/user/schemas/user.schema';

@Injectable()
export class UserContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<FastifyRequest & { user?: UserDocument }>();

    if (request.user) {
      // Logic to attach user metadata to request context or headers if needed
      const userId = String(request.user._id);
      request.headers['x-user-id'] = userId;
    }

    return next.handle();
  }
}
