import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('the website removes the obsolete service worker and its caches', () => {
  assert.doesNotMatch(html, /serviceWorker\.register/);
  assert.match(html, /getRegistrations/);
  assert.match(html, /registration\.unregister/);
  assert.match(html, /caches\.delete/);
});
