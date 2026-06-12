import assert from 'node:assert/strict';
import test from 'node:test';
import { LeadsService, type LeadsRepository } from './leads.service.ts';

const scope = { tenantId: 'tenant-1', siteId: 'site-1', siteKey: 'site-one' };

function repository(): LeadsRepository {
  const leads = new Map<string, { id: string; status: 'new'; createdAt: string }>();
  return {
    async findSiteByKey(siteKey) {
      return siteKey === scope.siteKey ? scope : null;
    },
    async findForm(siteScope, formKey) {
      assert.deepEqual(siteScope, scope);
      return formKey === 'contact'
        ? {
            id: 'form-1',
            fields: [
              { key: 'subject', required: true },
              { key: 'message', required: true }
            ]
          }
        : null;
    },
    async findByIdempotencyKey(_siteScope, _formId, key) {
      return key ? leads.get(key) ?? null : null;
    },
    async createLead(_siteScope, _formId, input) {
      const lead = { id: 'lead-1', status: 'new' as const, createdAt: '2026-06-10T00:00:00.000Z' };
      if (input.idempotencyKey) leads.set(input.idempotencyKey, lead);
      return lead;
    }
  };
}

const validSubmission = {
  idempotencyKey: 'request-1',
  contact: { name: 'Priya', email: 'priya@example.com' },
  fields: { subject: 'Website', message: 'We need a new website.' }
};

test('creates a validated lead', async () => {
  const service = new LeadsService(repository());
  const lead = await service.submit('site-one', 'contact', validSubmission);
  assert.equal(lead.status, 'new');
});

test('returns the existing lead for a repeated idempotency key', async () => {
  const service = new LeadsService(repository());
  const first = await service.submit('site-one', 'contact', validSubmission);
  const second = await service.submit('site-one', 'contact', validSubmission);
  assert.deepEqual(second, first);
});

test('rejects honeypot submissions and missing required fields', async () => {
  const service = new LeadsService(repository());

  await assert.rejects(
    () => service.submit('site-one', 'contact', { ...validSubmission, website: 'spam.example' }),
    (error: { getStatus?: () => number }) => error.getStatus?.() === 400
  );
  await assert.rejects(
    () => service.submit('site-one', 'contact', { ...validSubmission, fields: { subject: 'Website' } }),
    (error: { getStatus?: () => number }) => error.getStatus?.() === 400
  );
});

test('missing lead sites and forms return not found', async () => {
  const service = new LeadsService(repository());

  await assert.rejects(
    () => service.submit('missing-site', 'contact', validSubmission),
    (error: { getStatus?: () => number }) => error.getStatus?.() === 404
  );
  await assert.rejects(
    () => service.submit('site-one', 'missing-form', validSubmission),
    (error: { getStatus?: () => number }) => error.getStatus?.() === 404
  );
});
