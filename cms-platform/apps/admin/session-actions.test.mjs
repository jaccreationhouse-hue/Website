import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('./app/session-actions.tsx', import.meta.url), 'utf8');

test('admin can revoke and clear its browser session', () => {
  assert.match(source, /\/v1\/auth\/logout/);
  assert.match(source, /clearCmsSession/);
  assert.match(source, /Sign out/);
});
