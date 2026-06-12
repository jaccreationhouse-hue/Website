import assert from 'node:assert/strict';
import test from 'node:test';
import { TokenService } from './token.service.ts';

const service = new TokenService('a'.repeat(32), 'b'.repeat(32), 900, 2_592_000);
const claims = {
  sub: 'user-1',
  tenantId: 'tenant-1',
  siteIds: ['site-1'],
  permissions: ['content.read']
};

test('issues and verifies access tokens', () => {
  const token = service.issueAccessToken(claims, 1_000);
  const verified = service.verifyAccessToken(token, 1_001);
  assert.deepEqual(
    { ...verified, jti: undefined },
    { ...claims, jti: undefined, type: 'access', iat: 1_000, exp: 1_900 }
  );
  assert.match(verified.jti, /^[0-9a-f-]{36}$/);
});

test('rejects token tampering', () => {
  const token = service.issueAccessToken(claims, 1_000);
  assert.throws(() => service.verifyAccessToken(`${token}x`, 1_001), /signature/i);
});

test('rejects expired access tokens', () => {
  const token = service.issueAccessToken(claims, 1_000);
  assert.throws(() => service.verifyAccessToken(token, 2_000), /expired/i);
});

test('rejects refresh tokens when an access token is expected', () => {
  const token = service.issueRefreshToken(claims, 1_000);
  assert.throws(() => service.verifyAccessToken(token, 1_001), /signature|token type/i);
});
