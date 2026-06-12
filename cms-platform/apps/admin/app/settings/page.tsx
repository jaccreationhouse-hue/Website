'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  authenticatedCmsFetch,
  CmsAuthenticationError,
  cmsSiteId,
  redirectToCmsLogin
} from '../../lib/api';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SettingRow {
  namespace: string;
  key: string;
  value: unknown;
  visibility?: string;
}

interface CmsUser {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  createdAt: string;
}

interface PlatformInfo {
  environment: string;
  nodeVersion: string;
  platform: string;
  mongoDb: string;
  cloudinaryCloud: string;
  accessTokenTtl: string;
  refreshTokenTtl: string;
  apiPort: string;
  uptime: string;
}

type TabKey = 'identity' | 'social' | 'seo' | 'users' | 'danger' | 'platform';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'identity', label: 'Site Identity', icon: '🏢' },
  { key: 'social', label: 'Social Links', icon: '🔗' },
  { key: 'seo', label: 'SEO Defaults', icon: '🔍' },
  { key: 'users', label: 'Team & Users', icon: '👥' },
  { key: 'danger', label: 'Danger Zone', icon: '⚠️' },
  { key: 'platform', label: 'Platform Info', icon: '⚙️' }
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function settingsToMap(rows: SettingRow[]): Record<string, Record<string, unknown>> {
  const map: Record<string, Record<string, unknown>> = {};
  for (const row of rows) {
    map[`${row.namespace}.${row.key}`] = row.value as Record<string, unknown>;
  }
  return map;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SettingsPage() {
  const [tab, setTab] = useState<TabKey>('identity');
  const [settings, setSettings] = useState<Record<string, Record<string, unknown>>>({});
  const [users, setUsers] = useState<CmsUser[]>([]);
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo | null>(null);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Identity fields
  const [siteName, setSiteName] = useState('');
  const [siteEmail, setSiteEmail] = useState('');
  const [sitePhone, setSitePhone] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [siteTagline, setSiteTagline] = useState('');

  // Social fields
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [youtube, setYoutube] = useState('');
  const [twitter, setTwitter] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // SEO fields
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [analyticsId, setAnalyticsId] = useState('');

  // Load settings
  useEffect(() => {
    authenticatedCmsFetch<SettingRow[]>(`/v1/admin/sites/${cmsSiteId}/settings`)
      .then((rows) => {
        const map = settingsToMap(rows);
        setSettings(map);

        // Populate identity
        const identity = (map['site.identity'] || {}) as Record<string, string>;
        setSiteName(identity.name || '');
        setSiteEmail(identity.email || '');
        setSitePhone(identity.phone || '');
        setSiteAddress(identity.address || '');
        setSiteTagline(identity.tagline || '');

        // Populate social
        const social = (map['site.social'] || {}) as Record<string, string>;
        setInstagram(social.instagram || '');
        setFacebook(social.facebook || '');
        setLinkedin(social.linkedin || '');
        setYoutube(social.youtube || '');
        setTwitter(social.twitter || '');
        setWhatsapp(social.whatsapp || '');

        // Populate SEO
        const seo = (map['site.seo'] || {}) as Record<string, string>;
        setMetaTitle(seo.metaTitle || '');
        setMetaDescription(seo.metaDescription || '');
        setOgImage(seo.ogImage || '');
        setAnalyticsId(seo.analyticsId || '');

        setLoaded(true);
      })
      .catch((error: Error) => {
        if (error instanceof CmsAuthenticationError) return redirectToCmsLogin();
        setMessage(`Could not load settings. ${error.message}`);
      });
  }, []);

  // Load users (on demand)
  const loadUsers = useCallback(() => {
    if (users.length) return;
    authenticatedCmsFetch<CmsUser[]>(`/v1/admin/sites/${cmsSiteId}/users`)
      .then(setUsers)
      .catch((error: Error) => {
        if (error instanceof CmsAuthenticationError) return redirectToCmsLogin();
        setMessage(`Could not load users. ${error.message}`);
      });
  }, [users.length]);

  // Load platform info (on demand)
  const loadPlatformInfo = useCallback(() => {
    if (platformInfo) return;
    authenticatedCmsFetch<PlatformInfo>(`/v1/admin/sites/${cmsSiteId}/platform-info`)
      .then(setPlatformInfo)
      .catch((error: Error) => {
        if (error instanceof CmsAuthenticationError) return redirectToCmsLogin();
        setMessage(`Could not load platform info. ${error.message}`);
      });
  }, [platformInfo]);

  function selectTab(key: TabKey) {
    setTab(key);
    setMessage('');
    if (key === 'users') loadUsers();
    if (key === 'platform') loadPlatformInfo();
  }

  async function saveSetting(namespace: string, key: string, value: unknown) {
    setSaving(true);
    setMessage('Saving...');
    try {
      await authenticatedCmsFetch(
        `/v1/admin/sites/${cmsSiteId}/settings/${namespace}/${key}`,
        { method: 'PUT', body: JSON.stringify({ value, visibility: 'public' }) }
      );
      setMessage('Settings saved successfully.');
    } catch (error) {
      if (error instanceof CmsAuthenticationError) return redirectToCmsLogin();
      setMessage(error instanceof Error ? error.message : 'Could not save.');
    } finally {
      setSaving(false);
    }
  }

  function saveIdentity() {
    return saveSetting('site', 'identity', {
      name: siteName,
      email: siteEmail,
      phone: sitePhone,
      address: siteAddress,
      tagline: siteTagline
    });
  }

  function saveSocial() {
    return saveSetting('site', 'social', {
      instagram, facebook, linkedin, youtube, twitter, whatsapp
    });
  }

  function saveSeo() {
    return saveSetting('site', 'seo', {
      metaTitle, metaDescription, ogImage, analyticsId
    });
  }

  async function exportContent() {
    setMessage('Exporting content...');
    try {
      const data = await authenticatedCmsFetch(`/v1/admin/sites/${cmsSiteId}/export`);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `jac-cms-export-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setMessage('Content exported successfully.');
    } catch (error) {
      if (error instanceof CmsAuthenticationError) return redirectToCmsLogin();
      setMessage(error instanceof Error ? error.message : 'Export failed.');
    }
  }

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span>Administration</span>
          <h1>Settings</h1>
          <p>Manage site identity, social presence, SEO defaults, user access, and platform diagnostics.</p>
        </div>
      </div>

      <div className="settings-layout">
        {/* Tab Navigation */}
        <aside className="settings-tabs">
          {TABS.map((t) => (
            <button
              className={`settings-tab ${tab === t.key ? 'active' : ''}`}
              key={t.key}
              onClick={() => selectTab(t.key)}
              type="button"
            >
              <span className="settings-tab-icon" aria-hidden="true">{t.icon}</span>
              <strong>{t.label}</strong>
            </button>
          ))}
        </aside>

        {/* Tab Content */}
        <div className="settings-content">

          {/* ——— Site Identity ——— */}
          {tab === 'identity' && loaded && (
            <div className="panel settings-panel form">
              <div className="settings-panel-header">
                <div>
                  <strong>Site Identity</strong>
                  <p>Business details shown across the public website, footer, and contact pages.</p>
                </div>
                <button className="button" disabled={saving} onClick={saveIdentity} type="button">
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
              <div className="settings-form-grid">
                <label>Business name<input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="JAC Media Land" /></label>
                <label>Contact email<input type="email" value={siteEmail} onChange={(e) => setSiteEmail(e.target.value)} placeholder="hello@example.com" /></label>
                <label>Phone number<input value={sitePhone} onChange={(e) => setSitePhone(e.target.value)} placeholder="+91 73388 91367" /></label>
                <label>Tagline<input value={siteTagline} onChange={(e) => setSiteTagline(e.target.value)} placeholder="Creative agency. Real outcomes." /></label>
              </div>
              <label>Business address<textarea rows={3} value={siteAddress} onChange={(e) => setSiteAddress(e.target.value)} placeholder="Full street address..." /></label>
              {message && <p role="status">{message}</p>}
            </div>
          )}

          {/* ——— Social Links ——— */}
          {tab === 'social' && loaded && (
            <div className="panel settings-panel form">
              <div className="settings-panel-header">
                <div>
                  <strong>Social Links</strong>
                  <p>URLs displayed in the website footer and contact pages. Leave empty to hide a platform.</p>
                </div>
                <button className="button" disabled={saving} onClick={saveSocial} type="button">
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
              <div className="settings-form-grid">
                <label>
                  <span className="settings-social-label"><span className="settings-social-dot" style={{ background: '#E4405F' }} />Instagram</span>
                  <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/jacmedialand" />
                </label>
                <label>
                  <span className="settings-social-label"><span className="settings-social-dot" style={{ background: '#1877F2' }} />Facebook</span>
                  <input value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="https://facebook.com/jacmedialand" />
                </label>
                <label>
                  <span className="settings-social-label"><span className="settings-social-dot" style={{ background: '#0A66C2' }} />LinkedIn</span>
                  <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/company/jacmedialand" />
                </label>
                <label>
                  <span className="settings-social-label"><span className="settings-social-dot" style={{ background: '#FF0000' }} />YouTube</span>
                  <input value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="https://youtube.com/@jacmedialand" />
                </label>
                <label>
                  <span className="settings-social-label"><span className="settings-social-dot" style={{ background: '#1DA1F2' }} />X / Twitter</span>
                  <input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://x.com/jacmedialand" />
                </label>
                <label>
                  <span className="settings-social-label"><span className="settings-social-dot" style={{ background: '#25D366' }} />WhatsApp</span>
                  <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="https://wa.me/917338891367" />
                </label>
              </div>
              {message && <p role="status">{message}</p>}
            </div>
          )}

          {/* ——— SEO Defaults ——— */}
          {tab === 'seo' && loaded && (
            <div className="panel settings-panel form">
              <div className="settings-panel-header">
                <div>
                  <strong>SEO Defaults</strong>
                  <p>Fallback meta tags used when pages don&apos;t specify their own. These appear in Google search results and social sharing.</p>
                </div>
                <button className="button" disabled={saving} onClick={saveSeo} type="button">
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
              <div className="settings-form-grid">
                <label>Default meta title<input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="JAC Media Land — Creative Digital Agency" /></label>
                <label>Google Analytics ID<input value={analyticsId} onChange={(e) => setAnalyticsId(e.target.value)} placeholder="G-XXXXXXXXXX" /></label>
              </div>
              <label>Default meta description<textarea rows={3} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="A concise summary of your website for search engines (150-160 characters)..." /></label>
              <label>Default OG image URL<input value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://res.cloudinary.com/devxtoev9/image/upload/og-image.jpg" /></label>

              {/* SEO Preview */}
              {(metaTitle || metaDescription) && (
                <div className="seo-preview">
                  <span className="seo-preview-label">Search result preview</span>
                  <div className="seo-preview-card">
                    <span className="seo-preview-url">jacmedialand.com</span>
                    <strong className="seo-preview-title">{metaTitle || 'Page Title'}</strong>
                    <p className="seo-preview-description">{metaDescription || 'Meta description will appear here...'}</p>
                  </div>
                </div>
              )}
              {message && <p role="status">{message}</p>}
            </div>
          )}

          {/* ——— Team & Users ——— */}
          {tab === 'users' && (
            <div className="panel settings-panel">
              <div className="settings-panel-header">
                <div>
                  <strong>Team & Users</strong>
                  <p>All accounts with CMS access on this tenant. Manage roles and permissions through the database.</p>
                </div>
                <span className="settings-badge">{users.length} users</span>
              </div>
              {users.length > 0 ? (
                <div className="settings-users-grid">
                  {users.map((user) => (
                    <div className="settings-user-card" key={user.id}>
                      <div className="settings-user-avatar" aria-hidden="true">
                        {user.name?.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '?'}
                      </div>
                      <div className="settings-user-info">
                        <strong>{user.name || 'Unnamed'}</strong>
                        <span>{user.email}</span>
                        <div className="settings-user-meta">
                          <span className="settings-role-badge">{user.role}</span>
                          <span className="settings-user-date">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty">Loading team members...</p>
              )}
            </div>
          )}

          {/* ——— Danger Zone ——— */}
          {tab === 'danger' && (
            <div className="panel settings-panel settings-danger">
              <div className="settings-panel-header">
                <div>
                  <strong>Danger Zone</strong>
                  <p>Sensitive operations. Use these tools for backup and maintenance.</p>
                </div>
              </div>

              <div className="danger-card">
                <div className="danger-card-info">
                  <strong>Export all content</strong>
                  <p>Download a full JSON backup of all services, pages, settings, and collections. Use this for version control, migration, or disaster recovery.</p>
                </div>
                <button className="button-secondary" onClick={exportContent} type="button">Download JSON export</button>
              </div>

              <div className="danger-card">
                <div className="danger-card-info">
                  <strong>Clear browser session</strong>
                  <p>Sign out and clear all stored tokens from this browser. You will need to log in again.</p>
                </div>
                <button className="button-secondary danger-action" onClick={() => {
                  localStorage.removeItem('cmsAccessToken');
                  localStorage.removeItem('cmsRefreshToken');
                  redirectToCmsLogin();
                }} type="button">Clear session & sign out</button>
              </div>

              {message && <p className="empty" role="status">{message}</p>}
            </div>
          )}

          {/* ——— Platform Info ——— */}
          {tab === 'platform' && (
            <div className="panel settings-panel">
              <div className="settings-panel-header">
                <div>
                  <strong>Platform Info</strong>
                  <p>System diagnostics and environment details for the running CMS instance.</p>
                </div>
                <button className="button-secondary" onClick={() => { setPlatformInfo(null); loadPlatformInfo(); }} type="button">Refresh</button>
              </div>
              {platformInfo ? (
                <div className="platform-info-grid">
                  <div className="platform-info-card">
                    <span>Environment</span>
                    <strong className={`platform-env ${platformInfo.environment}`}>{platformInfo.environment}</strong>
                  </div>
                  <div className="platform-info-card">
                    <span>Node.js</span>
                    <strong>{platformInfo.nodeVersion}</strong>
                  </div>
                  <div className="platform-info-card">
                    <span>Platform</span>
                    <strong>{platformInfo.platform}</strong>
                  </div>
                  <div className="platform-info-card">
                    <span>MongoDB Database</span>
                    <strong>{platformInfo.mongoDb}</strong>
                  </div>
                  <div className="platform-info-card">
                    <span>Cloudinary Cloud</span>
                    <strong>{platformInfo.cloudinaryCloud}</strong>
                  </div>
                  <div className="platform-info-card">
                    <span>API Port</span>
                    <strong>{platformInfo.apiPort}</strong>
                  </div>
                  <div className="platform-info-card">
                    <span>Access Token TTL</span>
                    <strong>{platformInfo.accessTokenTtl}</strong>
                  </div>
                  <div className="platform-info-card">
                    <span>Refresh Token TTL</span>
                    <strong>{platformInfo.refreshTokenTtl}</strong>
                  </div>
                  <div className="platform-info-card wide">
                    <span>API Uptime</span>
                    <strong>{platformInfo.uptime}</strong>
                  </div>
                </div>
              ) : (
                <p className="empty">Loading platform information...</p>
              )}
            </div>
          )}

          {!loaded && tab !== 'users' && tab !== 'platform' && tab !== 'danger' && (
            <div className="panel settings-panel">
              <p className="empty">Loading settings...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
