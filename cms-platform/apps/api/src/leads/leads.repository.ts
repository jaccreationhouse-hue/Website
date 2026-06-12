import { randomUUID } from 'node:crypto';
import { NotFoundException } from '@nestjs/common';
import type { DatabaseService } from '../database/database.service.js';
import type {
  FormDefinition,
  Lead,
  LeadSiteScope,
  LeadSubmission,
  LeadsRepository
} from './leads.service.js';

export class MongoLeadsRepository implements LeadsRepository {
  private readonly database: DatabaseService;

  constructor(database: DatabaseService) {
    this.database = database;
  }

  async findSiteByKey(siteKey: string): Promise<LeadSiteScope | null> {
    const site = await this.database.collection('sites').findOne(
      { key: siteKey, status: 'active' },
      { projection: { _id: 0, id: 1, tenantId: 1, key: 1 } }
    );
    return site
      ? { tenantId: String(site.tenantId), siteId: String(site.id), siteKey: String(site.key) }
      : null;
  }

  findForm(scope: LeadSiteScope, formKey: string): Promise<FormDefinition | null> {
    return this.database.collection<FormDefinition & Record<string, unknown>>('formDefinitions').findOne(
      { tenantId: scope.tenantId, siteId: scope.siteId, key: formKey, status: 'active' },
      { projection: { _id: 0, id: 1, fields: 1 } }
    );
  }

  async findByIdempotencyKey(
    scope: LeadSiteScope,
    formId: string,
    key?: string
  ): Promise<Lead | null> {
    if (!key) return null;
    const lead = await this.database.collection('leads').findOne(
      {
        tenantId: scope.tenantId,
        siteId: scope.siteId,
        formDefinitionId: formId,
        idempotencyKey: key
      },
      { projection: { _id: 0, id: 1, status: 1, createdAt: 1 } }
    );
    return lead ? asLead(lead) : null;
  }

  async createLead(scope: LeadSiteScope, formId: string, input: LeadSubmission): Promise<Lead> {
    const now = new Date();
    const lead = {
      id: randomUUID(),
      tenantId: scope.tenantId,
      siteId: scope.siteId,
      formDefinitionId: formId,
      ...(input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : {}),
      contact: input.contact,
      payload: input.fields,
      source: input.source ?? {},
      status: 'new' as const,
      createdAt: now,
      updatedAt: now
    };
    await this.database.collection('leads').insertOne(lead);
    return asLead(lead);
  }

  list(scope: LeadSiteScope) {
    return this.database.collection('leads')
      .find(
        { tenantId: scope.tenantId, siteId: scope.siteId },
        { projection: { _id: 0 } }
      )
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();
  }

  async updateStatus(scope: LeadSiteScope, leadId: string, status: string) {
    const lead = await this.database.collection('leads').findOneAndUpdate(
      { id: leadId, tenantId: scope.tenantId, siteId: scope.siteId },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: 'after', projection: { _id: 0, id: 1, status: 1, updatedAt: 1 } }
    );
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }
}

function asLead(document: Record<string, unknown>): Lead {
  const createdAt = document.createdAt;
  return {
    id: String(document.id),
    status: document.status as Lead['status'],
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : String(createdAt)
  };
}
