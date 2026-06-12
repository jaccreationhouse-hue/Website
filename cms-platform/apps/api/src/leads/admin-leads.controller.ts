import { Body, Controller, Get, Inject, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { AuthGuard } from '../auth/auth.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { SiteAccessGuard } from '../auth/site-access.guard.js';
import { MongoLeadsRepository } from './leads.repository.js';

class UpdateLeadStatusDto {
  @IsIn(['new', 'contacted', 'qualified', 'closed'])
  status!: string;
}

@ApiTags('admin leads')
@ApiBearerAuth()
@UseGuards(AuthGuard, SiteAccessGuard, PermissionsGuard)
@Controller('v1/admin/sites/:siteId/leads')
export class AdminLeadsController {
  constructor(@Inject(MongoLeadsRepository) private readonly repository: MongoLeadsRepository) {}

  @Get()
  @RequirePermissions('leads.read')
  list(@Param('siteId') siteId: string, @Req() request: any) {
    return this.repository.list({ tenantId: request.user.tenantId, siteId, siteKey: '' });
  }

  @Patch(':leadId')
  @RequirePermissions('leads.write')
  update(
    @Param('siteId') siteId: string,
    @Param('leadId') leadId: string,
    @Body() input: UpdateLeadStatusDto,
    @Req() request: any
  ) {
    return this.repository.updateStatus(
      { tenantId: request.user.tenantId, siteId, siteKey: '' },
      leadId,
      input.status
    );
  }
}
