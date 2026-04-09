import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { TOKENS } from './shared/constants/tokens';
import { ILogger } from './shared/interfaces/logger.interface';
import { IRequestContext } from './shared/interfaces/request-context.interface';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(TOKENS.LOGGER) private readonly logger: ILogger,
    @Inject(TOKENS.REQUEST_CONTEXT) private readonly requestContext: IRequestContext,
    @Inject(TOKENS.DB_CONNECTION) private readonly db: any,
  ) {}

  @Get()
  getHello(): any {
    this.logger.log(`Request ID: ${this.requestContext.requestId}`, 'AppController');
    this.logger.log(
      `Request Time: ${this.requestContext.requestTime.toISOString()}`,
      'AppController',
    );

    return {
      message: this.appService.getHello(),
      di_demo: {
        request_context: {
          requestId: this.requestContext.requestId,
          timestamp: this.requestContext.requestTime,
        },
        db_connection: this.db,
        logger_scope: 'TRANSIENT',
      },
    };
  }
}
