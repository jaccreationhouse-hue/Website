import { BadRequestException, NotFoundException } from '@nestjs/common';

export interface LeadSiteScope {
  tenantId: string;
  siteId: string;
  siteKey: string;
}

export interface FormField {
  key: string;
  required?: boolean;
}

export interface FormDefinition {
  id: string;
  fields: FormField[];
}

export interface Lead {
  id: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  createdAt: string;
}

export interface LeadSubmission {
  idempotencyKey?: string;
  contact: {
    name: string;
    email: string;
    phone?: string;
  };
  fields: Record<string, unknown>;
  source?: Record<string, unknown>;
  website?: string;
}

export interface LeadsRepository {
  findSiteByKey(siteKey: string): Promise<LeadSiteScope | null>;
  findForm(scope: LeadSiteScope, formKey: string): Promise<FormDefinition | null>;
  findByIdempotencyKey(
    scope: LeadSiteScope,
    formId: string,
    key?: string
  ): Promise<Lead | null>;
  createLead(scope: LeadSiteScope, formId: string, input: LeadSubmission): Promise<Lead>;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KEY = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class LeadsService {
  private readonly repository: LeadsRepository;

  constructor(repository: LeadsRepository) {
    this.repository = repository;
  }

  async submit(siteKey: string, formKey: string, input: LeadSubmission): Promise<Lead> {
    if (input.website?.trim()) throw new BadRequestException('Submission rejected');
    if (!KEY.test(siteKey) || !KEY.test(formKey)) throw new BadRequestException('Invalid site or form key');
    if (!input.contact?.name?.trim()) throw new BadRequestException('Contact name is required');
    if (!EMAIL.test(input.contact?.email?.trim() ?? '')) throw new BadRequestException('A valid email is required');

    const scope = await this.repository.findSiteByKey(siteKey);
    if (!scope) throw new NotFoundException('Site not found');
    const form = await this.repository.findForm(scope, formKey);
    if (!form) throw new NotFoundException('Form not found');

    for (const field of form.fields) {
      if (field.required && !this.present(input.fields[field.key])) {
        throw new BadRequestException(`${field.key} is required`);
      }
    }

    const existing = await this.repository.findByIdempotencyKey(
      scope,
      form.id,
      input.idempotencyKey
    );
    if (existing) return existing;

    return this.repository.createLead(scope, form.id, {
      ...input,
      contact: {
        ...input.contact,
        name: input.contact.name.trim(),
        email: input.contact.email.trim().toLowerCase()
      }
    });
  }

  private present(value: unknown): boolean {
    return typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined;
  }
}
