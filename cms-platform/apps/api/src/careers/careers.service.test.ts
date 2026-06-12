import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CareersService,
  type CareerApplicationInput,
  type CareersRepository,
  type ResumeUpload
} from './careers.service.ts';

const scope = { tenantId: 'tenant-1', siteId: 'site-1', siteKey: 'site-one' };
const resume: ResumeUpload = {
  buffer: Buffer.from('resume'),
  originalName: 'priya.pdf',
  mimeType: 'application/pdf',
  size: 6
};
const valid: CareerApplicationInput = {
  openingSlug: 'frontend-developer',
  idempotencyKey: 'application-1',
  name: 'Priya',
  email: 'PRIYA@example.com',
  phone: '9876543210',
  experience: '3 years',
  profileUrl: 'https://linkedin.com/in/priya',
  coverLetter: 'I enjoy building thoughtful interfaces and would like to join the team.',
  source: 'website'
};

function repository(): CareersRepository {
  const applications = new Map<string, { id: string; status: 'new'; createdAt: string }>();
  return {
    async findSiteByKey(siteKey) {
      return siteKey === scope.siteKey ? scope : null;
    },
    async findPublishedOpening(_scope, slug) {
      return slug === 'frontend-developer'
        ? { id: 'opening-1', slug, title: 'Frontend Developer', acceptingApplications: true }
        : null;
    },
    async findByIdempotencyKey(_scope, key) {
      return key ? applications.get(key) ?? null : null;
    },
    async createApplication(_scope, input, uploadedResume) {
      assert.equal(input.email, 'priya@example.com');
      assert.equal(input.openingSlug ? input.openingId : undefined, input.openingSlug ? 'opening-1' : undefined);
      assert.equal(uploadedResume.originalName, 'priya.pdf');
      const application = { id: 'application-1', status: 'new' as const, createdAt: '2026-06-10T00:00:00.000Z' };
      if (input.idempotencyKey) applications.set(input.idempotencyKey, application);
      return application;
    }
  };
}

test('creates a validated role-specific application and normalizes email', async () => {
  const application = await new CareersService(repository()).submit('site-one', valid, resume);
  assert.equal(application.status, 'new');
});

test('creates a general talent-network application without an opening', async () => {
  const application = await new CareersService(repository()).submit(
    'site-one',
    { ...valid, openingSlug: undefined, idempotencyKey: 'general-1' },
    resume
  );
  assert.equal(application.status, 'new');
});

test('returns an existing application for a repeated idempotency key', async () => {
  const service = new CareersService(repository());
  const first = await service.submit('site-one', valid, resume);
  const second = await service.submit('site-one', valid, resume);
  assert.deepEqual(second, first);
});

test('rejects closed openings, invalid files, honeypots, and incomplete candidates', async () => {
  const service = new CareersService(repository());
  const badResume = { ...resume, mimeType: 'image/png' };

  await assert.rejects(() => service.submit('site-one', { ...valid, openingSlug: 'closed-role' }, resume), status(400));
  await assert.rejects(() => service.submit('site-one', valid, badResume), status(400));
  await assert.rejects(() => service.submit('site-one', { ...valid, website: 'spam.example' }, resume), status(400));
  await assert.rejects(() => service.submit('site-one', { ...valid, coverLetter: '' }, resume), status(400));
});

function status(expected: number) {
  return (error: { getStatus?: () => number }) => error.getStatus?.() === expected;
}
