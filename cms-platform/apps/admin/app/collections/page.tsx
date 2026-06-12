import Link from 'next/link';
import { websiteCollections } from '../../lib/collections';

export default function CollectionsPage() {
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span>Website sections</span>
          <h1>Manage the content visitors see.</h1>
          <p>Each module publishes structured records directly to the public website API.</p>
        </div>
      </div>
      <div className="card-grid">
        {websiteCollections.map((collection) => (
          <Link className="feature-card" href={`/collections/${collection.key}`} key={collection.key}>
            <span>Open section</span>
            <h2>{collection.label}</h2>
            <p>{collection.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
