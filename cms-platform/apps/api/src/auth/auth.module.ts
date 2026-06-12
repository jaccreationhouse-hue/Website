import { Module } from '@nestjs/common';
import { loadEnv } from '../config/env.js';
import { DatabaseService } from '../database/database.service.js';
import { TOKEN_SERVICE } from './auth.constants.js';
import { AuthController } from './auth.controller.js';
import { AuthGuard } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import { PermissionsGuard } from './permissions.guard.js';
import { SiteAccessGuard } from './site-access.guard.js';
import { TokenService } from './token.service.js';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: TOKEN_SERVICE,
      useFactory: () => {
        const env = loadEnv();
        return new TokenService(
          env.accessSecret,
          env.refreshSecret,
          env.accessTtlSeconds,
          env.refreshTtlSeconds
        );
      }
    },
    {
      provide: TokenService,
      useExisting: TOKEN_SERVICE
    },
    {
      provide: AuthService,
      useFactory: (database: DatabaseService, tokens: TokenService) =>
        new AuthService(database, tokens),
      inject: [DatabaseService, TOKEN_SERVICE]
    },
    AuthGuard,
    PermissionsGuard,
    SiteAccessGuard
  ],
  exports: [AuthGuard, PermissionsGuard, SiteAccessGuard, TOKEN_SERVICE]
})
export class AuthModule {}
