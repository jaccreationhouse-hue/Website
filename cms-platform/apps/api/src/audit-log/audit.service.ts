import { randomUUID } from 'node:crypto';
import type { DatabaseService } from '../database/database.service.js';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface Actor {
  userId: string;
  name: string;
  email: string;
}

export interface FieldChange {
  field: string;
  before: unknown;
  after: unknown;
}

export interface AuditLogEntry {
  id: string;
  tenantId: string;
  siteId: string;
  action: 'content.created' | 'content.updated';
  entityType: string;
  entityId: string;
  entityTitle: string;
  actor: Actor;
  changes: FieldChange[];
  summary: string;
  createdAt: Date;
}

export interface AuditLogFilters {
  entityType?: string;
  actorId?: string;
  limit?: number;
  before?: Date;
}

/* ------------------------------------------------------------------ */
/*  Diff logic                                                         */
/* ------------------------------------------------------------------ */

const IGNORED_KEYS = new Set([
  '_id', 'createdAt', 'updatedAt', 'publishedAt', 'tenantId', 'siteId'
]);

function serialize(value: unknown): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function computeChanges(
  before: Record<string, unknown> | null,
  after: Record<string, unknown>
): FieldChange[] {
  if (!before) return [];

  const changes: FieldChange[] = [];
  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

  for (const key of allKeys) {
    if (IGNORED_KEYS.has(key)) continue;
    const oldVal = before[key];
    const newVal = after[key];
    if (serialize(oldVal) !== serialize(newVal)) {
      changes.push({ field: key, before: oldVal ?? null, after: newVal ?? null });
    }
  }
  return changes;
}

function buildSummary(action: string, changes: FieldChange[]): string {
  if (action === 'content.created') return 'Created new entry';
  if (changes.length === 0) return 'Saved without field changes';
  const fields = changes.map((c) => c.field);
  if (fields.length <= 3) return `Updated ${fields.join(', ')}`;
  return `Updated ${fields.slice(0, 3).join(', ')} and ${fields.length - 3} more`;
}

/* ------------------------------------------------------------------ */
/*  Service                                                            */
/* ------------------------------------------------------------------ */

export class AuditService {
  private readonly database: DatabaseService;

  constructor(database: DatabaseService) {
    this.database = database;
  }

  /**
   * Record a content change in the audit log.
   * `before` is null when a new entity is created.
   */
  async recordChange(
    scope: { tenantId: string; siteId: string },
    actor: Actor,
    entityType: string,
    entityId: string,
    entityTitle: string,
    before: Record<string, unknown> | null,
    after: Record<string, unknown>
  ): Promise<void> {
    const action = before ? 'content.updated' : 'content.created';
    const changes = before ? computeChanges(before, after) : [];

    // Skip logging if an update had zero meaningful field changes
    if (action === 'content.updated' && changes.length === 0) return;

    const entry: AuditLogEntry = {
      id: randomUUID(),
      tenantId: scope.tenantId,
      siteId: scope.siteId,
      action,
      entityType,
      entityId,
      entityTitle,
      actor,
      changes,
      summary: buildSummary(action, changes),
      createdAt: new Date()
    };

    await this.database.collection('auditLogs').insertOne(entry);
  }

  /**
   * Resolve a user ID to actor info (name + email).
   */
  async resolveActor(userId: string): Promise<Actor> {
    const user = await this.database.collection('users').findOne(
      { id: userId },
      { projection: { _id: 0, id: 1, name: 1, email: 1 } }
    );
    return {
      userId,
      name: (user?.name as string) || 'Unknown user',
      email: (user?.email as string) || ''
    };
  }

  /**
   * List audit log entries with optional filters and cursor-based pagination.
   */
  async list(
    scope: { tenantId: string; siteId: string },
    filters: AuditLogFilters = {}
  ): Promise<AuditLogEntry[]> {
    const query: Record<string, unknown> = {
      tenantId: scope.tenantId,
      siteId: scope.siteId
    };
    if (filters.entityType) query.entityType = filters.entityType;
    if (filters.actorId) query['actor.userId'] = filters.actorId;
    if (filters.before) query.createdAt = { $lt: filters.before };

    const limit = Math.min(filters.limit ?? 50, 100);

    return this.database
      .collection<AuditLogEntry & Record<string, unknown>>('auditLogs')
      .find(query, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }
}
