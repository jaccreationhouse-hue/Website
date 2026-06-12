import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const injections = [
  ['src/auth/auth.controller.ts', 'AuthService'],
  ['src/auth/permissions.guard.ts', 'Reflector'],
  ['src/health.controller.ts', 'DatabaseService'],
  ['src/content/admin-content.controller.ts', 'ContentService'],
  ['src/content/admin-content.controller.ts', 'MongoContentRepository'],
  ['src/content/public-content.controller.ts', 'ContentService'],
  ['src/content/public-content.controller.ts', 'MongoContentRepository'],
  ['src/leads/admin-leads.controller.ts', 'MongoLeadsRepository'],
  ['src/leads/public-forms.controller.ts', 'LeadsService'],
  ['src/careers/careers.controller.ts', 'CareersService'],
  ['src/careers/careers.controller.ts', 'MongoCareersRepository']
];

test('Nest runtime dependencies use explicit injection tokens for tsx development', async () => {
  for (const [path, token] of injections) {
    const source = await readFile(new URL(path, import.meta.url), 'utf8');
    assert.match(source, new RegExp(`@Inject\\(${token}\\)`), `${path} must inject ${token}`);
  }
});
