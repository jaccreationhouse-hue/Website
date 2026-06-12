import assert from 'node:assert/strict';
import test from 'node:test';
import { MongoCareersRepository } from './careers.repository.ts';

const scope = { tenantId: 'tenant-1', siteId: 'site-1', siteKey: 'site-one' };

test('application administration reads always include tenant and site scope', async () => {
  const filters: unknown[] = [];
  const database = {
    collection(name: string) {
      assert.equal(name, 'jobApplications');
      return {
        find(filter: unknown) {
          filters.push(filter);
          return { sort() { return { limit() { return { toArray: async () => [] }; } }; } };
        }
      };
    }
  };

  await new MongoCareersRepository(database as never).list(scope);
  assert.deepEqual(filters, [{ tenantId: 'tenant-1', siteId: 'site-1' }]);
});

test('application status updates are tenant scoped and reject missing records', async () => {
  let filter: unknown;
  const database = {
    collection() {
      return {
        async findOneAndUpdate(nextFilter: unknown) {
          filter = nextFilter;
          return null;
        }
      };
    }
  };

  await assert.rejects(
    () => new MongoCareersRepository(database as never).updateStatus(scope, 'missing', 'reviewing'),
    (error: { getStatus?: () => number }) => error.getStatus?.() === 404
  );
  assert.deepEqual(filter, { id: 'missing', tenantId: 'tenant-1', siteId: 'site-1' });
});
