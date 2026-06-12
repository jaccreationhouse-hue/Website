import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const bootstrapUrl = new URL('./bootstrap.mjs', import.meta.url);

test('Mongo bootstrap module is loadable', async () => {
  const { setupDatabase } = await import(bootstrapUrl);
  assert.equal(typeof setupDatabase, 'function');
});

test('Mongo bootstrap defines required CMS collections', async () => {
  const source = await readFile(bootstrapUrl, 'utf8');
  const requiredCollections = [
    'tenants',
    'sites',
    'users',
    'roles',
    'memberships',
    'refreshTokens',
    'pages',
    'contentRevisions',
    'services',
    'settings',
    'menus',
    'menuItems',
    'mediaAssets',
    'formDefinitions',
    'leads',
    'jobApplications',
    'leadActivities',
    'auditLogs',
    'highlights',
    'teamMembers',
    'portfolioProjects',
    'programs',
    'careerOpenings',
    'contacts'
  ];

  for (const collection of requiredCollections) {
    assert.match(source, new RegExp(`['"]${collection}['"]`), `missing ${collection}`);
  }
});

test('Mongo bootstrap defines tenant-scoped integrity indexes', async () => {
  const source = await readFile(bootstrapUrl, 'utf8');

  assert.match(source, /\{\s*tenantId:\s*1,\s*siteId:\s*1,\s*slug:\s*1\s*\}/);
  assert.match(source, /\{\s*siteId:\s*1,\s*namespace:\s*1,\s*key:\s*1\s*\}/);
  assert.match(
    source,
    /\{\s*siteId:\s*1,\s*formDefinitionId:\s*1,\s*idempotencyKey:\s*1\s*\}/
  );
  assert.match(source, /unique:\s*true/);
  assert.match(source, /jobApplications.+tenantId.+siteId.+createdAt/s);
  assert.match(source, /jobApplications.+siteId.+idempotencyKey/s);
});

test('Mongo bootstrap seeds a complete general talent-network opening', async () => {
  const source = await readFile(bootstrapUrl, 'utf8');

  assert.match(source, /slug:\s*'talent-network'/);
  assert.match(source, /generalApplication:\s*true/);
  assert.match(source, /responsibilities:/);
  assert.match(source, /requirements:/);
  assert.match(source, /benefits:/);
});

test('Mongo bootstrap configures a Node DNS fallback for Atlas SRV records', async () => {
  const source = await readFile(bootstrapUrl, 'utf8');

  assert.match(source, /setServers/);
  assert.match(source, /MONGODB_DNS_SERVERS/);
});

test('Mongo bootstrap seeds the complete website service contract', async () => {
  const { obsoleteSeedServiceSlugs, seedServices } = await import(bootstrapUrl);
  const requiredSlugs = [
    'graphic-design',
    'app-development',
    'website-development',
    'seo-marketing',
    'ui-ux-design',
    'digital-marketing',
    'social-media'
  ];

  assert.deepEqual(seedServices.map((service) => service.slug), requiredSlugs);
  assert.ok(seedServices.every((service) =>
    service.subtitle &&
    service.description &&
    service.capabilities.length >= 3 &&
    typeof service.featured === 'boolean'
  ));
  assert.deepEqual(obsoleteSeedServiceSlugs, [
    'brand-strategy',
    'creative-design',
    'web-development',
    'video-production',
    'event-management'
  ]);
});
