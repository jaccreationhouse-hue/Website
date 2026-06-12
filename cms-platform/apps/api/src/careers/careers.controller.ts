import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional, IsString, IsUrl, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { AuthGuard } from '../auth/auth.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { SiteAccessGuard } from '../auth/site-access.guard.js';
import { CareersService, MAX_RESUME_SIZE } from './careers.service.js';
import { MongoCareersRepository } from './careers.repository.js';

class SubmitApplicationDto {
  @IsOptional() @IsString() openingSlug?: string;
  @IsOptional() @IsString() @MaxLength(160) idempotencyKey?: string;
  @IsString() @MinLength(1) @MaxLength(160) name!: string;
  @IsEmail() email!: string;
  @IsOptional() @IsString() @MaxLength(40) phone?: string;
  @IsOptional() @IsString() @MaxLength(160) experience?: string;
  @ValidateIf((_object, value) => value !== '' && value !== undefined)
  @IsUrl({ require_protocol: true })
  @MaxLength(500)
  profileUrl?: string;
  @IsString() @MinLength(10) @MaxLength(5000) coverLetter!: string;
  @IsOptional() @IsString() @MaxLength(80) source?: string;
  @IsOptional() @IsString() website?: string;
}

class UpdateApplicationStatusDto {
  @IsIn(['new', 'reviewing', 'shortlisted', 'interview', 'hired', 'rejected'])
  status!: string;
}

@ApiTags('public careers')
@Controller('v1/public/sites/:siteKey/careers')
export class PublicCareersController {
  constructor(@Inject(CareersService) private readonly careers: CareersService) {}

  @Post('applications')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('resume', { limits: { fileSize: MAX_RESUME_SIZE } }))
  submit(
    @Param('siteKey') siteKey: string,
    @Body() input: SubmitApplicationDto,
    @UploadedFile() file: any
  ) {
    return this.careers.submit(siteKey, input, {
      buffer: file?.buffer,
      originalName: file?.originalname,
      mimeType: file?.mimetype,
      size: file?.size
    });
  }
}

@ApiTags('admin applications')
@ApiBearerAuth()
@UseGuards(AuthGuard, SiteAccessGuard, PermissionsGuard)
@Controller('v1/admin/sites/:siteId/applications')
export class AdminCareersController {
  constructor(@Inject(MongoCareersRepository) private readonly repository: MongoCareersRepository) {}

  @Get()
  @RequirePermissions('leads.read')
  list(@Param('siteId') siteId: string, @Req() request: any) {
    return this.repository.list({ tenantId: request.user.tenantId, siteId, siteKey: '' });
  }

  @Patch(':applicationId')
  @RequirePermissions('leads.write')
  update(
    @Param('siteId') siteId: string,
    @Param('applicationId') applicationId: string,
    @Body() input: UpdateApplicationStatusDto,
    @Req() request: any
  ) {
    return this.repository.updateStatus(
      { tenantId: request.user.tenantId, siteId, siteKey: '' },
      applicationId,
      input.status
    );
  }

  @Get(':applicationId/resume')
  @RequirePermissions('leads.read')
  async resume(
    @Param('siteId') siteId: string,
    @Param('applicationId') applicationId: string,
    @Req() request: any,
    @Res() response: any
  ) {
    const resume = await this.repository.openResume(
      { tenantId: request.user.tenantId, siteId, siteKey: '' },
      applicationId
    );
    response.setHeader('Content-Type', resume.mimeType);
    response.setHeader('Content-Disposition', `attachment; filename="${resume.fileName.replace(/"/g, '')}"`);
    resume.stream.pipe(response);
  }
}
