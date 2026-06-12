import { randomUUID } from 'node:crypto';
import type { Document } from 'mongodb';
import type { DatabaseService } from '../database/database.service.js';
import type {
  ContentRecord,
  ContentRepository,
  PageInput,
  SiteScope,
  CollectionItemInput,
  ServiceInput,
  StructuredCollectionKey
} from './content.service.js';

type StoredContent = ContentRecord & Document;
export interface SettingDocument extends Document {
  namespace: string;
  key: string;
  value: unknown;
}

export interface SaveResult {
  before: ContentRecord | null;
  after: ContentRecord;
}

export class MongoContentRepository implements ContentRepository {
  private readonly database: DatabaseService;

  constructor(database: DatabaseService) {
    this.database = database;
  }

  async findSiteByKey(siteKey: string): Promise<SiteScope | null> {
    const site = await this.database.collection('sites').findOne(
      { key: siteKey, status: 'active' },
      { projection: { _id: 0, id: 1, tenantId: 1, key: 1 } }
    );
    return site
      ? { tenantId: String(site.tenantId), siteId: String(site.id), siteKey: String(site.key) }
      : null;
  }

  async listServices(scope: SiteScope, status?: string): Promise<ContentRecord[]> {
    const filter: Document = { tenantId: scope.tenantId, siteId: scope.siteId };
    if (status) filter.status = status;
    return this.database.collection<StoredContent>('services')
      .find(filter, { projection: { _id: 0 } })
      .sort({ sortOrder: 1, title: 1 })
      .toArray();
  }

  async saveService(scope: SiteScope, input: ServiceInput): Promise<SaveResult> {
    const now = new Date();

    // Capture the document before the update
    const before = await this.database.collection<StoredContent>('services').findOne(
      { tenantId: scope.tenantId, siteId: scope.siteId, slug: input.slug },
      { projection: { _id: 0 } }
    );

    const service = await this.database.collection<StoredContent>('services').findOneAndUpdate(
      { tenantId: scope.tenantId, siteId: scope.siteId, slug: input.slug },
      {
        $set: {
          title: input.title,
          subtitle: input.subtitle,
          tagline: input.tagline ?? '',
          description: input.description,
          capabilities: input.capabilities,
          featured: input.featured,
          status: input.status,
          sortOrder: input.sortOrder ?? 0,
          ...(input.status === 'published' ? { publishedAt: now } : {}),
          updatedAt: now
        },
        $setOnInsert: {
          id: input.id ?? randomUUID(),
          tenantId: scope.tenantId,
          siteId: scope.siteId,
          slug: input.slug,
          createdAt: now
        }
      },
      { upsert: true, returnDocument: 'after', projection: { _id: 0 } }
    );
    if (!service) throw new Error('Service could not be saved');
    return { before: before ?? null, after: service };
  }

  findPageBySlug(scope: SiteScope, slug: string, status?: string): Promise<ContentRecord | null> {
    const filter: Document = { tenantId: scope.tenantId, siteId: scope.siteId, slug };
    if (status) filter.status = status;
    return this.database.collection<StoredContent>('pages').findOne(
      filter,
      { projection: { _id: 0 } }
    );
  }

  async savePage(scope: SiteScope, input: PageInput): Promise<SaveResult> {
    const now = new Date();

    // Capture the document before the update
    const before = await this.database.collection<StoredContent>('pages').findOne(
      { tenantId: scope.tenantId, siteId: scope.siteId, slug: input.slug },
      { projection: { _id: 0 } }
    );

    const page = await this.database.collection<StoredContent>('pages').findOneAndUpdate(
      { tenantId: scope.tenantId, siteId: scope.siteId, slug: input.slug },
      {
        $set: {
          title: input.title,
          status: input.status,
          blocks: input.blocks,
          seo: input.seo ?? {},
          ...(input.status === 'published' ? { publishedAt: now } : {}),
          updatedAt: now
        },
        $setOnInsert: {
          id: input.id ?? randomUUID(),
          tenantId: scope.tenantId,
          siteId: scope.siteId,
          slug: input.slug,
          createdAt: now
        }
      },
      { upsert: true, returnDocument: 'after', projection: { _id: 0 } }
    );
    if (!page) throw new Error('Page could not be saved');
    return { before: before ?? null, after: page };
  }

  async createRevision(scope: SiteScope, entityType: string, entity: ContentRecord) {
    const collection = this.database.collection('contentRevisions');
    const latest = await collection.findOne(
      { tenantId: scope.tenantId, siteId: scope.siteId, entityType, entityId: entity.id },
      { sort: { revisionNumber: -1 }, projection: { revisionNumber: 1 } }
    );
    await collection.insertOne({
      id: randomUUID(),
      tenantId: scope.tenantId,
      siteId: scope.siteId,
      entityType,
      entityId: entity.id,
      revisionNumber: Number(latest?.revisionNumber ?? 0) + 1,
      snapshot: entity,
      createdAt: new Date()
    });
    return { entityType, entityId: entity.id };
  }

  getPublicSettings(scope: SiteScope) {
    return this.database.collection<SettingDocument>('settings')
      .find(
        { tenantId: scope.tenantId, siteId: scope.siteId, visibility: 'public' },
        { projection: { _id: 0, namespace: 1, key: 1, value: 1 } }
      )
      .sort({ namespace: 1, key: 1 })
      .toArray();
  }

  async getMenu(scope: SiteScope, menuKey: string) {
    const menu = await this.database.collection('menus').findOne(
      { tenantId: scope.tenantId, siteId: scope.siteId, key: menuKey },
      { projection: { _id: 0 } }
    );
    if (!menu) return null;
    const items = await this.database.collection('menuItems')
      .find(
        { tenantId: scope.tenantId, siteId: scope.siteId, menuId: menu.id },
        { projection: { _id: 0 } }
      )
      .sort({ sortOrder: 1 })
      .toArray();
    return { ...menu, items };
  }

  findServiceBySlug(scope: SiteScope, slug: string, status?: string) {
    const filter: Document = { tenantId: scope.tenantId, siteId: scope.siteId, slug };
    if (status) filter.status = status;
    return this.database.collection<StoredContent>('services').findOne(
      filter,
      { projection: { _id: 0 } }
    );
  }

  async listCollection(
    scope: SiteScope,
    collectionKey: StructuredCollectionKey,
    status?: string
  ): Promise<ContentRecord[]> {
    const filter: Document = { tenantId: scope.tenantId, siteId: scope.siteId };
    if (status) filter.status = status;
    return this.database.collection<StoredContent>(collectionKey)
      .find(filter, { projection: { _id: 0 } })
      .sort({ sortOrder: 1, title: 1 })
      .toArray();
  }

  async saveCollectionItem(
    scope: SiteScope,
    collectionKey: StructuredCollectionKey,
    input: CollectionItemInput
  ): Promise<SaveResult> {
    const now = new Date();

    // Capture the document before the update
    const before = await this.database.collection<StoredContent>(collectionKey).findOne(
      { tenantId: scope.tenantId, siteId: scope.siteId, slug: input.slug },
      { projection: { _id: 0 } }
    );

    const item = await this.database.collection<StoredContent>(collectionKey).findOneAndUpdate(
      { tenantId: scope.tenantId, siteId: scope.siteId, slug: input.slug },
      {
        $set: {
          title: input.title,
          status: input.status,
          sortOrder: input.sortOrder ?? 0,
          ...safeData(input.data),
          ...(input.status === 'published' ? { publishedAt: now } : {}),
          updatedAt: now
        },
        $setOnInsert: {
          id: input.id ?? randomUUID(),
          tenantId: scope.tenantId,
          siteId: scope.siteId,
          slug: input.slug,
          createdAt: now
        }
      },
      { upsert: true, returnDocument: 'after', projection: { _id: 0 } }
    );
    if (!item) throw new Error('Collection item could not be saved');
    return { before: before ?? null, after: item };
  }

  /* ---------------------------------------------------------------- */
  /*  Settings (admin CRUD)                                            */
  /* ---------------------------------------------------------------- */

  listAllSettings(scope: SiteScope) {
    return this.database.collection<SettingDocument>('settings')
      .find(
        { tenantId: scope.tenantId, siteId: scope.siteId },
        { projection: { _id: 0 } }
      )
      .sort({ namespace: 1, key: 1 })
      .toArray();
  }

  async saveSetting(
    scope: SiteScope,
    namespace: string,
    key: string,
    value: unknown,
    visibility: 'public' | 'private' = 'public'
  ) {
    const now = new Date();
    const result = await this.database.collection<SettingDocument>('settings').findOneAndUpdate(
      { siteId: scope.siteId, namespace, key },
      {
        $set: { tenantId: scope.tenantId, visibility, value, updatedAt: now },
        $setOnInsert: {
          id: `setting-${namespace}-${key}`,
          siteId: scope.siteId,
          namespace,
          key,
          createdAt: now
        }
      },
      { upsert: true, returnDocument: 'after', projection: { _id: 0 } }
    );
    return result;
  }

  /* ---------------------------------------------------------------- */
  /*  Users (admin read-only)                                          */
  /* ---------------------------------------------------------------- */

  async listUsersWithMemberships(tenantId: string) {
    const users = await this.database.collection('users')
      .find({ status: 'active' }, { projection: { _id: 0, id: 1, name: 1, email: 1, status: 1, createdAt: 1 } })
      .sort({ name: 1 })
      .toArray();

    const memberships = await this.database.collection('memberships')
      .find({ tenantId, status: 'active' }, { projection: { _id: 0, userId: 1, roleId: 1, siteIds: 1 } })
      .toArray();

    const roles = await this.database.collection('roles')
      .find({ tenantId }, { projection: { _id: 0, id: 1, name: 1 } })
      .toArray();

    const roleMap = new Map(roles.map((r) => [r.id, r.name]));
    const membershipMap = new Map(memberships.map((m) => [m.userId, m]));

    return users.map((user) => {
      const membership = membershipMap.get(user.id);
      return {
        ...user,
        role: membership ? roleMap.get(membership.roleId as string) || 'Unknown' : 'No role',
        siteIds: (membership?.siteIds as string[]) || []
      };
    });
  }

  /* ---------------------------------------------------------------- */
  /*  Content export (admin)                                           */
  /* ---------------------------------------------------------------- */

  async exportAllContent(scope: SiteScope) {
    const filter = { tenantId: scope.tenantId, siteId: scope.siteId };
    const projection = { projection: { _id: 0 } };

    const [services, pages, settings, highlights, teamMembers, portfolioProjects, programs, careerOpenings, contacts] =
      await Promise.all([
        this.database.collection('services').find(filter, projection).toArray(),
        this.database.collection('pages').find(filter, projection).toArray(),
        this.database.collection('settings').find(filter, projection).toArray(),
        this.database.collection('highlights').find(filter, projection).toArray(),
        this.database.collection('teamMembers').find(filter, projection).toArray(),
        this.database.collection('portfolioProjects').find(filter, projection).toArray(),
        this.database.collection('programs').find(filter, projection).toArray(),
        this.database.collection('careerOpenings').find(filter, projection).toArray(),
        this.database.collection('contacts').find(filter, projection).toArray()
      ]);

    return {
      exportedAt: new Date().toISOString(),
      site: scope.siteId,
      services,
      pages,
      settings,
      collections: { highlights, teamMembers, portfolioProjects, programs, careerOpenings, contacts }
    };
  }
}

function safeData(data: Record<string, unknown>): Record<string, unknown> {
  const reserved = new Set([
    '_id', 'id', 'tenantId', 'siteId', 'slug', 'title', 'status', 'sortOrder',
    'createdAt', 'updatedAt', 'publishedAt'
  ]);
  return Object.fromEntries(Object.entries(data).filter(([key]) => !reserved.has(key)));
}

