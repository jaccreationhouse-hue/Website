import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('./app/leads/page.tsx', import.meta.url), 'utf8');

test('lead inbox supports protected status progression', () => {
  assert.match(source, /method:\s*'PATCH'/);
  assert.match(source, /<select/);
  assert.match(source, /contacted/);
  assert.match(source, /qualified/);
  assert.match(source, /closed/);
});
