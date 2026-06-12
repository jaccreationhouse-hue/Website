import assert from 'node:assert/strict';
import test from 'node:test';
import { loadEnv, loadProjectEnvFile } from './env.ts';

const validEnv = {
  NODE_ENV: 'test',
  API_PORT: '4000',
  ADMIN_ORIGIN: 'http://localhost:3000',
  MONGODB_URI: 'mongodb://127.0.0.1:27017',
  MONGODB_DB: 'jac_cms_test',
  JWT_ACCESS_SECRET: 'a'.repeat(32),
  JWT_REFRESH_SECRET: 'b'.repeat(32)
};

test('loads validated API environment values', () => {
  const env = loadEnv(validEnv);
  assert.equal(env.apiPort, 4000);
  assert.equal(env.mongoDb, 'jac_cms_test');
  assert.equal(env.accessTtlSeconds, 900);
});

test('provides local development defaults without Docker', () => {
  const env = loadEnv({ NODE_ENV: 'development' });

  assert.equal(env.adminOrigin, 'http://localhost:3000');
  assert.equal(env.publicOrigin, 'http://localhost:5173');
  assert.equal(env.mongoUri, 'mongodb://127.0.0.1:27017');
  assert.equal(env.mongoDb, 'jac_cms');
  assert.deepEqual(env.mongoDnsServers, ['8.8.8.8', '1.1.1.1']);
  assert.ok(env.accessSecret.length >= 32);
  assert.ok(env.refreshSecret.length >= 32);
});

test('loads .env from the CMS workspace root', () => {
  let loadedPath = '';
  loadProjectEnvFile((path) => {
    loadedPath = path;
  });

  assert.match(loadedPath, /cms-platform[\\/]\.env$/);
});

test('requires explicit token secrets in production', () => {
  assert.throws(
    () =>
      loadEnv({
        NODE_ENV: 'production',
        ADMIN_ORIGIN: 'https://admin.example.com',
        MONGODB_URI: 'mongodb://database.example.com:27017',
        MONGODB_DB: 'jac_cms'
      }),
    /JWT_ACCESS_SECRET/
  );
});

test('rejects short token secrets', () => {
  assert.throws(
    () => loadEnv({ ...validEnv, JWT_ACCESS_SECRET: 'short' }),
    /JWT_ACCESS_SECRET/
  );
});
