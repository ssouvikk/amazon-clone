import { Injectable, Scope } from '@nestjs/common';
import { IRequestContext } from '../interfaces/request-context.interface';
import { v4 as uuidv4 } from 'uuid';

/**
 * Request-scoped implementation of IRequestContext.
 * A new instance is created for each incoming request.
 */
@Injectable({ scope: Scope.REQUEST })
export class RequestContextService implements IRequestContext {
  public readonly requestTime: Date;
  public readonly requestId: string;
  private _userId?: string;

  constructor() {
    this.requestTime = new Date();
    this.requestId = uuidv4();
  }

  get userId(): string | undefined {
    return this._userId;
  }

  set userId(id: string) {
    this._userId = id;
  }
}
