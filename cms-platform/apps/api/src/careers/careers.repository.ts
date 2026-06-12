import { randomUUID } from 'node:crypto';
import { Readable } from 'node:stream';
import { NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import type { DatabaseService } from '../database/database.service.js';
import type {
  CareerApplication,
  CareerApplicationInput,
  CareerOpening,
  CareersRepository,
  CareerSiteScope,
  ResumeUpload
} from './careers.service.js';

export class MongoCareersRepository implements CareersRepository {
  private readonly database: DatabaseService;

  constructor(database: DatabaseService) {
    this.database = database;
  }

  async findSiteByKey(siteKey: string): Promise<CareerSiteScope | null> {
    const site = await this.database.collection('sites').findOne(
      { key: siteKey, status: 'active' },
      { projection: { _id: 0, id: 1, tenantId: 1, key: 1 } }
    );
    return site
      ? { tenantId: String(site.tenantId), siteId: String(site.id), siteKey: String(site.key) }
      : null;
  }

  async findPublishedOpening(scope: CareerSiteScope, slug: string): Promise<CareerOpening | null> {
    const opening = await this.database.collection('careerOpenings').findOne(
      { tenantId: scope.tenantId, siteId: scope.siteId, slug, status: 'published' },
      { projection: { _id: 0, id: 1, slug: 1, title: 1, acceptingApplications: 1, closingDate: 1 } }
    );
    return opening ? {
      id: String(opening.id),
      slug: String(opening.slug),
      title: String(opening.title),
      acceptingApplications: opening.acceptingApplications !== false,
      closingDate: typeof opening.closingDate === 'string' ? opening.closingDate : undefined
    } : null;
  }

  async findByIdempotencyKey(
    scope: CareerSiteScope,
    key?: string
  ): Promise<CareerApplication | null> {
    if (!key) return null;
    const application = await this.database.collection('jobApplications').findOne(
      { tenantId: scope.tenantId, siteId: scope.siteId, idempotencyKey: key },
      { projection: { _id: 0, id: 1, status: 1, createdAt: 1 } }
    );
    return application ? asApplication(application) : null;
  }

  async createApplication(
    scope: CareerSiteScope,
    input: CareerApplicationInput,
    resume: ResumeUpload
  ): Promise<CareerApplication> {
    const id = randomUUID();
    const now = new Date();
    const bucket = this.database.gridFsBucket('careerResumes');
    const stream = bucket.openUploadStream(resume.originalName, {
      contentType: resume.mimeType,
      metadata: { tenantId: scope.tenantId, siteId: scope.siteId, applicationId: id }
    });
    await new Promise<void>((resolve, reject) => {
      Readable.from(resume.buffer).pipe(stream).once('error', reject).once('finish', resolve);
    });
    const record = {
      id,
      tenantId: scope.tenantId,
      siteId: scope.siteId,
      ...(input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : {}),
      ...(input.openingId ? { openingId: input.openingId } : {}),
      ...(input.openingSlug ? { openingSlug: input.openingSlug } : {}),
      ...(input.openingTitle ? { openingTitle: input.openingTitle } : {}),
      contact: { name: input.name, email: input.email, phone: input.phone ?? '' },
      experience: input.experience ?? '',
      profileUrl: input.profileUrl ?? '',
      coverLetter: input.coverLetter,
      source: input.source ?? 'website',
      resume: {
        fileId: stream.id,
        fileName: resume.originalName,
        mimeType: resume.mimeType,
        size: resume.size
      },
      status: 'new' as const,
      createdAt: now,
      updatedAt: now
    };
    await this.database.collection('jobApplications').insertOne(record);
    return asApplication(record);
  }

  list(scope: CareerSiteScope) {
    return this.database.collection('jobApplications')
      .find({ tenantId: scope.tenantId, siteId: scope.siteId }, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();
  }

  async updateStatus(scope: CareerSiteScope, id: string, status: string) {
    const application = await this.database.collection('jobApplications').findOneAndUpdate(
      { id, tenantId: scope.tenantId, siteId: scope.siteId },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: 'after', projection: { _id: 0 } }
    );
    if (!application) throw new NotFoundException('Application not found');
    return application;
  }

  async openResume(scope: CareerSiteScope, id: string) {
    const application = await this.database.collection('jobApplications').findOne(
      { id, tenantId: scope.tenantId, siteId: scope.siteId },
      { projection: { resume: 1 } }
    );
    const resume = application?.resume as { fileId?: ObjectId; fileName?: string; mimeType?: string } | undefined;
    if (!resume?.fileId) throw new NotFoundException('Resume not found');
    return {
      fileName: resume.fileName || 'resume',
      mimeType: resume.mimeType || 'application/octet-stream',
      stream: this.database.gridFsBucket('careerResumes').openDownloadStream(new ObjectId(resume.fileId))
    };
  }
}

function asApplication(document: Record<string, unknown>): CareerApplication {
  const createdAt = document.createdAt;
  return {
    id: String(document.id),
    status: document.status as CareerApplication['status'],
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : String(createdAt)
  };
}
