import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { TOKEN_SERVICE } from './auth.constants.js';
import { TokenService } from './token.service.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(TOKEN_SERVICE) private readonly tokens: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (typeof authorization !== 'string' || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Bearer token required');
    }
    try {
      request.user = this.tokens.verifyAccessToken(authorization.slice(7));
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
