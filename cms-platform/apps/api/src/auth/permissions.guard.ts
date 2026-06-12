import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { hasPermissions } from './permissions.js';
import { PERMISSIONS_KEY } from './permissions.decorator.js';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(@Inject(Reflector) private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ]) ?? [];
    const request = context.switchToHttp().getRequest();
    if (hasPermissions(request.user?.permissions ?? [], required)) return true;
    throw new ForbiddenException('Insufficient permissions');
  }
}
