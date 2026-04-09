import { Injectable, Logger, Scope } from '@nestjs/common';
import { ILogger } from '../interfaces/logger.interface';

/**
 * Transient-scoped implementation of ILogger.
 * A new instance is created every time this service is injected.
 */
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements ILogger {
  private context?: string;
  private readonly logger = new Logger();

  setContext(context: string): void {
    this.context = context;
  }

  log(message: string, context?: string): void {
    this.logger.log(message, context || this.context);
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, trace, context || this.context);
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, context || this.context);
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, context || this.context);
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, context || this.context);
  }
}
