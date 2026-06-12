import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const collections = await readFile(new URL('./lib/collections.ts', import.meta.url), 'utf8');
const page = await readFile(new URL('./app/applications/page.tsx', import.meta.url), 'utf8').catch(() => '');
const shell = await readFile(new URL('./app/admin-shell.tsx', import.meta.url), 'utf8');

test('career openings expose complete friendly CMS fields', () => {
  for (const field of ['department', 'workplaceType', 'salary', 'responsibilities', 'requirements', 'benefits', 'closingDate', 'generalApplication']) {
    assert.match(collections, new RegExp(field));
  }
});

test('CMS provides a complete applicant tracking inbox', () => {
  assert.match(shell, /Applications/);
  assert.match(page, /new.+reviewing.+shortlisted.+interview.+hired.+rejected/s);
  assert.match(page, /Download resume/);
  assert.match(page, /openingSlug/);
  assert.match(page, /coverLetter/);
  assert.match(page, /authenticatedCmsFetch/);
});
