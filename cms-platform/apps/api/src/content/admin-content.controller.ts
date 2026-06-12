import { Body, Controller, Get, Inject, Param, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuditService } from '../audit-log/audit.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { SiteAccessGuard } from '../auth/site-access.guard.js';
import { ContentService } from './content.service.js';
import { MongoContentRepository } from './content.repository.js';
import { UpsertPageDto } from './dto/page.dto.js';
import { UpsertCollectionItemDto } from './dto/collection-item.dto.js';
import { UpsertServiceDto } from './dto/service.dto.js';

@ApiTags('admin content')
@ApiBearerAuth()
@UseGuards(AuthGuard, SiteAccessGuard, PermissionsGuard)
@Controller('v1/admin/sites/:siteId')
export class AdminContentController {
  constructor(
    @Inject(ContentService) private readonly content: ContentService,
    @Inject(MongoContentRepository) private readonly repository: MongoContentRepository,
    @Inject(AuditService) private readonly audit: AuditService
  ) {}

  @Get('services')
  @RequirePermissions('content.read')
  listServices(@Param('siteId') siteId: string, @Req() request: any) {
    return this.repository.listServices({
      tenantId: request.user.tenantId,
      siteId,
      siteKey: ''
    });
  }

  @Put('services/:slug')
  @RequirePermissions('content.write')
  async saveService(
    @Param('siteId') siteId: string,
    @Param('slug') slug: string,
    @Body() input: UpsertServiceDto,
    @Req() request: any
  ) {
    const actor = await this.audit.resolveActor(request.user.sub);
    return this.content.saveService(
      { tenantId: request.user.tenantId, siteId, siteKey: '' },
      { ...input, slug },
      actor
    );
  }

  @Get('collections/:collectionKey')
  @RequirePermissions('content.read')
  listCollection(
    @Param('siteId') siteId: string,
    @Param('collectionKey') collectionKey: string,
    @Req() request: any
  ) {
    return this.content.listCollection(
      { tenantId: request.user.tenantId, siteId, siteKey: '' },
      collectionKey
    );
  }

  @Put('collections/:collectionKey/:slug')
  @RequirePermissions('content.write')
  async saveCollectionItem(
    @Param('siteId') siteId: string,
    @Param('collectionKey') collectionKey: string,
    @Param('slug') slug: string,
    @Body() input: UpsertCollectionItemDto,
    @Req() request: any
  ) {
    const actor = await this.audit.resolveActor(request.user.sub);
    return this.content.saveCollectionItem(
      { tenantId: request.user.tenantId, siteId, siteKey: '' },
      collectionKey,
      { ...input, slug },
      actor
    );
  }

  @Put('pages/:slug')
  @RequirePermissions('content.write')
  async savePage(
    @Param('siteId') siteId: string,
    @Param('slug') slug: string,
    @Body() input: UpsertPageDto,
    @Req() request: any
  ) {
    const actor = await this.audit.resolveActor(request.user.sub);
    return this.content.savePage(
      { tenantId: request.user.tenantId, siteId, siteKey: '' },
      { ...input, slug },
      actor
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Settings                                                         */
  /* ---------------------------------------------------------------- */

  @Get('settings')
  @RequirePermissions('settings.write')
  listSettings(@Param('siteId') siteId: string, @Req() request: any) {
    return this.repository.listAllSettings({
      tenantId: request.user.tenantId,
      siteId,
      siteKey: ''
    });
  }

  @Put('settings/:namespace/:key')
  @RequirePermissions('settings.write')
  saveSetting(
    @Param('siteId') siteId: string,
    @Param('namespace') namespace: string,
    @Param('key') key: string,
    @Body() body: { value: unknown; visibility?: 'public' | 'private' },
    @Req() request: any
  ) {
    return this.repository.saveSetting(
      { tenantId: request.user.tenantId, siteId, siteKey: '' },
      namespace,
      key,
      body.value,
      body.visibility ?? 'public'
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Users (read-only)                                                */
  /* ---------------------------------------------------------------- */

  @Get('users')
  @RequirePermissions('settings.write')
  listUsers(@Req() request: any) {
    return this.repository.listUsersWithMemberships(request.user.tenantId);
  }

  /* ---------------------------------------------------------------- */
  /*  Platform info                                                    */
  /* ---------------------------------------------------------------- */

  @Get('platform-info')
  @RequirePermissions('content.read')
  platformInfo(@Param('siteId') siteId: string, @Req() request: any) {
    return {
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform,
      mongoDb: process.env.MONGODB_DB || 'jac_cms',
      cloudinaryCloud: process.env.CLOUDINARY_CLOUD_NAME || '—',
      accessTokenTtl: `${Math.floor((Number(process.env.JWT_ACCESS_TTL_SECONDS) || 900) / 60)} min`,
      refreshTokenTtl: `${Math.floor((Number(process.env.JWT_REFRESH_TTL_SECONDS) || 2592000) / 86400)} days`,
      apiPort: process.env.API_PORT || '4000',
      uptime: `${Math.floor(process.uptime())} seconds`
    };
  }

  /* ---------------------------------------------------------------- */
  /*  Content export                                                   */
  /* ---------------------------------------------------------------- */

  @Get('export')
  @RequirePermissions('settings.write')
  exportContent(@Param('siteId') siteId: string, @Req() request: any) {
    return this.repository.exportAllContent({
      tenantId: request.user.tenantId,
      siteId,
      siteKey: ''
    });
  }
}
