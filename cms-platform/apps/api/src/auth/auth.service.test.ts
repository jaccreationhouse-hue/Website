import assert from 'node:assert/strict';
import test from 'node:test';
import { AuthService, hashPassword } from './auth.service.ts';
import { TokenService } from './token.service.ts';

function createAuthFixture(passwordHash = hashPassword('password', 'salt')) {
  const documents = {
    users: { id: 'user-1', email: 'admin@example.com', passwordHash, status: 'active' },
    memberships: { userId: 'user-1', tenantId: 'tenant-1', roleId: 'role-1', siteIds: ['site-1'], status: 'active' },
    roles: { id: 'role-1', tenantId: 'tenant-1', permissions: ['content.read'], status: 'active' },
    refreshTokens: null
  };
  const refreshTokens = new Map<string, Record<string, unknown>>();
  const database = {
    collection(name: keyof typeof documents) {
      if (name === 'refreshTokens') {
        return {
          findOneAndUpdate: async (filter: { tokenHash: string }, update: { $set: Record<string, unknown> }) => {
            const token = refreshTokens.get(filter.tokenHash);
            if (!token || token.revokedAt) return null;
            Object.assign(token, update.$set);
            return token;
          },
          insertOne: async (token: Record<string, unknown>) => {
            refreshTokens.set(String(token.tokenHash), token);
            return { acknowledged: true };
          },
          updateOne: async (filter: { tokenHash: string }, update: { $set: Record<string, unknown> }) => {
            const token = refreshTokens.get(filter.tokenHash);
            if (token) Object.assign(token, update.$set);
            return { acknowledged: true };
          }
        };
      }
      return {
        findOne: async () => documents[name],
        insertOne: async () => ({ acknowledged: true })
      };
    }
  };
  const tokens = new TokenService('a'.repeat(32), 'b'.repeat(32), 900, 2_592_000);
  return { service: new AuthService(database as never, tokens), tokens };
}

test('login builds claims from Mongo user membership and role documents', async () => {
  const { service, tokens } = createAuthFixture();

  const result = await service.login('ADMIN@example.com', 'password');
  const claims = tokens.verifyAccessToken(result.accessToken);

  assert.equal(claims.tenantId, 'tenant-1');
  assert.deepEqual(claims.siteIds, ['site-1']);
  assert.deepEqual(claims.permissions, ['content.read']);
});

test('malformed stored password hashes are rejected as invalid credentials', async () => {
  const { service } = createAuthFixture('scrypt$salt$A');

  await assert.rejects(
    () => service.login('admin@example.com', 'password'),
    (error: { getStatus?: () => number }) => error.getStatus?.() === 401
  );
});

test('invalid refresh tokens are rejected as unauthorized', async () => {
  const { service } = createAuthFixture();

  await assert.rejects(
    () => service.refresh('not-a-token'),
    (error: { getStatus?: () => number }) => error.getStatus?.() === 401
  );
});

test('refresh tokens rotate once and cannot be reused', async () => {
  const { service } = createAuthFixture();
  const login = await service.login('admin@example.com', 'password');

  const refreshed = await service.refresh(login.refreshToken);
  assert.notEqual(refreshed.refreshToken, login.refreshToken);
  await assert.rejects(
    () => service.refresh(login.refreshToken),
    (error: { getStatus?: () => number }) => error.getStatus?.() === 401
  );
});
