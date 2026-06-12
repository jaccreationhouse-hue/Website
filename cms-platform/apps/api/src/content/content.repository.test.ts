import assert from 'node:assert/strict';
import test from 'node:test';
import { MongoContentRepository } from './content.repository.ts';

const scope = { tenantId: 'tenant-1', siteId: 'site-1', siteKey: 'site-one' };

test('content reads always include tenant and site scope', async () => {
  const filters: unknown[] = [];
  const database = {
    collection(name: string) {
      assert.equal(name, 'services');
      return {
        find(filter: unknown) {
          filters.push(filter);
          return {
            sort() {
              return { toArray: async () => [] };
            }
          };
        }
      };
    }
  };
  const repository = new MongoContentRepository(database as never);

  await repository.listServices(scope, 'published');

  assert.deepEqual(filters, [
    { tenantId: 'tenant-1', siteId: 'site-1', status: 'published' }
  ]);
});

test('structured collection reads use the approved Mongo collection and tenant scope', async () => {
  let collectionName = '';
  const filters: unknown[] = [];
  const database = {
    collection(name: string) {
      collectionName = name;
      return {
        find(filter: unknown) {
          filters.push(filter);
          return {
            sort() {
              return { toArray: async () => [] };
            }
          };
        }
      };
    }
  };
  const repository = new MongoContentRepository(database as never);

  await repository.listCollection(scope, 'portfolioProjects', 'published');

  assert.equal(collectionName, 'portfolioProjects');
  assert.deepEqual(filters, [{ tenantId: 'tenant-1', siteId: 'site-1', status: 'published' }]);
});

test('public settings reads only explicitly public rows in the site scope', async () => {
  const filters: unknown[] = [];
  const database = {
    collection(name: string) {
      assert.equal(name, 'settings');
      return {
        find(filter: unknown) {
          filters.push(filter);
          return {
            sort() {
              return { toArray: async () => [] };
            }
          };
        }
      };
    }
  };
  const repository = new MongoContentRepository(database as never);

  await repository.getPublicSettings(scope);

  assert.deepEqual(filters, [{
    tenantId: 'tenant-1',
    siteId: 'site-1',
    visibility: 'public'
  }]);
});

test('service saves use tenant and site scope', async () => {
  let filter: unknown;
  let update: unknown;
  const database = {
    collection(name: string) {
      assert.equal(name, 'services');
      return {
        findOne() {
          return null; // no previous document
        },
        findOneAndUpdate(nextFilter: unknown, nextUpdate: unknown) {
          filter = nextFilter;
          update = nextUpdate;
          return { id: 'service-1', slug: 'web-development', title: 'Web Development', status: 'draft' };
        }
      };
    }
  };
  const repository = new MongoContentRepository(database as never);

  await repository.saveService(scope, {
    slug: 'web-development',
    title: 'Web Development',
    subtitle: 'Modern websites',
    description: 'Responsive websites.',
    capabilities: ['Performance'],
    featured: false,
    status: 'draft',
    sortOrder: 1
  });

  assert.deepEqual(filter, { tenantId: 'tenant-1', siteId: 'site-1', slug: 'web-development' });
  assert.match(JSON.stringify(update), /Modern websites/);
});

