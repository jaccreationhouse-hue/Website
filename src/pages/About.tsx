import ScrollReveal from '../components/ScrollReveal';
import johnFounderImg from '../assets/john-founder.jpg';
import { useCmsCollection } from '../api/useCmsCollection';
import { fallbackTeamMembers, type TeamMemberItem } from '../data/cmsSections';
import { FiAward, FiBookOpen, FiCompass, FiEdit3, FiHeart, FiMonitor, FiSend, FiTarget, FiTrendingUp, FiUser, FiUsers, FiZap } from 'react-icons/fi';
import { AboutHeroIllustration, CultureIllustration } from '../components/Illustrations.tsx';
import { teamMemberImageUrl } from '../utils/cloudinary';

function getMemberImageUrl(image: string | undefined): string | null {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  if (image.startsWith('team/')) return teamMemberImageUrl(image, 320);
  // Otherwise, it's a local fallback image name (e.g. gowtham.webp?v=3)
  return `${import.meta.env.BASE_URL}team/${image}`;
}

function getFounderImageUrl(image: string | undefined): string {
  if (!image) return johnFounderImg;
  if (image.startsWith('http')) return image;
  if (image.startsWith('team/')) return teamMemberImageUrl(image, 600);
  if (image.includes('john-founder')) return johnFounderImg;
  return `${import.meta.env.BASE_URL}team/${image}`;
}

export default function About() {
  const teamMembers = useCmsCollection<TeamMemberItem>('teamMembers', fallbackTeamMembers);
  const founder = teamMembers.find((member) => member.featured) ?? fallbackTeamMembers[0];
  const team = teamMembers.filter((member) => !member.featured);

  return (
    <div className="page" style={{ display: 'block' }}>

      {/* ABOUT HERO */}
      <section className="about-hero">
        <div className="about-hero-container">
          <div className="about-hero-left">
            <ScrollReveal direction="up" delay={100}>
              <span className="chip">About JAC Media Land</span>
              <h1>Learn About <span>Us.</span></h1>
              <p className="about-hero-lead">A youth-powered creative and technology company building thoughtful digital experiences with clarity, precision, and purpose.</p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={200}>
              <div className="about-story">
                <p>JAC Media Land upholds a high standard of excellence in building meaningful and dependable solutions in India.</p>
                <p>Whether you're launching from the ground up or aiming to elevate an existing venture, we infuse every project with fresh perspective and strategic excellence.</p>
                <p>Our team is made up of level-headed problem solvers, steady under pressure, solution-oriented, and fully committed to bringing your vision to life with clarity and precision.</p>
                <p>We're more than just a tech company! We're a youth-powered culture, driven by deep expertise, bold creativity, and a relentless passion for shaping what's next.</p>
              </div>
            </ScrollReveal>
          </div>
          <ScrollReveal direction="left" delay={150} className="about-hero-right">
            <AboutHeroIllustration />

          </ScrollReveal>
        </div>
      </section>

      {/* LIFE AT JAC MEDIA LAND */}
      <section className="life">
        <div className="life-container">
          <ScrollReveal direction="right" delay={100} className="life-img">
            <CultureIllustration />

          </ScrollReveal>
          <ScrollReveal direction="left" delay={200} className="life-right">
            <span className="chip">Life at JAC</span>
            <h2>Life at JAC Media Land</h2>
            <div className="sub">A workplace where curiosity is encouraged, people feel supported, and passion fuels progress.</div>
            <p>At JAC Media Land, we believe that great innovation thrives in a positive and collaborative environment. Our culture is built on the foundation of mutual respect, continuous learning, and creative freedom. We nurture a healthy ecosystem where ideas are encouraged, individuality is celebrated, and every voice is heard.</p>
            <p>We are not just building technology — we are building a community of forward-thinkers driven by curiosity and purpose. With an open-door policy, flexible thinking, and a strong focus on work-life balance, JAC Media Land is a place where careers flourish, friendships grow, and innovation never stops.</p>
            <div className="life-values">
              {[
                { label: 'Creative Freedom', icon: <FiZap /> },
                { label: 'Continuous Learning', icon: <FiBookOpen /> },
                { label: 'People First', icon: <FiHeart /> },
                { label: 'Shared Ideas', icon: <FiUsers /> }
              ].map((value) => (
                <div className="life-value" key={value.label}>
                  <span aria-hidden="true">{value.icon}</span>
                  <strong>{value.label}</strong>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* PROCESS */}
      <section className="process-showcase">
        <div className="process-container">
          <ScrollReveal direction="up" delay={100}>
            <div className="home-section-heading">
              <span className="chip">Our Process</span>
              <h2>How We Work</h2>
              <p>A clear, collaborative path that turns your ideas into dependable digital experiences.</p>
            </div>
          </ScrollReveal>
          <div className="process-grid">
            {[
              { num: '01', label: 'Understand Your Goals', desc: 'We listen closely, clarify your needs, and define what success looks like.', icon: <FiTarget /> },
              { num: '02', label: 'Plan the Right Approach', desc: 'We shape a practical strategy with clear priorities, scope, and direction.', icon: <FiCompass /> },
              { num: '03', label: 'Create and Collaborate', desc: 'We design, build, and refine the solution with your feedback throughout.', icon: <FiEdit3 /> },
              { num: '04', label: 'Launch and Support', desc: 'We deliver confidently and stay available as your business continues to grow.', icon: <FiSend /> }
            ].map((step, idx) => (
              <ScrollReveal key={step.label} direction="up" delay={idx * 100}>
                <article className="process-card">
                  <div className="process-card-top">
                    <span className="process-card-icon" aria-hidden="true">{step.icon}</span>
                    <span className="process-number">{step.num}</span>
                  </div>
                  <div className="process-card-copy">
                    <h3>{step.label}</h3>
                    <p>{step.desc}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="team">
        <div className="team-container">
          <ScrollReveal direction="up" delay={100}>
            <div className="home-section-heading">
              <span className="chip">Leadership & Team</span>
              <h2>People Behind Our Success</h2>
              <p>Purposeful leadership and a committed team working together to create meaningful digital experiences.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={150}>
            <article className="founder-spotlight">
              <div className="founder-photo-wrap">
                <img
                  src={getFounderImageUrl(founder.image)}
                  alt={`${founder.title}, Founder and CEO of JAC Media Land`}
                  className="founder-photo"
                />
                <span className="founder-photo-label">Founder Spotlight</span>
              </div>
              <div className="founder-content">
                <span className="founder-badge"><FiAward aria-hidden="true" /> Founder & CEO</span>
                <p className="founder-eyebrow">Leading the vision behind JAC Media Land</p>
                <h3>{founder.title}</h3>
                <p className="founder-role">{founder.role}</p>
                <p className="founder-message">{founder.message}</p>
                <div className="founder-signature" aria-hidden="true">
                  <span />
                  <strong>JAC Media Land</strong>
                </div>
              </div>
            </article>
          </ScrollReveal>

          <div className="team-grid-heading">
            <div>
              <span className="chip">Our Team</span>
              <h3>Meet the people who make it happen.</h3>
            </div>
            <p>Different strengths, one shared commitment to excellent work.</p>
          </div>

          <div className="team-grid">
            {team.map((member, idx) => (
              <ScrollReveal key={member.slug} direction="up" delay={(idx % 4) * 80}>
                <div className="team-card">
                  <div className="team-card-inner">
                    {member.image && getMemberImageUrl(member.image) ? (
                      <img
                        src={getMemberImageUrl(member.image) || ''}
                        alt={member.title}
                        className="team-photo"
                        loading="lazy"
                      />
                    ) : (
                      <FiUser className="human-icon" size={60} style={{ strokeWidth: 1.2, color: 'var(--black)' }} />
                    )}
                  </div>
                  <div className="team-card-copy">
                    <div className="team-name">{member.title}</div>
                    <div className="team-role">{member.role}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* OUR SPACE */}
      <section className="space">
        <div className="space-container">
          <ScrollReveal direction="up" delay={100}>
            <div className="home-section-heading">
              <span className="chip">Inside JAC Media Land</span>
              <h2>Our Space</h2>
              <p>A creative environment designed for focused thinking, open collaboration, and meaningful progress.</p>
            </div>
          </ScrollReveal>

          <div className="space-showcase">
            <ScrollReveal direction="right" delay={150} className="space-visual-item">
              <div className="space-visual-frame">
                <div className="space-visual-kicker">
                  <span className="space-live-dot" aria-hidden="true" />
                  A look inside our workspace
                </div>
                <div className="space-visual-media">
                  <CultureIllustration />

                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={200} className="space-story">
              <span className="chip">Where Ideas Grow</span>
              <h3>Built for people who love creating together.</h3>
              <p>Our space brings focused work, thoughtful conversations, and fresh ideas under one roof. It is where our team explores possibilities, solves challenges, and turns ambitious concepts into dependable digital experiences.</p>
              <div className="space-highlights">
                {[
                  { title: 'Creative Studio', desc: 'Room to explore and shape bold ideas.', icon: <FiMonitor /> },
                  { title: 'Collaborative Space', desc: 'A culture built around shared thinking.', icon: <FiUsers /> },
                  { title: 'Growth Environment', desc: 'Every project creates a chance to learn.', icon: <FiTrendingUp /> }
                ].map((item) => (
                  <div className="space-highlight" key={item.title}>
                    <span aria-hidden="true">{item.icon}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

    </div>
  );
}
