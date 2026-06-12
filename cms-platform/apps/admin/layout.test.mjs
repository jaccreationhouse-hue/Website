import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const css = await readFile(new URL('./app/globals.css', import.meta.url), 'utf8');

test('admin layout collapses before the expanded sidebar conflicts with content', () => {
  assert.match(css, /@media \(max-width: 1024px\)/);
  assert.match(css, /\.sidebar\s*\{[^}]*position:\s*static/s);
  assert.match(css, /\.main\s*\{[^}]*margin-left:\s*0/s);
});

test('admin mobile layout wraps actions, navigation, and long editor content', () => {
  assert.match(css, /\.page-heading\s*\{[^}]*flex-wrap:\s*wrap/s);
  assert.match(css, /\.sidebar nav\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(css, /\.form textarea\s*\{[^}]*max-width:\s*100%/s);
  assert.match(css, /\.record-list strong\s*\{[^}]*overflow-wrap:\s*anywhere/s);
});
