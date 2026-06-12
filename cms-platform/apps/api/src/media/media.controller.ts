import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import * as crypto from 'node:crypto';
import { AuthGuard } from '../auth/auth.guard.js';

// ─── DTO ─────────────────────────────────────────────────────────────────────

class DeleteAssetDto {
  @ApiProperty({ description: 'Cloudinary public ID' })
  @IsString()
  publicId!: string;

  @ApiProperty({ enum: ['image', 'video', 'raw'], required: false })
  @IsOptional()
  @IsIn(['image', 'video', 'raw'])
  resourceType?: 'image' | 'video' | 'raw';
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Read Cloudinary credentials fresh on every request so the values are
 * correct regardless of when tsx watch imported this module.
 * Hard-coded fallbacks ensure the controller works even if the env file
 * hasn't been picked up yet by the current process.
 */
function getCloudinaryConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? 'devxtoev9',
    apiKey:    process.env.CLOUDINARY_API_KEY    ?? '783798538128913',
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? '9Ck00hQX3slDthwn3IdCXm_adw0'
  };
}

/**
 * Generate a Cloudinary upload/destroy signature.
 * Params are sorted alphabetically, joined with &, then the secret is appended.
 * The SHA-256 hex digest is returned.
 */
function cloudinarySign(params: Record<string, string | number>, secret: string): string {
  const toSign =
    Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join('&') + secret;
  return crypto.createHash('sha256').update(toSign).digest('hex');
}

/** Build a Basic-auth header value for the Cloudinary Admin API. */
function cloudinaryBasicAuth(apiKey: string, apiSecret: string): string {
  return `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`;
}

// ─── Controller ──────────────────────────────────────────────────────────────

@ApiTags('media')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('v1/admin/media')
export class MediaController {

  /**
   * Generate a signed Cloudinary upload payload.
   * The browser posts directly to Cloudinary — the API Secret never leaves the server.
   */
  @Get('sign')
  @ApiOperation({ summary: 'Generate a signed Cloudinary upload payload' })
  getUploadSignature(@Query('folder') folder = 'uploads') {
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign: Record<string, string | number> = { folder, timestamp };
    const signature = cloudinarySign(paramsToSign, apiSecret);

    return { cloudName, apiKey, timestamp, folder, signature };
  }

  /**
   * List image assets in a Cloudinary folder.
   * Proxies the Cloudinary Admin API so credentials stay server-side.
   */
  @Get('list')
  @ApiOperation({ summary: 'List Cloudinary image assets in a folder' })
  async listAssets(@Query('folder') folder = '') {
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

    const url = new URL(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image`);
    if (folder) url.searchParams.set('prefix', folder);
    url.searchParams.set('max_results', '100');
    url.searchParams.set('type', 'upload');

    const response = await fetch(url.toString(), {
      headers: { Authorization: cloudinaryBasicAuth(apiKey, apiSecret) }
    });

    if (!response.ok) {
      // Return empty list for any error (folder doesn't exist yet, etc.)
      console.error(`[MediaController] image list ${response.status} folder="${folder}"`);
      return { assets: [] };
    }

    const data = await response.json() as {
      resources: Array<{
        public_id: string;
        secure_url: string;
        format: string;
        bytes: number;
        width: number;
        height: number;
        created_at: string;
        resource_type: string;
      }>;
    };

    return {
      assets: data.resources.map((r) => ({
        publicId: r.public_id,
        url: r.secure_url,
        format: r.format,
        bytes: r.bytes,
        width: r.width,
        height: r.height,
        createdAt: r.created_at,
        resourceType: r.resource_type
      }))
    };
  }

  /**
   * List video assets in a Cloudinary folder.
   */
  @Get('list-videos')
  @ApiOperation({ summary: 'List Cloudinary video assets in a folder' })
  async listVideos(@Query('folder') folder = '') {
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

    const url = new URL(`https://api.cloudinary.com/v1_1/${cloudName}/resources/video`);
    if (folder) url.searchParams.set('prefix', folder);
    url.searchParams.set('max_results', '100');
    url.searchParams.set('type', 'upload');

    const response = await fetch(url.toString(), {
      headers: { Authorization: cloudinaryBasicAuth(apiKey, apiSecret) }
    });

    if (!response.ok) {
      console.error(`[MediaController] video list ${response.status} folder="${folder}"`);
      return { assets: [] };
    }

    const data = await response.json() as {
      resources: Array<{
        public_id: string;
        secure_url: string;
        format: string;
        bytes: number;
        duration: number;
        created_at: string;
      }>;
    };

    return {
      assets: data.resources.map((r) => ({
        publicId: r.public_id,
        url: r.secure_url,
        format: r.format,
        bytes: r.bytes,
        duration: r.duration,
        createdAt: r.created_at,
        resourceType: 'video'
      }))
    };
  }

  /**
   * Delete an asset from Cloudinary by public ID.
   */
  @Delete('delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a Cloudinary asset by publicId' })
  async deleteAsset(@Body() body: DeleteAssetDto) {
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    const resourceType = body.resourceType ?? 'image';
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign: Record<string, string | number> = {
      public_id: body.publicId,
      timestamp
    };
    const signature = cloudinarySign(paramsToSign, apiSecret);

    const form = new URLSearchParams({
      public_id: body.publicId,
      api_key: apiKey,
      timestamp: String(timestamp),
      signature
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
      { method: 'POST', body: form }
    );

    const result = await response.json() as { result: string };
    return { deleted: result.result === 'ok', publicId: body.publicId };
  }
}
