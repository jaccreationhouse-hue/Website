import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('./app/admin-shell.tsx', import.meta.url), 'utf8');
const css = await readFile(new URL('./app/globals.css', import.meta.url), 'utf8');

test('admin shell exposes active navigation and a focused login layout', () => {
  assert.match(source, /usePathname/);
  assert.match(source, /nav-link \$\{isActive/);
  assert.match(source, /auth-shell/);
});

test('redesign uses the JAC editorial workspace visual system', () => {
  assert.match(css, /--canvas:\s*#f5f3ef/);
  assert.match(css, /\.workspace-shell/);
  assert.match(css, /\.nav-link\.active/);
  assert.match(css, /\.auth-shell/);
});
