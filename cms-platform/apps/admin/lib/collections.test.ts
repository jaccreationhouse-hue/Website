import assert from 'node:assert/strict';
import test from 'node:test';
import { websiteCollection, websiteCollections } from './collections.ts';

test('admin exposes every requested website section', () => {
  assert.deepEqual(
    websiteCollections.map(({ key }) => key),
    ['highlights', 'teamMembers', 'portfolioProjects', 'programs', 'careerOpenings', 'contacts']
  );
});

test('every website section defines friendly editor fields', () => {
  assert.ok(websiteCollections.every((collection) => collection.fields.length > 0));
  assert.deepEqual(
    websiteCollection('highlights')?.fields.map((field) => field.key),
    ['value']
  );
  assert.ok(websiteCollection('contacts')?.fields.some((field) => field.key === 'heroDescription'));
});
