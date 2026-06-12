import assert from 'node:assert/strict';
import test from 'node:test';
import { ContentService, type ContentRepository } from './content.service.ts';

const tenant = { tenantId: 'tenant-1', siteId: 'site-1', siteKey: 'site-one' };

function repository(): ContentRepository {
  return {
    async findSiteByKey(siteKey) {
      return siteKey === 'site-one' ? tenant : null;
    },
    async listServices(scope, status) {
      assert.deepEqual(scope, tenant);
      return [
        { id: '1', slug: 'draft', title: 'Draft', status: 'draft' },
        { id: '2', slug: 'live', title: 'Live', status: 'published' }
      ].filter((item) => !status || item.status === status);
    },
    async saveService(scope, input) {
      assert.deepEqual(scope, tenant);
      return { before: null, after: { id: 'service-1', ...input } };
    },
    async findPageBySlug(scope, slug, status) {
      assert.deepEqual(scope, tenant);
      return slug === 'home' && status === 'published'
        ? { id: 'page-1', slug: 'home', title: 'Home', status: 'published', blocks: [] }
        : null;
    },
    async savePage(scope, input) {
      assert.deepEqual(scope, tenant);
      return { before: null, after: { id: 'page-1', ...input } };
    },
    async createRevision(scope, entityType, entity) {
      assert.deepEqual(scope, tenant);
      return { entityType, entityId: entity.id };
    },
    async listCollection(scope, collectionKey, status) {
      assert.deepEqual(scope, tenant);
      return collectionKey === 'highlights' && status === 'published'
        ? [{ id: 'highlight-1', slug: 'projects', title: 'Projects', status: 'published', value: '2,300+' }]
        : [];
    },
    async saveCollectionItem(scope, collectionKey, input) {
      assert.deepEqual(scope, tenant);
      return { before: null, after: { id: 'item-1', ...input, collectionKey } };
    }
  };
}

test('public service reads return published records only', async () => {
  const service = new ContentService(repository());
  const result = await service.listPublishedServices('site-one');

  assert.deepEqual(result.map((item) => item.slug), ['live']);
});

test('admin can save a complete service and create a revision', async () => {
  const service = new ContentService(repository());
  const saved = await service.saveService(tenant, {
    slug: 'web-development',
    title: 'Web Development',
    subtitle: 'Modern websites',
    tagline: 'Built to perform.',
    description: 'Responsive websites designed for business growth.',
    capabilities: ['Business websites', 'E-commerce', 'Performance'],
    featured: true,
    status: 'published',
    sortOrder: 2
  });

  assert.equal(saved.slug, 'web-development');
  assert.equal(saved.featured, true);
});

test('service saves require useful catalogue content', async () => {
  const service = new ContentService(repository());

  await assert.rejects(
    () => service.saveService(tenant, {
      slug: 'empty-service',
      title: 'Empty',
      subtitle: '',
      description: '',
      capabilities: [],
      featured: false,
      status: 'draft'
    }),
    (error: { getStatus?: () => number }) => error.getStatus?.() === 400
  );
});

test('public pages require a valid slug and published record', async () => {
  const service = new ContentService(repository());

  assert.equal((await service.getPublishedPage('site-one', 'home')).title, 'Home');
  await assert.rejects(
    () => service.getPublishedPage('site-one', '../home'),
    (error: { getStatus?: () => number }) => error.getStatus?.() === 400
  );
  await assert.rejects(
    () => service.getPublishedPage('site-one', 'missing'),
    (error: { getStatus?: () => number }) => error.getStatus?.() === 404
  );
});

test('admin page saves create a revision in the same tenant scope', async () => {
  const service = new ContentService(repository());
  const page = await service.savePage(tenant, {
    slug: 'about',
    title: 'About',
    status: 'draft',
    blocks: []
  });

  assert.equal(page.slug, 'about');
});

test('public structured collections are whitelisted and published only', async () => {
  const service = new ContentService(repository());

  const highlights = await service.listPublishedCollection('site-one', 'highlights');
  assert.equal(highlights[0].slug, 'projects');
  await assert.rejects(
    () => service.listPublishedCollection('site-one', 'unknown'),
    (error: { getStatus?: () => number }) => error.getStatus?.() === 400
  );
});

test('missing public sites return not found instead of an internal server error', async () => {
  const service = new ContentService(repository());

  await assert.rejects(
    () => service.listPublishedServices('missing-site'),
    (error: { getStatus?: () => number }) => error.getStatus?.() === 404
  );
});

test('admin can save an item in a supported structured collection', async () => {
  const service = new ContentService(repository());
  const item = await service.saveCollectionItem(tenant, 'programs', {
    slug: 'internship',
    title: 'Internship Program',
    status: 'published',
    data: { kind: 'active' },
    sortOrder: 1
  });

  assert.equal(item.collectionKey, 'programs');
});
