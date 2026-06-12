import assert from 'node:assert/strict';
import test from 'node:test';
import { MongoLeadsRepository } from './leads.repository.ts';

const scope = { tenantId: 'tenant-1', siteId: 'site-1', siteKey: 'site-one' };

test('lead administration reads always include tenant and site scope', async () => {
  const filters: unknown[] = [];
  const database = {
    collection(name: string) {
      assert.equal(name, 'leads');
      return {
        find(filter: unknown) {
          filters.push(filter);
          return {
            sort() {
              return { limit() { return { toArray: async () => [] }; } };
            }
          };
        }
      };
    }
  };
  const repository = new MongoLeadsRepository(database as never);

  await repository.list(scope);

  assert.deepEqual(filters, [{ tenantId: 'tenant-1', siteId: 'site-1' }]);
});

test('lead status updates return not found when no scoped lead exists', async () => {
  const database = {
    collection() {
      return {
        findOneAndUpdate: async () => null
      };
    }
  };
  const repository = new MongoLeadsRepository(database as never);

  await assert.rejects(
    () => repository.updateStatus(scope, 'missing-lead', 'contacted'),
    (error: { getStatus?: () => number }) => error.getStatus?.() === 404
  );
});
