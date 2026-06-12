import { Controller, Get, Inject, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContentService } from './content.service.js';
import { MongoContentRepository } from './content.repository.js';

@ApiTags('public content')
@Controller('v1/public/sites/:siteKey')
export class PublicContentController {
  constructor(
    @Inject(ContentService) private readonly content: ContentService,
    @Inject(MongoContentRepository) private readonly repository: MongoContentRepository
  ) {}

  @Get('pages/:slug')
  getPage(@Param('siteKey') siteKey: string, @Param('slug') slug: string) {
    return this.content.getPublishedPage(siteKey, slug);
  }

  @Get('services')
  listServices(@Param('siteKey') siteKey: string) {
    return this.content.listPublishedServices(siteKey);
  }

  @Get('collections/:collectionKey')
  listCollection(
    @Param('siteKey') siteKey: string,
    @Param('collectionKey') collectionKey: string
  ) {
    return this.content.listPublishedCollection(siteKey, collectionKey);
  }

  @Get('services/:slug')
  async getService(@Param('siteKey') siteKey: string, @Param('slug') slug: string) {
    const scope = await this.repository.findSiteByKey(siteKey);
    if (!scope) throw new NotFoundException('Site not found');
    const service = await this.repository.findServiceBySlug(scope, slug, 'published');
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  @Get('settings')
  async getSettings(@Param('siteKey') siteKey: string) {
    const scope = await this.repository.findSiteByKey(siteKey);
    if (!scope) throw new NotFoundException('Site not found');
    const rows = await this.repository.getPublicSettings(scope);
    return rows.reduce<Record<string, Record<string, unknown>>>((settings, row) => {
      settings[row.namespace] ??= {};
      settings[row.namespace][row.key] = row.value;
      return settings;
    }, {});
  }

  @Get('menus/:menuKey')
  async getMenu(@Param('siteKey') siteKey: string, @Param('menuKey') menuKey: string) {
    const scope = await this.repository.findSiteByKey(siteKey);
    if (!scope) throw new NotFoundException('Site not found');
    const menu = await this.repository.getMenu(scope, menuKey);
    if (!menu) throw new NotFoundException('Menu not found');
    return menu;
  }
}
