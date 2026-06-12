'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  authenticatedCmsDownload,
  authenticatedCmsFetch,
  CmsAuthenticationError,
  cmsSiteId,
  redirectToCmsLogin
} from '../../lib/api';

type ApplicationStatus = 'new' | 'reviewing' | 'shortlisted' | 'interview' | 'hired' | 'rejected';

interface Application {
  id: string;
  openingSlug?: string;
  openingTitle?: string;
  contact: { name: string; email: string; phone?: string };
  experience?: string;
  profileUrl?: string;
  coverLetter: string;
  resume: { fileName: string; mimeType: string; size: number };
  status: ApplicationStatus;
  createdAt: string;
}

const statuses: ApplicationStatus[] = ['new', 'reviewing', 'shortlisted', 'interview', 'hired', 'rejected'];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openingFilter, setOpeningFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('Loading applications...');
  const selected = applications.find((application) => application.id === selectedId);
  const openings = useMemo(
    () => [...new Set(applications.map((application) => application.openingTitle || 'Talent Network'))].sort(),
    [applications]
  );
  const filtered = useMemo(() => applications.filter((application) => {
    const opening = application.openingTitle || 'Talent Network';
    const matchesQuery = `${application.contact.name} ${application.contact.email} ${opening}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery
      && (statusFilter === 'all' || application.status === statusFilter)
      && (openingFilter === 'all' || opening === openingFilter);
  }), [applications, openingFilter, query, statusFilter]);

  useEffect(() => {
    authenticatedCmsFetch<Application[]>(`/v1/admin/sites/${cmsSiteId}/applications`)
      .then((records) => {
        setApplications(records);
        setSelectedId(records[0]?.id ?? '');
        setMessage(records.length ? '' : 'No applications yet.');
      })
      .catch(handleError);
  }, []);

  function handleError(error: unknown) {
    if (error instanceof CmsAuthenticationError) return redirectToCmsLogin();
    setMessage(error instanceof Error ? error.message : 'Something went wrong.');
  }

  async function updateStatus(application: Application, status: ApplicationStatus) {
    setMessage('Updating application...');
    try {
      const updated = await authenticatedCmsFetch<Application>(
        `/v1/admin/sites/${cmsSiteId}/applications/${application.id}`,
        { method: 'PATCH', body: JSON.stringify({ status }) }
      );
      setApplications((current) => current.map((item) => item.id === updated.id ? { ...item, status: updated.status } : item));
      setMessage('Application status updated.');
    } catch (error) {
      handleError(error);
    }
  }

  async function downloadResume(application: Application) {
    setMessage('Preparing resume download...');
    try {
      const { blob, fileName } = await authenticatedCmsDownload(
        `/v1/admin/sites/${cmsSiteId}/applications/${application.id}/resume`
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      setMessage('Resume downloaded.');
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <section className="page applications-page">
      <div className="page-heading">
        <div><span>Career management</span><h1>Applications</h1><p>Review candidates, download resumes, and progress every application.</p></div>
        <a className="button-secondary" href="/collections/careerOpenings">Manage openings</a>
      </div>

      <div className="application-filters panel">
        <label>Search<input type="search" placeholder="Name, email, or opening..." value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <label>Status<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All statuses</option>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
        <label>Opening<select value={openingFilter} onChange={(event) => setOpeningFilter(event.target.value)}><option value="all">All openings</option>{openings.map((opening) => <option key={opening} value={opening}>{opening}</option>)}</select></label>
      </div>

      <div className="applications-layout">
        <div className="panel application-list">
          <div className="record-list-header"><div><strong>{applications.length} applications</strong><span>{filtered.length} shown</span></div></div>
          {filtered.map((application) => (
            <button className={application.id === selectedId ? 'active' : ''} key={application.id} onClick={() => setSelectedId(application.id)} type="button">
              <span className={`application-status status-${application.status}`}>{application.status}</span>
              <strong>{application.contact.name}</strong>
              <small>{application.openingTitle || 'Talent Network'} / {new Date(application.createdAt).toLocaleDateString()}</small>
            </button>
          ))}
          {!filtered.length && <p className="empty">No applications match these filters.</p>}
        </div>

        <article className="panel application-detail">
          {selected ? (
            <>
              <div className="application-detail-heading">
                <div><span>{selected.openingTitle || 'Talent Network'}</span><h2>{selected.contact.name}</h2><p>{selected.contact.email}{selected.contact.phone ? ` / ${selected.contact.phone}` : ''}</p></div>
                <label>Status<select value={selected.status} onChange={(event) => void updateStatus(selected, event.target.value as ApplicationStatus)}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
              </div>
              <div className="application-facts">
                <div><span>Experience</span><strong>{selected.experience || 'Not provided'}</strong></div>
                <div><span>Applied</span><strong>{new Date(selected.createdAt).toLocaleString()}</strong></div>
                <div><span>Opening slug</span><strong>{selected.openingSlug || 'general-application'}</strong></div>
              </div>
              {selected.profileUrl && <a className="application-profile-link" href={selected.profileUrl} target="_blank" rel="noreferrer">Open candidate profile</a>}
              <section><span>Cover letter</span><p className="application-cover-letter">{selected.coverLetter}</p></section>
              <button className="button" type="button" onClick={() => void downloadResume(selected)}>Download resume / {selected.resume.fileName}</button>
            </>
          ) : <p className="empty">Select an application to review it.</p>}
        </article>
      </div>
      {message && <p role="status">{message}</p>}
    </section>
  );
}
