'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { authenticatedCmsFetch, CmsAuthenticationError, cmsSiteId, redirectToCmsLogin } from '../../lib/api';

interface Service {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  tagline?: string;
  description: string;
  capabilities: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  sortOrder?: number;
}

function generateSlug(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function serviceSnapshot(service: Omit<Service, 'id'>): string {
  return JSON.stringify(service);
}

const emptyService: Omit<Service, 'id'> = {
  title: '',
  slug: '',
  subtitle: '',
  tagline: '',
  description: '',
  capabilities: [],
  status: 'draft',
  featured: false,
  sortOrder: 0
};

export default function ContentPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [draft, setDraft] = useState<Omit<Service, 'id'>>(emptyService);
  const [capability, setCapability] = useState('');
  const [query, setQuery] = useState('');
  const [baseline, setBaseline] = useState('');
  const [message, setMessage] = useState('Loading protected catalogue...');
  const [saving, setSaving] = useState(false);

  const selected = useMemo(
    () => services.find((service) => service.slug === selectedSlug),
    [services, selectedSlug]
  );
  const filteredServices = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term
      ? services.filter((service) => `${service.title} ${service.slug} ${service.status}`.toLowerCase().includes(term))
      : services;
  }, [query, services]);
  const dirty = Boolean(baseline) && baseline !== serviceSnapshot(draft);

  useEffect(() => {
    authenticatedCmsFetch<Service[]>(`/v1/admin/sites/${cmsSiteId}/services`)
      .then((data) => {
        setServices(data);
        setMessage(data.length ? '' : 'No services found. Create the first one.');
        if (data[0]) setSelectedSlug(data[0].slug);
      })
      .catch((error: Error) => {
        if (error instanceof CmsAuthenticationError) return redirectToCmsLogin();
        setMessage(`Could not load services. ${error.message}`);
      });
  }, []);

  useEffect(() => {
    if (!selected) return;
    const next = {
      title: selected.title,
      slug: selected.slug,
      subtitle: selected.subtitle ?? '',
      tagline: selected.tagline ?? '',
      description: selected.description ?? '',
      capabilities: selected.capabilities ?? [],
      status: selected.status,
      featured: Boolean(selected.featured),
      sortOrder: selected.sortOrder ?? 0
    };
    setDraft(next);
    setBaseline(serviceSnapshot(next));
  }, [selected]);

  useEffect(() => {
    function warnBeforeUnload(event: BeforeUnloadEvent) {
      if (!dirty) return;
      event.preventDefault();
    }
    window.addEventListener('beforeunload', warnBeforeUnload);
    return () => window.removeEventListener('beforeunload', warnBeforeUnload);
  }, [dirty]);

  function canLeave(): boolean {
    return !dirty || window.confirm('Discard your unsaved service changes?');
  }

  function selectService(slug: string) {
    if (slug === selectedSlug || !canLeave()) return;
    setSelectedSlug(slug);
  }

  function createService() {
    if (!canLeave()) return;
    const next = { ...emptyService, sortOrder: services.length };
    setSelectedSlug('');
    setDraft(next);
    setBaseline(serviceSnapshot(next));
    setMessage('New service ready. Complete the catalogue details and save.');
  }

  function update<K extends keyof Omit<Service, 'id'>>(key: K, value: Omit<Service, 'id'>[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function updateTitle(title: string) {
    setDraft((current) => ({
      ...current,
      title,
      slug: selectedSlug ? current.slug : generateSlug(title)
    }));
  }

  function addCapability() {
    const value = capability.trim();
    if (!value || draft.capabilities.includes(value)) return;
    update('capabilities', [...draft.capabilities, value]);
    setCapability('');
  }

  function removeCapability(value: string) {
    update('capabilities', draft.capabilities.filter((item) => item !== value));
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage('Saving service...');
    try {
      const saved = await authenticatedCmsFetch<Service>(
        `/v1/admin/sites/${cmsSiteId}/services/${draft.slug}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            title: draft.title,
            subtitle: draft.subtitle,
            tagline: draft.tagline,
            description: draft.description,
            capabilities: draft.capabilities,
            featured: draft.featured,
            status: draft.status,
            sortOrder: draft.sortOrder
          })
        }
      );
      setServices((current) => [...current.filter((service) => service.slug !== saved.slug), saved]
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)));
      setSelectedSlug(saved.slug);
      const next = { ...draft, ...saved };
      delete (next as Partial<Service>).id;
      setDraft(next);
      setBaseline(serviceSnapshot(next));
      setMessage('Service saved. Published services appear in the public catalogue.');
    } catch (error) {
      if (error instanceof CmsAuthenticationError) return redirectToCmsLogin();
      setMessage(error instanceof Error ? error.message : 'Could not save service.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="page editor-page">
      <div className="page-heading">
        <div><span>Service catalogue</span><h1>Manage what your team offers.</h1><p>Create, order, feature, publish, or archive services delivered to the public website.</p></div>
        <button className="button" onClick={createService} type="button">New service</button>
      </div>
      <div className="editor-layout">
        <aside className="panel record-list">
          <div className="record-list-header">
            <div><strong>{services.length} services</strong><span>{filteredServices.length} shown</span></div>
            <label><span className="sr-only">Search services</span><input aria-label="Search services" onChange={(event) => setQuery(event.target.value)} placeholder="Search services..." type="search" value={query} /></label>
          </div>
          <div className="record-list-items">
            {filteredServices.map((service) => (
              <button className={selectedSlug === service.slug ? 'active' : ''} key={service.id} onClick={() => selectService(service.slug)} type="button">
                <strong>{service.title}</strong>
                <span>{service.status} · {service.featured ? 'featured' : service.slug}</span>
              </button>
            ))}
          </div>
        </aside>

        <form className="panel form editor-form" onSubmit={save}>
          <div className="editor-toolbar">
            <div><span className={`editor-state ${dirty ? 'dirty' : ''}`}>{dirty ? 'Unsaved changes' : 'All changes saved'}</span><strong>{selectedSlug ? 'Edit service' : 'Create service'}</strong></div>
            <div className="editor-toolbar-actions">
              <a className="button-secondary" href={`http://localhost:5173/services/${draft.slug}`} target="_blank" rel="noreferrer">Preview page</a>
              <button className="button" disabled={saving || !dirty || !draft.capabilities.length} type="submit">{saving ? 'Saving...' : 'Save service'}</button>
            </div>
          </div>

          <div className="editor-section">
            <div className="editor-section-heading"><span>Service identity</span><p>Controls the catalogue card, route, ordering, and publishing state.</p></div>
            <div className="form-row">
              <label>Service title<input required value={draft.title} onChange={(event) => updateTitle(event.target.value)} /></label>
              <label>Slug<input pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required value={draft.slug} onChange={(event) => update('slug', event.target.value)} /></label>
            </div>
            <div className="form-row">
              <label>Status<select value={draft.status} onChange={(event) => update('status', event.target.value as Service['status'])}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
              <label>Sort order<input min="0" type="number" value={draft.sortOrder} onChange={(event) => update('sortOrder', Number(event.target.value))} /></label>
            </div>
            <label className="checkbox-field"><input checked={draft.featured} onChange={(event) => update('featured', event.target.checked)} type="checkbox" /><span><strong>Featured service</strong><small>Give this service additional emphasis in the public catalogue.</small></span></label>
          </div>

          <div className="editor-section">
            <div className="editor-section-heading"><span>Catalogue copy</span><p>Clear service messaging shown to website visitors.</p></div>
            <label>Subtitle<input required value={draft.subtitle} onChange={(event) => update('subtitle', event.target.value)} /></label>
            <label>Tagline<input value={draft.tagline ?? ''} onChange={(event) => update('tagline', event.target.value)} /></label>
            <label>Description<textarea required rows={5} value={draft.description} onChange={(event) => update('description', event.target.value)} /></label>
          </div>

          <div className="editor-section">
            <div className="editor-section-heading"><span>Capabilities</span><p>Add concise capabilities shown as service-card bullet points.</p></div>
            <div className="capability-entry"><input onChange={(event) => setCapability(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addCapability(); } }} placeholder="Add a capability" value={capability} /><button className="button-secondary" onClick={addCapability} type="button">Add</button></div>
            <div className="capability-list">
              {draft.capabilities.map((item) => <button aria-label={`Remove ${item}`} key={item} onClick={() => removeCapability(item)} type="button">{item}<span aria-hidden="true">×</span></button>)}
              {!draft.capabilities.length && <p className="empty">Add at least one capability before saving.</p>}
            </div>
          </div>
          <p role="status">{message}</p>
        </form>
      </div>
    </section>
  );
}
