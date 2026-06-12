import { BadRequestException, NotFoundException } from '@nestjs/common';

export interface CareerSiteScope {
  tenantId: string;
  siteId: string;
  siteKey: string;
}

export interface CareerOpening {
  id: string;
  slug: string;
  title: string;
  acceptingApplications?: boolean;
  closingDate?: string;
}

export interface ResumeUpload {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface CareerApplicationInput {
  openingSlug?: string;
  openingId?: string;
  openingTitle?: string;
  idempotencyKey?: string;
  name: string;
  email: string;
  phone?: string;
  experience?: string;
  profileUrl?: string;
  coverLetter: string;
  source?: string;
  website?: string;
}

export interface CareerApplication {
  id: string;
  status: 'new' | 'reviewing' | 'shortlisted' | 'interview' | 'hired' | 'rejected';
  createdAt: string;
}

export interface CareersRepository {
  findSiteByKey(siteKey: string): Promise<CareerSiteScope | null>;
  findPublishedOpening(scope: CareerSiteScope, slug: string): Promise<CareerOpening | null>;
  findByIdempotencyKey(scope: CareerSiteScope, key?: string): Promise<CareerApplication | null>;
  createApplication(
    scope: CareerSiteScope,
    input: CareerApplicationInput,
    resume: ResumeUpload
  ): Promise<CareerApplication>;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RESUME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);
export const MAX_RESUME_SIZE = 5 * 1024 * 1024;

export class CareersService {
  private readonly repository: CareersRepository;

  constructor(repository: CareersRepository) {
    this.repository = repository;
  }

  async submit(
    siteKey: string,
    input: CareerApplicationInput,
    resume: ResumeUpload
  ): Promise<CareerApplication> {
    this.validate(siteKey, input, resume);
    const scope = await this.repository.findSiteByKey(siteKey);
    if (!scope) throw new NotFoundException('Site not found');

    let opening: CareerOpening | null = null;
    if (input.openingSlug) {
      opening = await this.repository.findPublishedOpening(scope, input.openingSlug);
      if (!opening || !this.open(opening)) {
        throw new BadRequestException('This opening is not accepting applications');
      }
    }

    const existing = await this.repository.findByIdempotencyKey(scope, input.idempotencyKey);
    if (existing) return existing;

    return this.repository.createApplication(
      scope,
      {
        ...input,
        openingId: opening?.id,
        openingTitle: opening?.title,
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        phone: input.phone?.trim() || undefined,
        experience: input.experience?.trim() || undefined,
        profileUrl: input.profileUrl?.trim() || undefined,
        coverLetter: input.coverLetter.trim(),
        source: input.source?.trim() || 'website'
      },
      resume
    );
  }

  private validate(siteKey: string, input: CareerApplicationInput, resume?: ResumeUpload): void {
    if (!SLUG.test(siteKey)) throw new BadRequestException('Invalid site key');
    if (input.openingSlug && !SLUG.test(input.openingSlug)) throw new BadRequestException('Invalid opening');
    if (input.website?.trim()) throw new BadRequestException('Submission rejected');
    if (!input.name?.trim()) throw new BadRequestException('Name is required');
    if (!EMAIL.test(input.email?.trim() ?? '')) throw new BadRequestException('A valid email is required');
    if (!input.coverLetter?.trim()) throw new BadRequestException('Cover letter is required');
    if (!resume?.buffer?.length) throw new BadRequestException('Resume is required');
    if (!RESUME_TYPES.has(resume.mimeType)) throw new BadRequestException('Resume must be PDF, DOC, or DOCX');
    if (resume.size > MAX_RESUME_SIZE) throw new BadRequestException('Resume must be 5 MB or smaller');
  }

  private open(opening: CareerOpening): boolean {
    if (opening.acceptingApplications === false) return false;
    if (!opening.closingDate) return true;
    const closing = new Date(`${opening.closingDate}T23:59:59.999Z`);
    return !Number.isNaN(closing.getTime()) && closing >= new Date();
  }
}
