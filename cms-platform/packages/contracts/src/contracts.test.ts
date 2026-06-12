import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CONTENT_STATUSES,
  createApiEnvelope,
  type PageResponse,
  type ServiceResponse
} from './index.ts';

test('content status values remain stable for API consumers', () => {
  assert.deepEqual(CONTENT_STATUSES, ['draft', 'published', 'archived']);
});

test('API envelopes expose data and request metadata', () => {
  const page: PageResponse = {
    id: 'page-1',
    slug: 'home',
    title: 'Home',
    status: 'published',
    blocks: []
  };

  assert.deepEqual(createApiEnvelope(page, 'request-1'), {
    data: page,
    meta: { requestId: 'request-1' }
  });
});

test('service contracts preserve structured catalogue fields', () => {
  const service: ServiceResponse = {
    id: 'service-1',
    slug: 'website-development',
    title: 'Website Development',
    subtitle: 'Modern websites',
    description: 'Fast and dependable websites.',
    capabilities: ['Performance'],
    featured: false,
    status: 'published'
  };

  assert.equal(service.capabilities[0], 'Performance');
});
