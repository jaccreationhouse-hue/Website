import { Controller, Get, Inject, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { SiteAccessGuard } from '../auth/site-access.guard.js';
import { AuditService } from './audit.service.js';

@ApiTags('audit log')
@ApiBearerAuth()
@UseGuards(AuthGuard, SiteAccessGuard, PermissionsGuard)
@Controller('v1/admin/sites/:siteId/audit-logs')
export class AuditController {
  constructor(@Inject(AuditService) private readonly audit: AuditService) {}

  @Get()
  @RequirePermissions('content.read')
  list(
    @Param('siteId') siteId: string,
    @Query('entityType') entityType: string | undefined,
    @Query('actorId') actorId: string | undefined,
    @Query('limit') limit: string | undefined,
    @Query('before') before: string | undefined,
    @Req() request: any
  ) {
    return this.audit.list(
      { tenantId: request.user.tenantId, siteId },
      {
        entityType: entityType || undefined,
        actorId: actorId || undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
        before: before ? new Date(before) : undefined
      }
    );
  }
}
