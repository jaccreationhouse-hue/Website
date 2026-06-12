import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiClock,
  FiCoffee,
  FiCompass,
  FiMapPin,
  FiUsers,
  FiZap
} from 'react-icons/fi';
import ScrollReveal from '../components/ScrollReveal';
import CareerApplicationForm from '../components/CareerApplicationForm';
import { useCmsCollectionState } from '../api/useCmsCollection';
import {
  careerOpeningPath,
  isCareerOpeningAcceptingApplications,
  isGeneralCareerOpening
} from '../data/careers';
import { fallbackCareerOpenings, type CareerOpeningItem } from '../data/cmsSections';

const benefits = [
  { Icon: FiClock, title: 'Flexible work hours', description: 'Do your best work with a rhythm that supports focus and responsibility.' },
  { Icon: FiBookOpen, title: 'Continuous learning', description: 'Build practical skills through real work, feedback, and shared knowledge.' },
  { Icon: FiAward, title: 'Growth with recognition', description: 'Strong work is noticed, discussed clearly, and rewarded fairly.' },
  { Icon: FiCoffee, title: 'Human-centered culture', description: 'Supportive teammates, honest conversations, and room to be yourself.' }
];

const values = [
  { Icon: FiCompass, title: 'Curiosity before certainty', description: 'We ask better questions before rushing into solutions.' },
  { Icon: FiUsers, title: 'Collaborate without ego', description: 'Good ideas can come from anywhere, and credit is shared.' },
  { Icon: FiZap, title: 'Make useful progress', description: 'We value steady, visible improvement over empty busyness.' }
];

const hiringSteps = ['Share your profile', 'Intro conversation', 'Practical discussion', 'Mutual decision'];

export default function Careers() {
  const { items: openings, loading } = useCmsCollectionState<CareerOpeningItem>('careerOpenings', fallbackCareerOpenings);
  const activeOpenings = openings.filter((opening) => isCareerOpeningAcceptingApplications(opening));
  const talentNetwork = activeOpenings.find(isGeneralCareerOpening);
  const roleOpenings = activeOpenings.filter((opening) => !isGeneralCareerOpening(opening));
  const orderedOpenings = [...roleOpenings, ...(talentNetwork ? [talentNetwork] : [])];
  const statusLabel = loading
    ? 'Checking opportunities'
    : roleOpenings.length
      ? `${roleOpenings.length} open ${roleOpenings.length === 1 ? 'opportunity' : 'opportunities'}`
      : talentNetwork
        ? 'Talent network open'
        : 'No current openings';

  return (
    <main className="page careers-page" style={{ display: 'block' }}>
      <section className="careers-hero">
        <div className="wrap careers-container">
          <div className="careers-hero-layout">
            <ScrollReveal direction="up" delay={60}>
              <div className="careers-hero-copy">
                <span className="chip">Careers at JAC Media Land</span>
                <h1>Do meaningful work with people who care about the details.</h1>
                <p>We&apos;re a growing team of designers, engineers, and creators who value curiosity, dependable execution, and learning together.</p>
                <div className="careers-actions">
                  <a href="#apply" className="services-primary-action">Join our talent network <FiArrowRight aria-hidden="true" /></a>
                  <a href="#culture" className="services-secondary-action">Explore our culture</a>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={140}>
              <div className="careers-hero-panel">
                <span className="careers-status"><i />{statusLabel}</span>
                <FiBriefcase aria-hidden="true" />
                <h2>We hire for potential, craft, and how you work with others.</h2>
                <p>{talentNetwork ? 'No suitable role right now? Join our talent network and tell us where you can make an impact.' : 'Explore current opportunities and find the role that fits your craft and ambitions.'}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <OpeningsSection openings={loading ? [] : orderedOpenings} loading={loading} />

      <section className="careers-culture" id="culture">
        <div className="wrap careers-container">
          <ScrollReveal direction="up" delay={60}>
            <div className="career-section-heading">
              <div><span className="services-section-label">Life on the team</span><h2>A place to grow your craft and your confidence.</h2></div>
              <p>We keep the environment supportive, the standards high, and the communication clear.</p>
            </div>
          </ScrollReveal>
          <div className="career-benefits-grid">
            {benefits.map(({ Icon, title, description }, index) => (
              <ScrollReveal key={title} direction="up" delay={index * 60}>
                <article className="career-benefit-card"><span><Icon aria-hidden="true" /></span><h3>{title}</h3><p>{description}</p></article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="careers-values">
        <div className="wrap careers-container">
          <ScrollReveal direction="up" delay={60}>
            <div className="careers-values-panel">
              <div className="careers-values-intro"><span className="services-section-label">How we work</span><h2>The habits we respect.</h2></div>
              <div className="careers-values-grid">
                {values.map(({ Icon, title, description }) => (
                  <div className="career-value-item" key={title}><span><Icon aria-hidden="true" /></span><div><h3>{title}</h3><p>{description}</p></div></div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="careers-process">
        <div className="wrap careers-container">
          <ScrollReveal direction="up" delay={60}>
            <div className="career-section-heading"><div><span className="services-section-label">Simple and respectful</span><h2>What the hiring journey looks like.</h2></div></div>
          </ScrollReveal>
          <div className="career-process-grid">
            {hiringSteps.map((step, index) => <div key={step}><span>{String(index + 1).padStart(2, '0')}</span><h3>{step}</h3></div>)}
          </div>
        </div>
      </section>

      <section className="career-apply-section" id="apply">
        <div className="wrap careers-container">
          <ScrollReveal direction="up" delay={60}>
            <div className="career-section-heading">
              <div><span className="services-section-label">Join the talent network</span><h2>Tell us where you can make an impact.</h2></div>
              <p>If there is not an open role that fits today, share your background and we will keep you in mind for future opportunities.</p>
            </div>
          </ScrollReveal>
          <CareerApplicationForm opening={talentNetwork} />
        </div>
      </section>
    </main>
  );
}

function OpeningsSection({ openings, loading }: { openings: CareerOpeningItem[]; loading: boolean }) {
  return (
    <section className="careers-talent" id="openings" aria-busy={loading}>
      <div className="wrap careers-container">
        <div className="career-section-heading">
          <div><span className="services-section-label">Open opportunities</span><h2>Find the role where you can do your best work.</h2></div>
          <p>Choose a role or join the talent network. Every application is reviewed by our team.</p>
        </div>
        {loading && <div className="career-openings-loading" role="status"><span /><div><strong>Checking current opportunities...</strong><small>Loading the latest openings from our team.</small></div></div>}
        {openings.map((opening, index) => {
          const general = isGeneralCareerOpening(opening);
          return (
            <ScrollReveal key={opening.slug} direction="up" delay={index * 60}>
              <article className={`careers-talent-card ${general ? 'careers-talent-card-general' : ''}`}>
                <span className="careers-talent-icon"><FiBriefcase aria-hidden="true" /></span>
                <div>
                  <span className="services-section-label">{general ? 'General application' : opening.department || 'Open role'}</span>
                  <h2>{opening.title}</h2>
                  <div className="career-opening-card-meta">
                    <span><FiMapPin aria-hidden="true" />{opening.location}</span>
                    <span><FiBriefcase aria-hidden="true" />{opening.employmentType}{opening.workplaceType ? ` / ${opening.workplaceType}` : ''}</span>
                  </div>
                  <p>{opening.description}</p>
                </div>
                <Link to={careerOpeningPath(opening)} className="careers-talent-link">{general ? 'Introduce yourself' : 'View and apply'} <FiArrowRight aria-hidden="true" /></Link>
              </article>
            </ScrollReveal>
          );
        })}
        {!loading && !openings.length && <div className="career-closed-card"><h2>No openings are accepting applications right now.</h2><p>Please check back soon for new opportunities.</p></div>}
      </div>
    </section>
  );
}
