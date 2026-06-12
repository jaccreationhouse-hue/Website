import { useNavigate } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import internshipProgram from '../assets/internship_program.jpg';

export default function InternshipDetails() {
  const navigate = useNavigate();

  const domains = [
    { title: 'Website Development', emoji: '💻' },
    { title: 'UI/UX Design', emoji: '✨' },
    { title: 'SEO Marketing', emoji: '🔍' },
    { title: 'Graphic Design', emoji: '🎨' },
    { title: 'Digital Marketing', emoji: '📈' }
  ];

  const benefits = [
    'Real Project Experience',
    'Expert Mentorship',
    'Skill Development',
    'Certificate of Completion',
    'Career Growth Opportunities'
  ];

  return (
    <div className="page" style={{ display: 'block' }}>
      {/* Hero Section */}
      <section className="section" style={{ background: 'var(--hero-bg)', padding: '60px 40px', borderBottom: '1px solid var(--card-border)' }}>
        <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ScrollReveal direction="up" delay={100}>
            <span className="chip">JAC Media Land Dream Zone</span>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={150}>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '46px', fontWeight: '800', color: 'var(--black)', margin: 0 }}>Internship Program</h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p style={{ fontSize: '18px', fontWeight: '600', color: 'var(--orange)' }}>
              Learn • Grow • Succeed
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Details Section */}
      <main className="section" style={{ padding: '40px 40px 80px' }}>
        <div className="wrap">
          
          {/* Back Button */}
          <ScrollReveal direction="up" delay={50}>
            <button 
              onClick={() => navigate('/programs')} 
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--orange)',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 0 24px 0',
                fontSize: '14px',
                fontFamily: "'Syne', sans-serif"
              }}
            >
              <FiArrowLeft size={18} style={{ strokeWidth: 2.5 }} />
              Back to Programs
            </button>
          </ScrollReveal>

          {/* Desktop: Grid showing info on left and image on right. Mobile: Stacks image on top using flex-direction column-reverse */}
          <div className="split-desktop-reverse" style={{ gap: '60px', alignItems: 'start' }}>
            
            {/* Left Side (Desktop): Detailed Program Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', flex: 1 }}>
              <ScrollReveal direction="up" delay={150}>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '28px', fontWeight: '800', color: 'var(--black)', marginBottom: '12px' }}>
                  Shape Your Future Today
                </h2>
                <p style={{ fontSize: '15px', color: 'var(--gray-600)', lineHeight: '1.8' }}>
                  Kickstart your career with hands-on industry experience and expert mentorship at <strong>JAC Media Land</strong>. Our Internship Program is designed to help students and freshers develop practical skills, work on real-time projects, and gain professional exposure in the digital world.
                </p>
              </ScrollReveal>

              {/* Domains Offered */}
              <ScrollReveal direction="up" delay={200}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: '700', color: 'var(--black)', marginBottom: '12px' }}>
                  💻 Internship Domains Offered
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  {domains.map((domain) => (
                    <div key={domain.title} style={{
                      padding: '12px 16px',
                      background: 'var(--gray-50)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <span>{domain.emoji}</span>
                      <span style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--black)' }}>{domain.title}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              {/* Modes Offered */}
              <ScrollReveal direction="up" delay={250}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: '700', color: 'var(--black)', marginBottom: '8px' }}>
                  🌐 Available Modes
                </h3>
                <p style={{ fontSize: '14.5px', color: 'var(--gray-600)' }}>
                  We support both <strong>Offline</strong> and <strong>Online</strong> modes of internship, making learning flexible for you.
                </p>
              </ScrollReveal>

              {/* Why Join Us */}
              <ScrollReveal direction="up" delay={300}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: '700', color: 'var(--black)', marginBottom: '12px' }}>
                  ✨ Why Join Us?
                </h3>
                <ul className="check-list" style={{ padding: 0 }}>
                  {benefits.map((benefit) => (
                    <li key={benefit} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--gray-600)' }}>
                      <FiCheck size={16} color="var(--orange)" style={{ strokeWidth: 2.5 }} />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              {/* Contact Details */}
              <ScrollReveal direction="up" delay={350}>
                <div style={{
                  padding: '20px',
                  background: 'var(--gray-50)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: '700', color: 'var(--black)' }}>📩 Contact Details</h4>
                  <span style={{ fontSize: '13.5px', color: 'var(--gray-600)' }}>
                    Email: <a href="mailto:jaccreationhouse@gmail.com" style={{ color: 'var(--orange)', textDecoration: 'none', fontWeight: '600' }}>jaccreationhouse@gmail.com</a>
                  </span>
                  <span style={{ fontSize: '13.5px', color: 'var(--gray-600)' }}>
                    Phone: <a href="tel:7338891367" style={{ color: 'var(--orange)', textDecoration: 'none', fontWeight: '600' }}>7338891367</a>
                  </span>
                </div>
              </ScrollReveal>

              {/* Apply Action */}
              <ScrollReveal direction="up" delay={400} style={{ marginTop: '10px' }}>
                <a 
                  href="https://forms.gle/vNz9mRHVJhjYXjen8" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-orange" 
                  style={{ padding: '16px 36px', fontSize: '16px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
                >
                  🚀 Apply For Internship
                </a>
              </ScrollReveal>
            </div>

            {/* Right Side (Desktop) / Top (Mobile): Image Poster */}
            <ScrollReveal direction="left" delay={100} style={{ flex: 1, width: '100%', maxWidth: '440px', margin: '0 auto' }}>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid var(--card-border)',
                boxShadow: 'var(--shadow-xl)',
                background: 'var(--gray-50)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <img 
                  src={internshipProgram} 
                  alt="Internship Program Flyer" 
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} 
                />
              </div>
            </ScrollReveal>

          </div>
        </div>
      </main>
    </div>
  );
}
