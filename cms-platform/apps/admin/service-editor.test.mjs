import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('./app/content/page.tsx', import.meta.url), 'utf8');

test('service catalogue supports complete editing and publishing', () => {
  assert.match(source, /method:\s*'PUT'/);
  assert.match(source, /Capabilities/);
  assert.match(source, /Featured service/);
  assert.match(source, /New service/);
  assert.match(source, /Unsaved changes/);
  assert.match(source, /beforeunload/);
});
