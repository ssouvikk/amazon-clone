import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TOKENS } from './constants/tokens';
import { LoggerService } from './services/logger.service';
import { RequestContextService } from './services/request-context.service';

import { IDbConnection } from './interfaces/db-connection.interface';

/**
 * Global SharedModule providing cross-cutting concerns like logging,
 * config, and request context using various DI patterns.
 */
@Global()
@Module({
  providers: [
    // 1. Class Provider (Logger)
    {
      provide: TOKENS.LOGGER,
      useClass: LoggerService,
    },
    // 2. Class Provider (Request Context - Scope.REQUEST)
    {
      provide: TOKENS.REQUEST_CONTEXT,
      useClass: RequestContextService,
    },
    // 3. Factory Provider (DB Connection simulation)
    {
      provide: TOKENS.DB_CONNECTION,
      useFactory: (configService: ConfigService): IDbConnection => {
        const dbUri = configService.get<string>('database.uri');
        // Simulate async DB connection
        return {
          uri: dbUri,
          connected: true,
          type: 'SIMULATED_DB',
        };
      },
      inject: [ConfigService],
    },
    // 4. Value Provider (App Config Alias)
    {
      provide: TOKENS.APP_CONFIG,
      useFactory: (configService: ConfigService): Record<string, unknown> => ({
        nodeEnv: configService.get<string>('app.nodeEnv'),
        port: configService.get<number>('app.port'),
        apiPrefix: configService.get<string>('app.apiPrefix'),
      }),
      inject: [ConfigService],
    },
  ],
  exports: [TOKENS.LOGGER, TOKENS.REQUEST_CONTEXT, TOKENS.DB_CONNECTION, TOKENS.APP_CONFIG],
})
export class SharedModule {}
