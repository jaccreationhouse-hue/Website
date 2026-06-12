import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('./app/collections/[collectionKey]/page.tsx', import.meta.url), 'utf8');

test('collection editor provides friendly fields and productivity controls', () => {
  assert.match(source, /definition\.fields\.map/);
  assert.match(source, /Search records/);
  assert.match(source, /Advanced JSON/);
  assert.match(source, /Unsaved changes/);
  assert.match(source, /generateSlug/);
  assert.match(source, /Duplicate record/);
  assert.match(source, /beforeunload/);
});
