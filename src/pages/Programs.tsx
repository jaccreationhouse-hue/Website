import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import {
  FiArrowRight,
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiClock,
  FiCode,
  FiLayers,
  FiUsers
} from 'react-icons/fi';
import internshipProgram from '../assets/internship_program.jpg';
import heroIllustration from '../assets/hero_illustration.png';
import professionalTeam from '../assets/professional_team.png';
import { useCmsCollection } from '../api/useCmsCollection';
import { fallbackPrograms, type ProgramItem } from '../data/cmsSections';

const learningBenefits = [
  { title: 'Real Projects', description: 'Build practical experience through meaningful work.', icon: <FiBriefcase /> },
  { title: 'Expert Mentorship', description: 'Learn with guidance from experienced professionals.', icon: <FiUsers /> },
  { title: 'Career Readiness', description: 'Develop the confidence and skills to move forward.', icon: <FiAward /> }
];

const programImages: Record<string, string> = {
  internship: internshipProgram,
  'full-stack': heroIllustration,
  design: professionalTeam
};

export default function Programs() {
  const programs = useCmsCollection<ProgramItem>('programs', fallbackPrograms);
  const activeProgram = programs.find((program) => program.kind === 'active') ?? fallbackPrograms[0];
  const upcomingPrograms = programs.filter((program) => program.kind === 'upcoming');

  return (
    <main className="page programs-page" style={{ display: 'block' }}>
      <section className="programs-hero">
        <div className="programs-container">
          <ScrollReveal direction="up" delay={100}>
            <div className="programs-hero-content">
              <span className="chip">Education & Career Pathways</span>
              <h1>Our <span>Programs</span></h1>
              <p className="programs-hero-tagline">Grow Skills. Build Careers.</p>
              <p className="programs-hero-description">Unlock your potential with immersive learning experiences, expert guidance, and real-world projects that help your portfolio stand out.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="programs-showcase">
        <div className="programs-container">
          <ScrollReveal direction="up" delay={100}>
            <div className="programs-section-heading">
              <div>
                <span className="chip">Open Opportunity</span>
                <h2>Start building your future today.</h2>
              </div>
              <p>Our active internship gives students and freshers practical exposure across digital disciplines.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={150}>
            <Link to={activeProgram.path ?? '/programs/internship'} className="featured-program">
              <div className="featured-program-image">
                <img src={programImages[activeProgram.imageKey ?? 'internship'] ?? internshipProgram} alt={activeProgram.title} />
                <span className="program-status program-status-open">{activeProgram.launch}</span>
              </div>
              <div className="featured-program-content">
                <span className="featured-program-eyebrow"><FiBookOpen aria-hidden="true" /> Learn by doing</span>
                <h2>{activeProgram.title}</h2>
                <p>{activeProgram.description}</p>
                <div className="featured-program-meta">
                  <span><FiBriefcase aria-hidden="true" /> Real project experience</span>
                  <span><FiUsers aria-hidden="true" /> Expert mentorship</span>
                  <span><FiAward aria-hidden="true" /> Completion certificate</span>
                </div>
                <span className="featured-program-action">View program details <FiArrowRight aria-hidden="true" /></span>
              </div>
            </Link>
          </ScrollReveal>

          <div className="programs-benefits">
            {learningBenefits.map((benefit, index) => (
              <ScrollReveal key={benefit.title} direction="up" delay={index * 80}>
                <article className="program-benefit-card">
                  <span aria-hidden="true">{benefit.icon}</span>
                  <div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="upcoming-programs">
        <div className="programs-container">
          <ScrollReveal direction="up" delay={100}>
            <div className="programs-section-heading">
              <div>
                <span className="chip">Coming Next</span>
                <h2>More pathways are on the way.</h2>
              </div>
              <p>Focused programs designed to turn curiosity into practical, career-ready ability.</p>
            </div>
          </ScrollReveal>

          <div className="upcoming-programs-grid">
            {upcomingPrograms.map((program, index) => (
              <ScrollReveal key={program.title} direction="up" delay={index * 100}>
                <article className="upcoming-program-card">
                  <div className="upcoming-program-image">
                    <img src={programImages[program.imageKey ?? ''] ?? heroIllustration} alt="" aria-hidden="true" />
                    <span className="program-status">Coming Soon</span>
                  </div>
                  <div className="upcoming-program-content">
                    <span className="upcoming-program-icon" aria-hidden="true">{program.imageKey === 'design' ? <FiLayers /> : <FiCode />}</span>
                    <div>
                      <span className="upcoming-program-launch"><FiClock aria-hidden="true" /> {program.launch}</span>
                      <h3>{program.title}</h3>
                      <p>{program.description}</p>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
