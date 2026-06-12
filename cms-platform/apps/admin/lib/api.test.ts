import assert from 'node:assert/strict';
import test from 'node:test';
import {
  apiUrl,
  authenticatedCmsFetch,
  CmsAuthenticationError,
  CmsHttpError,
  cmsSiteId,
  createHeaders
} from './api.ts';

test('apiUrl removes duplicate slashes and preserves the versioned path', () => {
  assert.equal(
    apiUrl('/v1/public/sites/jac-media-land/settings', 'http://localhost:4000/'),
    'http://localhost:4000/v1/public/sites/jac-media-land/settings'
  );
});

test('createHeaders adds bearer authentication when available', () => {
  assert.deepEqual(createHeaders('token-1'), {
    'Content-Type': 'application/json',
    Authorization: 'Bearer token-1'
  });
});

test('default admin site matches the MongoDB bootstrap membership', () => {
  assert.equal(cmsSiteId, 'site-jac-media-land');
});

test('authenticatedCmsFetch refreshes an expired access token and retries', async () => {
  const values = new Map([
    ['cmsAccessToken', 'expired'],
    ['cmsRefreshToken', 'refresh-1']
  ]);
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key)
  };
  const requests: string[] = [];
  const fetchImpl: typeof fetch = async (url, init) => {
    requests.push(`${String(url)} ${String(new Headers(init?.headers).get('Authorization'))}`);
    if (String(url).endsWith('/v1/auth/refresh')) {
      return new Response(JSON.stringify({ accessToken: 'fresh', refreshToken: 'refresh-2' }), { status: 200 });
    }
    if (new Headers(init?.headers).get('Authorization') === 'Bearer fresh') {
      return new Response(JSON.stringify([{ id: 'item-1' }]), { status: 200 });
    }
    return new Response('Unauthorized', { status: 401 });
  };

  const result = await authenticatedCmsFetch<{ id: string }[]>(
    '/v1/admin/items',
    {},
    { storage, fetchImpl, baseUrl: 'http://cms.test' }
  );

  assert.equal(result[0].id, 'item-1');
  assert.equal(values.get('cmsAccessToken'), 'fresh');
  assert.equal(requests.length, 3);
});

test('authenticatedCmsFetch rejects a missing browser session clearly', async () => {
  const storage = {
    getItem: () => null,
    setItem: () => undefined,
    removeItem: () => undefined
  };

  await assert.rejects(
    () => authenticatedCmsFetch('/v1/admin/items', {}, { storage }),
    CmsAuthenticationError
  );
});

test('cmsFetch exposes the API message instead of raw JSON', async () => {
  await assert.rejects(
    () => authenticatedCmsFetch('/v1/admin/items', {}, {
      storage: {
        getItem: (key) => key === 'cmsAccessToken' ? 'token' : null,
        setItem: () => undefined,
        removeItem: () => undefined
      },
      fetchImpl: async () => new Response(JSON.stringify({
        message: 'Site membership required',
        error: 'Forbidden',
        statusCode: 403
      }), { status: 403 }),
      baseUrl: 'http://cms.test'
    }),
    (error: unknown) => error instanceof CmsHttpError && error.message === 'Site membership required'
  );
});
