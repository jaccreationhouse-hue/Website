import Link from 'next/link';

const cards = [
  ['Website Sections', 'Manage highlights, team, portfolio, programs, careers, and contacts.', '/collections'],
  ['Content', 'Manage pages and the published service catalogue.', '/content'],
  ['Media Library', 'Upload images and videos to Cloudinary and copy public IDs.', '/media'],
  ['Leads', 'Review and progress contact form submissions.', '/leads'],
  ['Settings', 'Review shared contact and site configuration.', '/settings']
] as const;

export default function Dashboard() {
  return (
    <section className="page">
      <div className="page-heading">
        <div><span>Editorial overview</span><h1>Everything your website needs, in one clear workspace.</h1><p>Publish structured content, keep enquiries moving, and maintain a consistent public experience.</p></div>
        <Link className="button" href="/collections">Manage website sections</Link>
      </div>
      <div className="metrics">
        <article><span>Platform health</span><strong>Online</strong><small>API, MongoDB, and public delivery are connected.</small></article>
        <article><span>Publishing flow</span><strong>Controlled</strong><small>Move safely between draft, published, and archived states.</small></article>
        <article><span>Content scope</span><strong>30 collections</strong><small>Tenant-scoped records with protected administration.</small></article>
      </div>
      <div className="card-grid">
        {cards.map(([title, description, href]) => (
          <Link className="feature-card" href={href} key={href}>
            <span>Open module</span><h2>{title}</h2><p>{description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
