import assert from 'node:assert/strict';
import test from 'node:test';
import { canAccessSite, hasPermissions } from './permissions.ts';

test('requires every requested permission', () => {
  assert.equal(hasPermissions(['content.read', 'content.write'], ['content.read']), true);
  assert.equal(hasPermissions(['content.read'], ['content.read', 'content.write']), false);
});

test('platform administrators satisfy all permission checks', () => {
  assert.equal(hasPermissions(['platform.admin'], ['tenant.delete']), true);
});

test('site access requires membership unless the user is a platform administrator', () => {
  assert.equal(canAccessSite(['site-1'], 'site-1', ['content.read']), true);
  assert.equal(canAccessSite(['site-1'], 'site-2', ['content.read']), false);
  assert.equal(canAccessSite([], 'site-2', ['platform.admin']), true);
});
