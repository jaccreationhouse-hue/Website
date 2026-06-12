import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { canAccessSite } from './permissions.js';

@Injectable()
export class SiteAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (canAccessSite(
      request.user?.siteIds ?? [],
      request.params?.siteId ?? '',
      request.user?.permissions ?? []
    )) {
      return true;
    }
    throw new ForbiddenException('Site membership required');
  }
}
