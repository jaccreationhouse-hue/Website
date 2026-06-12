import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBriefcase, FiExternalLink, FiFolder, FiGrid } from 'react-icons/fi';
import { useCmsCollection } from '../api/useCmsCollection';
import { fallbackPortfolioProjects, type PortfolioProjectItem } from '../data/cmsSections';

const portfolioFilters = [
  { id: 'all', label: 'All work', count: 4 },
  { id: 'development', label: 'Development', count: 4 },
  { id: 'ux', label: 'UX / UI', count: 0 },
  { id: 'brand', label: 'Brand Identity', count: 0 },
  { id: 'logo', label: 'Logo Design', count: 0 },
  { id: 'packaging', label: 'Packaging', count: 0 }
];

const getDisplayUrl = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('all');
  const projects = useCmsCollection<PortfolioProjectItem>('portfolioProjects', fallbackPortfolioProjects);
  const filters = portfolioFilters.map((filter) => ({
    ...filter,
    count: filter.id === 'all'
      ? projects.length
      : projects.filter((project) => project.category === filter.id).length
  }));
  const activeCategory = filters.find((filter) => filter.id === activeFilter) ?? filters[0];
  const visibleProjects = activeFilter === 'all'
    ? projects
    : projects.filter((project) => project.category === activeFilter);

  return (
    <main className="page portfolio-page" style={{ display: 'block' }}>
      <section className="portfolio-hero">
        <div className="wrap portfolio-container">
          <div className="portfolio-hero-layout">
            <div className="portfolio-hero-copy">
              <span className="chip">Deployed projects</span>
              <h1>Web experiences built and shipped.</h1>
              <p className="portfolio-sub">Explore the live projects from our current deployment list. More work will be added as the portfolio grows.</p>
              <a href="#portfolio-work" className="services-primary-action">Explore the work <FiArrowRight aria-hidden="true" /></a>
            </div>
            <div className="portfolio-summary" aria-label="Portfolio overview">
              <div><FiBriefcase aria-hidden="true" /><strong>04</strong><span>Projects shown</span></div>
              <div><FiGrid aria-hidden="true" /><strong>04</strong><span>Industries served</span></div>
              <p>Each project below is included directly from the approved deployed-project list.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="portfolio-work" id="portfolio-work">
        <div className="portfolio-filter-shell">
          <div className="wrap portfolio-container portfolio-filter-inner">
            <div><span className="services-section-label">Browse the catalogue</span><strong>{activeCategory.count} projects</strong></div>
            <div className="filter-bar" role="group" aria-label="Filter portfolio projects">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  aria-pressed={activeFilter === filter.id}
                >
                  <span>{filter.label}</span>
                  <small>{filter.count}</small>
                </button>
              ))}
            </div>
          </div>
        </div>

        {visibleProjects.length > 0 ? (
          <div className="portfolio-grid portfolio-deployed-grid" aria-label={`${activeCategory.label} projects`}>
            {visibleProjects.map((project, index) => (
              <a
                key={project.slug}
                className="port-card fade-in portfolio-deployed-card"
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.title} live website`}
              >
                <div className={`card-img ${project.visual}`}>
                  <div className="url-bar">{getDisplayUrl(project.url)}</div>
                  <div className="portfolio-project-number">{String(index + 1).padStart(2, '0')}</div>
                  <div className="overlay-text">
                    <div className="ot-label">Website for</div>
                    <div className="ot-title">{project.industry}</div>
                    <div className="ot-by">developed by <b>JAC Media Land</b></div>
                  </div>
                </div>
                <div className="card-bottom portfolio-project-footer">
                  <div>
                    <h3>{project.title}</h3>
                    <span className="dev">Development</span>
                  </div>
                  <FiExternalLink aria-hidden="true" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="portfolio-empty-state" role="status">
            <span><FiFolder aria-hidden="true" /></span>
            <p className="services-section-label">{activeCategory.label}</p>
            <h2>Projects will be added soon.</h2>
            <p>We&apos;re preparing selected work for this category. Check back as the portfolio grows.</p>
          </div>
        )}
      </section>

      <section className="portfolio-cta">
        <div className="wrap portfolio-container">
          <div className="portfolio-cta-card">
            <div><span className="services-section-label">Your project could be next</span><h2>Need work that looks good and solves the right problem?</h2><p>Tell us what you're building, changing, or trying to grow. We'll help shape the right approach.</p></div>
            <Link to="/contact">Discuss your project <FiArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
