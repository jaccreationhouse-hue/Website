'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  authenticatedCmsFetch,
  CmsAuthenticationError,
  cmsSiteId,
  redirectToCmsLogin
} from '../../lib/api';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FieldChange {
  field: string;
  before: unknown;
  after: unknown;
}

interface AuditEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  entityTitle: string;
  actor: { userId: string; name: string; email: string };
  changes: FieldChange[];
  summary: string;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const entityLabels: Record<string, string> = {
  service: 'Service',
  page: 'Page',
  highlights: 'Highlight',
  teamMembers: 'Team Member',
  portfolioProjects: 'Portfolio',
  programs: 'Program',
  careerOpenings: 'Career',
  contacts: 'Contact'
};

const entityFilterOptions = [
  { value: '', label: 'All types' },
  { value: 'service', label: 'Services' },
  { value: 'page', label: 'Pages' },
  { value: 'highlights', label: 'Highlights' },
  { value: 'teamMembers', label: 'Team Members' },
  { value: 'portfolioProjects', label: 'Portfolio' },
  { value: 'programs', label: 'Programs' },
  { value: 'careerOpenings', label: 'Careers' },
  { value: 'contacts', label: 'Contacts' }
];

function relativeTime(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function displayValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.join(', ') || '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ActivityPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [message, setMessage] = useState('Loading activity log...');
  const [expandedId, setExpandedId] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [search, setSearch] = useState('');

  const PAGE_SIZE = 30;

  const fetchEntries = useCallback(
    async (before?: string) => {
      const params = new URLSearchParams();
      params.set('limit', String(PAGE_SIZE));
      if (entityFilter) params.set('entityType', entityFilter);
      if (before) params.set('before', before);

      const data = await authenticatedCmsFetch<AuditEntry[]>(
        `/v1/admin/sites/${cmsSiteId}/audit-logs?${params.toString()}`
      );
      return data;
    },
    [entityFilter]
  );

  // Initial load + reload when filter changes
  useEffect(() => {
    setLoading(true);
    setEntries([]);
    setHasMore(true);
    setMessage('Loading activity log...');

    fetchEntries()
      .then((data) => {
        setEntries(data);
        setHasMore(data.length >= PAGE_SIZE);
        setMessage(data.length ? '' : 'No activity recorded yet.');
      })
      .catch((error: Error) => {
        if (error instanceof CmsAuthenticationError) return redirectToCmsLogin();
        setMessage(`Could not load activity. ${error.message}`);
      })
      .finally(() => setLoading(false));
  }, [fetchEntries]);

  async function loadMore() {
    if (!entries.length || loadingMore) return;
    setLoadingMore(true);
    try {
      const last = entries[entries.length - 1];
      const data = await fetchEntries(last.createdAt);
      setEntries((prev) => [...prev, ...data]);
      setHasMore(data.length >= PAGE_SIZE);
    } catch (error) {
      if (error instanceof CmsAuthenticationError) return redirectToCmsLogin();
    } finally {
      setLoadingMore(false);
    }
  }

  // Client-side search filtering
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return entries;
    return entries.filter(
      (e) =>
        e.entityTitle.toLowerCase().includes(term) ||
        e.actor.name.toLowerCase().includes(term) ||
        e.summary.toLowerCase().includes(term) ||
        e.entityType.toLowerCase().includes(term)
    );
  }, [entries, search]);

  // Group entries by date
  const grouped = useMemo(() => {
    const groups: { label: string; items: AuditEntry[] }[] = [];
    let currentLabel = '';
    for (const entry of filtered) {
      const date = new Date(entry.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let label: string;
      if (date.toDateString() === today.toDateString()) label = 'Today';
      else if (date.toDateString() === yesterday.toDateString()) label = 'Yesterday';
      else label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

      if (label !== currentLabel) {
        groups.push({ label, items: [] });
        currentLabel = label;
      }
      groups[groups.length - 1].items.push(entry);
    }
    return groups;
  }, [filtered]);

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span>Content governance</span>
          <h1>Activity Log</h1>
          <p>Structured history of every content change — who edited what, when, and exactly which fields were modified.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="activity-filters">
        <label>
          <span className="sr-only">Search activity</span>
          <input
            aria-label="Search activity"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, or type..."
            type="search"
            value={search}
          />
        </label>
        <label>
          <span className="sr-only">Filter by type</span>
          <select
            aria-label="Filter by content type"
            onChange={(e) => setEntityFilter(e.target.value)}
            value={entityFilter}
          >
            {entityFilterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Timeline */}
      <div className="activity-timeline">
        {loading && <p className="empty" role="status">Loading activity log...</p>}

        {!loading && grouped.map((group) => (
          <div className="activity-group" key={group.label}>
            <div className="activity-date-label">{group.label}</div>
            {group.items.map((entry) => (
              <button
                className={`activity-card ${expandedId === entry.id ? 'expanded' : ''}`}
                key={entry.id}
                onClick={() => setExpandedId(expandedId === entry.id ? '' : entry.id)}
                type="button"
              >
                {/* Card header */}
                <div className="activity-card-header">
                  <span className="activity-avatar" aria-hidden="true">
                    {initials(entry.actor.name)}
                  </span>
                  <div className="activity-card-info">
                    <div className="activity-card-title">
                      <strong>{entry.actor.name}</strong>
                      <span className={`activity-action-badge ${entry.action === 'content.created' ? 'created' : 'updated'}`}>
                        {entry.action === 'content.created' ? 'Created' : 'Updated'}
                      </span>
                      <span className="activity-entity-badge">
                        {entityLabels[entry.entityType] || entry.entityType}
                      </span>
                    </div>
                    <p className="activity-card-summary">
                      <strong>{entry.entityTitle}</strong>
                      {entry.changes.length > 0 && <> — {entry.summary}</>}
                    </p>
                  </div>
                  <div className="activity-card-meta">
                    <time>{relativeTime(entry.createdAt)}</time>
                    <span className="activity-expand-icon" aria-hidden="true">
                      {expandedId === entry.id ? '▾' : '▸'}
                    </span>
                  </div>
                </div>

                {/* Expanded diff view */}
                {expandedId === entry.id && entry.changes.length > 0 && (
                  <div className="activity-diff" onClick={(e) => e.stopPropagation()}>
                    <div className="activity-diff-header">
                      <span>Field</span>
                      <span>Before</span>
                      <span>After</span>
                    </div>
                    {entry.changes.map((change) => (
                      <div className="activity-diff-row" key={change.field}>
                        <span className="activity-diff-field">{change.field}</span>
                        <span className="activity-diff-before">{displayValue(change.before)}</span>
                        <span className="activity-diff-after">{displayValue(change.after)}</span>
                      </div>
                    ))}
                    <div className="activity-diff-meta">
                      <span>{entry.actor.email}</span>
                      <span>{new Date(entry.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {expandedId === entry.id && entry.changes.length === 0 && (
                  <div className="activity-diff" onClick={(e) => e.stopPropagation()}>
                    <p className="empty">New entry created — no prior version to compare.</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        ))}

        {!loading && !filtered.length && !message && (
          <p className="empty" role="status">No activity matches your filters.</p>
        )}

        {message && !loading && <p className="empty" role="status">{message}</p>}

        {hasMore && !loading && filtered.length > 0 && (
          <div className="activity-load-more">
            <button
              className="button-secondary"
              disabled={loadingMore}
              onClick={loadMore}
              type="button"
            >
              {loadingMore ? 'Loading...' : 'Load more activity'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
