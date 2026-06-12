'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  authenticatedCmsFetch,
  CmsAuthenticationError,
  cmsSiteId,
  redirectToCmsLogin
} from '../../../lib/api';
import { websiteCollection, type CollectionField } from '../../../lib/collections';

interface CollectionItem {
  id: string;
  slug: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  sortOrder?: number;
  [key: string]: unknown;
}

const reserved = new Set([
  '_id', 'id', 'tenantId', 'siteId', 'slug', 'title', 'status', 'sortOrder',
  'createdAt', 'updatedAt', 'publishedAt'
]);

function editableData(item: CollectionItem): Record<string, unknown> {
  return Object.fromEntries(Object.entries(item).filter(([key]) => !reserved.has(key)));
}

function generateSlug(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function snapshot(slug: string, title: string, status: string, sortOrder: number, data: Record<string, unknown>) {
  return JSON.stringify({ slug, title, status, sortOrder, data });
}

export default function CollectionEditorPage() {
  const params = useParams<{ collectionKey: string }>();
  const collectionKey = params.collectionKey;
  const definition = websiteCollection(collectionKey);
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<CollectionItem['status']>('draft');
  const [sortOrder, setSortOrder] = useState(0);
  const [data, setData] = useState<Record<string, unknown>>({});
  const [advancedJson, setAdvancedJson] = useState('{}');
  const [advancedError, setAdvancedError] = useState('');
  const [message, setMessage] = useState('Loading records...');
  const [query, setQuery] = useState('');
  const [baseline, setBaseline] = useState('');
  const [saving, setSaving] = useState(false);

  const selected = useMemo(
    () => items.find((item) => item.slug === selectedSlug),
    [items, selectedSlug]
  );
  const filteredItems = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term
      ? items.filter((item) => `${item.title} ${item.slug} ${item.status}`.toLowerCase().includes(term))
      : items;
  }, [items, query]);
  const currentSnapshot = snapshot(slug, title, status, sortOrder, data);
  const dirty = Boolean(baseline) && baseline !== currentSnapshot;

  useEffect(() => {
    authenticatedCmsFetch<CollectionItem[]>(
      `/v1/admin/sites/${cmsSiteId}/collections/${collectionKey}`
    )
      .then((records) => {
        setItems(records);
        setMessage(records.length ? '' : 'No records yet. Create the first one.');
        if (records[0]) setSelectedSlug(records[0].slug);
      })
      .catch((error: Error) => {
        if (error instanceof CmsAuthenticationError) return redirectToCmsLogin();
        setMessage(`Could not load records. ${error.message}`);
      });
  }, [collectionKey]);

  useEffect(() => {
    if (!selected) return;
    const nextData = editableData(selected);
    setSlug(selected.slug);
    setTitle(selected.title);
    setStatus(selected.status);
    setSortOrder(selected.sortOrder ?? 0);
    setData(nextData);
    setAdvancedJson(JSON.stringify(nextData, null, 2));
    setAdvancedError('');
    setBaseline(snapshot(selected.slug, selected.title, selected.status, selected.sortOrder ?? 0, nextData));
  }, [selected]);

  useEffect(() => {
    function warnBeforeUnload(event: BeforeUnloadEvent) {
      if (!dirty) return;
      event.preventDefault();
    }
    window.addEventListener('beforeunload', warnBeforeUnload);
    return () => window.removeEventListener('beforeunload', warnBeforeUnload);
  }, [dirty]);

  function canLeaveRecord(): boolean {
    return !dirty || window.confirm('Discard your unsaved changes?');
  }

  function selectRecord(nextSlug: string) {
    if (nextSlug === selectedSlug || !canLeaveRecord()) return;
    setSelectedSlug(nextSlug);
  }

  function createNew() {
    if (!canLeaveRecord()) return;
    const nextData = {};
    setSelectedSlug('');
    setSlug('');
    setTitle('');
    setStatus('draft');
    setSortOrder(items.length);
    setData(nextData);
    setAdvancedJson('{}');
    setAdvancedError('');
    setBaseline(snapshot('', '', 'draft', items.length, nextData));
    setMessage('New record ready. Complete the fields and save when you are happy.');
  }

  function duplicateRecord() {
    if (!selected || !canLeaveRecord()) return;
    const baseSlug = `${selected.slug}-copy`;
    let nextSlug = baseSlug;
    let suffix = 2;
    while (items.some((item) => item.slug === nextSlug)) {
      nextSlug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
    const nextData = editableData(selected);
    setSelectedSlug('');
    setSlug(nextSlug);
    setTitle(`${selected.title} Copy`);
    setStatus('draft');
    setSortOrder(items.length);
    setData(nextData);
    setAdvancedJson(JSON.stringify(nextData, null, 2));
    setAdvancedError('');
    setBaseline('duplicate-record');
    setMessage('Duplicate ready as a draft. Review it before saving.');
  }

  function updateField(field: CollectionField, value: unknown) {
    const nextData = { ...data, [field.key]: value };
    setData(nextData);
    setAdvancedJson(JSON.stringify(nextData, null, 2));
    setAdvancedError('');
  }

  function updateAdvanced(value: string) {
    setAdvancedJson(value);
    try {
      const parsed = JSON.parse(value) as unknown;
      if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
        throw new Error('Advanced JSON must be an object.');
      }
      setData(parsed as Record<string, unknown>);
      setAdvancedError('');
    } catch (error) {
      setAdvancedError(error instanceof Error ? error.message : 'Invalid JSON');
    }
  }

  function updateTitle(nextTitle: string) {
    if (!selectedSlug && (!slug || slug === generateSlug(title))) setSlug(generateSlug(nextTitle));
    setTitle(nextTitle);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (advancedError) {
      setMessage('Fix the advanced JSON before saving.');
      return;
    }
    setSaving(true);
    setMessage('Saving changes...');
    try {
      const saved = await authenticatedCmsFetch<CollectionItem>(
        `/v1/admin/sites/${cmsSiteId}/collections/${collectionKey}/${slug}`,
        {
          method: 'PUT',
          body: JSON.stringify({ title, status, sortOrder, data })
        }
      );
      const savedData = editableData(saved);
      setItems((current) => [...current.filter((item) => item.slug !== saved.slug), saved]
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)));
      setSelectedSlug(saved.slug);
      setData(savedData);
      setAdvancedJson(JSON.stringify(savedData, null, 2));
      setBaseline(snapshot(saved.slug, saved.title, saved.status, saved.sortOrder ?? 0, savedData));
      setMessage('Saved successfully. Public visibility follows the selected status.');
    } catch (error) {
      if (error instanceof CmsAuthenticationError) return redirectToCmsLogin();
      setMessage(error instanceof Error ? error.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (!definition) {
    return <section className="page"><p className="empty">Unknown website section.</p></section>;
  }

  return (
    <section className="page editor-page">
      <div className="page-heading">
        <div>
          <span>Website section</span>
          <h1>{definition.label}</h1>
          <p>{definition.description}</p>
        </div>
        <button className="button" type="button" onClick={createNew}>New record</button>
      </div>
      <div className="editor-layout">
        <aside className="panel record-list">
          <div className="record-list-header">
            <div><strong>{items.length} records</strong><span>{filteredItems.length} shown</span></div>
            <label>
              <span className="sr-only">Search records</span>
              <input
                aria-label="Search records"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search records..."
                type="search"
                value={query}
              />
            </label>
          </div>
          <div className="record-list-items">
            {filteredItems.map((item) => (
              <button
                className={selectedSlug === item.slug ? 'active' : ''}
                key={item.id}
                onClick={() => selectRecord(item.slug)}
                type="button"
              >
                <strong>{item.title}</strong>
                <span>{item.status} · {item.slug}</span>
              </button>
            ))}
            {!filteredItems.length && <p className="empty">No records match your search.</p>}
          </div>
        </aside>
        <form className="panel form editor-form" onSubmit={save}>
          <div className="editor-toolbar">
            <div>
              <span className={`editor-state ${dirty ? 'dirty' : ''}`}>{dirty ? 'Unsaved changes' : 'All changes saved'}</span>
              <strong>{selectedSlug ? 'Edit record' : 'Create record'}</strong>
            </div>
            <div className="editor-toolbar-actions">
              {selected && <button className="button-secondary" onClick={duplicateRecord} type="button">Duplicate record</button>}
              <button className="button" disabled={saving || Boolean(advancedError) || !dirty} type="submit">
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>

          <div className="editor-section">
            <div className="editor-section-heading"><span>Basic details</span><p>Used to identify, order, and publish this record.</p></div>
            <div className="form-row">
              <label>Title<input required value={title} onChange={(event) => updateTitle(event.target.value)} /></label>
              <label>Slug<input pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required value={slug} onChange={(event) => setSlug(event.target.value)} /></label>
            </div>
            <div className="form-row">
              <label>Status
                <select value={status} onChange={(event) => setStatus(event.target.value as CollectionItem['status'])}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
              <label>Sort order<input min="0" type="number" value={sortOrder} onChange={(event) => setSortOrder(Number(event.target.value))} /></label>
            </div>
          </div>

          <div className="editor-section">
            <div className="editor-section-heading"><span>Section content</span><p>Edit the fields visitors will see on the website.</p></div>
            <div className="friendly-fields">
              {definition.fields.map((field) => (
                <FriendlyField field={field} key={field.key} onChange={updateField} value={data[field.key]} />
              ))}
            </div>
          </div>

          <details className="advanced-editor">
            <summary>Advanced JSON <span>For custom or uncommon fields</span></summary>
            <label>
              Structured fields
              <textarea rows={12} value={advancedJson} onChange={(event) => updateAdvanced(event.target.value)} />
            </label>
            {advancedError && <p className="field-error" role="alert">{advancedError}</p>}
          </details>
          <p role="status">{message}</p>
        </form>
      </div>
    </section>
  );
}

function FriendlyField({
  field,
  onChange,
  value
}: {
  field: CollectionField;
  onChange: (field: CollectionField, value: unknown) => void;
  value: unknown;
}) {
  if (field.type === 'checkbox') {
    return (
      <label className="checkbox-field">
        <input checked={Boolean(value)} onChange={(event) => onChange(field, event.target.checked)} type="checkbox" />
        <span><strong>{field.label}</strong>{field.help && <small>{field.help}</small>}</span>
      </label>
    );
  }

  const stringValue = typeof value === 'string' ? value : '';
  const listValue = Array.isArray(value) ? value.filter((item) => typeof item === 'string').join('\n') : stringValue;
  return (
    <label>
      {field.label}
      {field.type === 'textarea' || field.type === 'list' ? (
        <textarea
          rows={field.type === 'list' ? 6 : 4}
          placeholder={field.placeholder}
          value={field.type === 'list' ? listValue : stringValue}
          onChange={(event) => onChange(
            field,
            field.type === 'list'
              ? event.target.value.split('\n').map((item) => item.trim()).filter(Boolean)
              : event.target.value
          )}
        />
      ) : field.type === 'select' ? (
        <select value={stringValue} onChange={(event) => onChange(field, event.target.value)}>
          <option value="">Select an option</option>
          {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : (
        <input type={field.type} placeholder={field.placeholder} value={stringValue} onChange={(event) => onChange(field, event.target.value)} />
      )}
      {field.help && <small>{field.help}</small>}
    </label>
  );
}
