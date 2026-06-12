import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { AuditService, Actor } from '../audit-log/audit.service.js';
import type { SaveResult } from './content.repository.js';

export interface SiteScope {
  tenantId: string;
  siteId: string;
  siteKey: string;
}

export interface ContentRecord {
  id: string;
  slug: string;
  title: string;
  status: string;
  [key: string]: unknown;
}

export interface PageInput {
  id?: string;
  slug: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  blocks: unknown[];
  seo?: Record<string, unknown>;
}

export interface ServiceInput {
  id?: string;
  slug: string;
  title: string;
  subtitle: string;
  tagline?: string;
  description: string;
  capabilities: string[];
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  sortOrder?: number;
}

export const structuredCollectionKeys = [
  'highlights',
  'teamMembers',
  'portfolioProjects',
  'programs',
  'careerOpenings',
  'contacts'
] as const;

export type StructuredCollectionKey = typeof structuredCollectionKeys[number];

export interface CollectionItemInput {
  id?: string;
  slug: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  sortOrder?: number;
  data: Record<string, unknown>;
}

export interface ContentRepository {
  findSiteByKey(siteKey: string): Promise<SiteScope | null>;
  listServices(scope: SiteScope, status?: string): Promise<ContentRecord[]>;
  saveService(scope: SiteScope, input: ServiceInput): Promise<SaveResult>;
  findPageBySlug(scope: SiteScope, slug: string, status?: string): Promise<ContentRecord | null>;
  savePage(scope: SiteScope, input: PageInput): Promise<SaveResult>;
  createRevision(
    scope: SiteScope,
    entityType: string,
    entity: ContentRecord
  ): Promise<{ entityType: string; entityId: string }>;
  listCollection(
    scope: SiteScope,
    collectionKey: StructuredCollectionKey,
    status?: string
  ): Promise<ContentRecord[]>;
  saveCollectionItem(
    scope: SiteScope,
    collectionKey: StructuredCollectionKey,
    input: CollectionItemInput
  ): Promise<SaveResult>;
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class ContentService {
  private readonly repository: ContentRepository;
  private readonly audit: AuditService | null;

  constructor(repository: ContentRepository, audit?: AuditService) {
    this.repository = repository;
    this.audit = audit ?? null;
  }

  async listPublishedServices(siteKey: string): Promise<ContentRecord[]> {
    const scope = await this.site(siteKey);
    return this.repository.listServices(scope, 'published');
  }

  async saveService(scope: SiteScope, input: ServiceInput, actor?: Actor): Promise<ContentRecord> {
    this.assertSlug(input.slug);
    const title = input.title.trim();
    const subtitle = input.subtitle.trim();
    const description = input.description.trim();
    const capabilities = input.capabilities.map((item) => item.trim()).filter(Boolean);
    if (!title || !subtitle || !description || capabilities.length === 0) {
      throw new BadRequestException('Title, subtitle, description, and capabilities are required');
    }
    const result = await this.repository.saveService(scope, {
      ...input,
      title,
      subtitle,
      tagline: input.tagline?.trim() || undefined,
      description,
      capabilities
    });
    await this.repository.createRevision(scope, 'service', result.after);
    if (this.audit && actor) {
      await this.audit.recordChange(
        scope, actor, 'service', result.after.id, result.after.title,
        result.before as Record<string, unknown> | null,
        result.after as Record<string, unknown>
      );
    }
    return result.after;
  }

  async getPublishedPage(siteKey: string, slug: string): Promise<ContentRecord> {
    this.assertSlug(slug);
    const scope = await this.site(siteKey);
    const page = await this.repository.findPageBySlug(scope, slug, 'published');
    if (!page) throw new NotFoundException('Published page not found');
    return page;
  }

  async savePage(scope: SiteScope, input: PageInput, actor?: Actor): Promise<ContentRecord> {
    this.assertSlug(input.slug);
    if (!input.title.trim()) throw new BadRequestException('Page title is required');
    const result = await this.repository.savePage(scope, {
      ...input,
      title: input.title.trim()
    });
    await this.repository.createRevision(scope, 'page', result.after);
    if (this.audit && actor) {
      await this.audit.recordChange(
        scope, actor, 'page', result.after.id, result.after.title,
        result.before as Record<string, unknown> | null,
        result.after as Record<string, unknown>
      );
    }
    return result.after;
  }

  async listPublishedCollection(siteKey: string, collectionKey: string): Promise<ContentRecord[]> {
    const key = this.collectionKey(collectionKey);
    const scope = await this.site(siteKey);
    return this.repository.listCollection(scope, key, 'published');
  }

  listCollection(scope: SiteScope, collectionKey: string): Promise<ContentRecord[]> {
    return this.repository.listCollection(scope, this.collectionKey(collectionKey));
  }

  async saveCollectionItem(
    scope: SiteScope,
    collectionKey: string,
    input: CollectionItemInput,
    actor?: Actor
  ): Promise<ContentRecord> {
    const key = this.collectionKey(collectionKey);
    this.assertSlug(input.slug);
    if (!input.title.trim()) throw new BadRequestException('Item title is required');
    const result = await this.repository.saveCollectionItem(scope, key, {
      ...input,
      title: input.title.trim()
    });
    await this.repository.createRevision(scope, key, result.after);
    if (this.audit && actor) {
      await this.audit.recordChange(
        scope, actor, key, result.after.id, result.after.title,
        result.before as Record<string, unknown> | null,
        result.after as Record<string, unknown>
      );
    }
    return result.after;
  }

  private assertSlug(slug: string): void {
    if (!SLUG.test(slug)) throw new BadRequestException('Invalid slug');
  }

  private collectionKey(value: string): StructuredCollectionKey {
    if (!structuredCollectionKeys.includes(value as StructuredCollectionKey)) {
      throw new BadRequestException('Unsupported content collection');
    }
    return value as StructuredCollectionKey;
  }

  private async site(siteKey: string): Promise<SiteScope> {
    this.assertSlug(siteKey);
    const scope = await this.repository.findSiteByKey(siteKey);
    if (!scope) throw new NotFoundException('Site not found');
    return scope;
  }
}
