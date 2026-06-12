import assert from 'node:assert/strict';
import test from 'node:test';
import { success } from './api-response.ts';

test('success returns a stable API envelope', () => {
  assert.deepEqual(success({ ok: true }, 'req-1'), {
    data: { ok: true },
    meta: { requestId: 'req-1' }
  });
});
