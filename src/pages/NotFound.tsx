import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="page active" style={{ display: 'block', background: 'var(--hero-bg)', minHeight: '65vh' }}>
      <section className="section" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div className="wrap" style={{ maxWidth: '680px' }}>
          <span className="chip" style={{ margin: '0 auto 14px' }}>Page Not Found</span>
          <h1 className="section-title" style={{ fontSize: 'clamp(38px, 7vw, 64px)', marginBottom: '18px' }}>
            This page has moved or does not exist.
          </h1>
          <p className="section-sub" style={{ marginBottom: '30px', lineHeight: '1.7' }}>
            Use one of the options below to continue exploring JAC Media Land.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <Link to="/" className="btn btn-orange">Return Home</Link>
            <Link to="/contact" className="btn btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
