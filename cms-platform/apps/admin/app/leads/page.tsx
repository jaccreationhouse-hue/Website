'use client';

import { useEffect, useState } from 'react';
import { authenticatedCmsFetch, CmsAuthenticationError, cmsSiteId, redirectToCmsLogin } from '../../lib/api';

interface Lead {
  id: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  contact: { name?: string; email?: string };
  createdAt: string;
}

const statuses: Lead['status'][] = ['new', 'contacted', 'qualified', 'closed'];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [message, setMessage] = useState('Loading lead inbox...');
  const [updatingId, setUpdatingId] = useState('');

  useEffect(() => {
    authenticatedCmsFetch<Lead[]>(`/v1/admin/sites/${cmsSiteId}/leads`)
      .then((data) => {
        setLeads(data);
        setMessage(data.length ? '' : 'No leads yet.');
      })
      .catch((error: Error) => {
        if (error instanceof CmsAuthenticationError) return redirectToCmsLogin();
        setMessage(`Could not load leads. ${error.message}`);
      });
  }, []);

  async function updateStatus(leadId: string, status: Lead['status']) {
    setUpdatingId(leadId);
    setMessage('Updating lead...');
    try {
      const updated = await authenticatedCmsFetch<Pick<Lead, 'id' | 'status'>>(
        `/v1/admin/sites/${cmsSiteId}/leads/${leadId}`,
        { method: 'PATCH', body: JSON.stringify({ status }) }
      );
      setLeads((current) => current.map((lead) =>
        lead.id === updated.id ? { ...lead, status: updated.status } : lead
      ));
      setMessage('Lead status updated.');
    } catch (error) {
      if (error instanceof CmsAuthenticationError) return redirectToCmsLogin();
      setMessage(error instanceof Error ? error.message : 'Could not update lead.');
    } finally {
      setUpdatingId('');
    }
  }

  return (
    <section className="page">
      <div className="page-heading"><div><span>Lead management</span><h1>Inbox</h1><p>Durable submissions with clear ownership and status progression.</p></div></div>
      <div className="panel table-shell">
        <table>
          <thead><tr><th>Contact</th><th>Email</th><th>Status</th><th>Received</th></tr></thead>
          <tbody>{leads.map((lead) => (
            <tr key={lead.id}>
              <td><strong>{lead.contact.name || 'Unknown'}</strong></td>
              <td>{lead.contact.email}</td>
              <td>
                <select
                  aria-label={`Status for ${lead.contact.name || lead.contact.email || 'lead'}`}
                  className="status-select"
                  disabled={updatingId === lead.id}
                  onChange={(event) => void updateStatus(lead.id, event.target.value as Lead['status'])}
                  value={lead.status}
                >
                  {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </td>
              <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}</tbody>
        </table>
        {message && <p className="empty" role="status">{message}</p>}
      </div>
    </section>
  );
}
