'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SessionActions from './session-actions';

const navigation = [
  ['Overview', '/', 'OV'],
  ['Website Sections', '/collections', 'WS'],
  ['Service Catalogue', '/content', 'SC'],
  ['Media Library', '/media', 'ML'],
  ['Applications', '/applications', 'AP'],
  ['Lead Inbox', '/leads', 'LI'],
  ['Activity Log', '/activity', 'AL'],
  ['Settings', '/settings', 'ST']
] as const;

function isActive(pathname: string, href: string): boolean {
  return href === '/' ? pathname === href : pathname.startsWith(href);
}

export default function AdminShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  if (pathname === '/login') {
    return (
      <main className="auth-shell">
        <div className="auth-brand">
          <span className="brand-mark">J</span>
          <div><strong>JAC CMS</strong><small>Editorial workspace</small></div>
        </div>
        {children}
      </main>
    );
  }

  return (
    <div className="workspace-shell">
      <aside className="sidebar">
        <Link className="brand" href="/">
          <span className="brand-mark">J</span>
          <div><strong>JAC CMS</strong><small>Editorial workspace</small></div>
        </Link>
        <div className="sidebar-section-label">Workspace</div>
        <nav aria-label="CMS navigation">
          {navigation.map(([label, href, monogram]) => (
            <Link
              className={`nav-link ${isActive(pathname, href) ? 'active' : ''}`}
              href={href}
              key={href}
            >
              <span aria-hidden="true">{monogram}</span>
              <strong>{label}</strong>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="live-dot" aria-hidden="true" />
          <div><strong>Platform online</strong><small>MongoDB connected</small></div>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div className="site-context">
            <span>Active site</span>
            <strong>JAC Media Land</strong>
          </div>
          <div className="topbar-actions">
            <a href={process.env.NODE_ENV === 'production' ? 'https://website-azure-seven-51.vercel.app' : 'http://localhost:5173'} target="_blank" rel="noreferrer">View website</a>
            <a href={process.env.NODE_ENV === 'production' ? 'https://website-1cc5.onrender.com/docs' : 'http://localhost:4000/docs'} target="_blank" rel="noreferrer">API docs</a>
            <SessionActions />
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
