import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { useCmsCollection } from '../api/useCmsCollection';
import { fallbackHighlights, type HighlightItem } from '../data/cmsSections';
import { HomeHeroIllustration, TeamIllustration } from '../components/Illustrations.tsx';
import { 
  FiPlay, 
  FiArrowDown, 
  FiWind, 
  FiDollarSign, 
  FiDroplet, 
  FiTool, 
  FiBookOpen, 
  FiHeart, 
  FiShield, 
  FiTruck, 
  FiVideo, 
  FiUsers, 
  FiHome, 
  FiShoppingBag, 
  FiMessageSquare, 
  FiGlobe, 
  FiAward, 
  FiMap,
  FiPenTool,
  FiSmartphone,
  FiCode,
  FiSearch,
  FiLayers,
  FiTrendingUp,
  FiClock,
  FiCoffee,
  FiSmile,
  FiZap,
  FiArrowUpRight,
  FiMessageCircle,
  FiCompass,
  FiFeather,
  FiCheckCircle,
  FiHeadphones
} from 'react-icons/fi';

export default function Home() {
  const highlights = useCmsCollection<HighlightItem>('highlights', fallbackHighlights);
  return (
    <div className="page" style={{ display: 'block' }}>

      {/* HERO SECTION */}
      <div className="hero-section hero-split-layout">
        <div className="hero-shapes-container">
          <div className="hero-shape circle hs-1"></div>
          <div className="hero-shape circle hs-2"></div>
          <div className="hero-shape square hs-3"></div>
          <div className="hero-shape circle hs-4"></div>
          <div className="hero-shape circle hs-5"></div>
          <div className="hero-shape square hs-6"></div>
        </div>
        
        <div className="hero-inner-split">
          <div className="hero-content-left">
            <ScrollReveal direction="up" delay={100}>
              <span className="hero-eyebrow-pill">
                JAC Media Land
              </span>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={200}>
              <h1 className="hero-heading-left">
                Come let's feed<br/>
                your <span className="highlight-dashed">Brand Today</span><br/>
                with innovation
              </h1>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={300}>
              <p className="hero-sub-left">
                Many of life's failures are people who did not realize how close they were to success when they gave up. We will help to bring your wildest ideas to life.
              </p>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={400}>
              <div className="hero-cta-group">
                <Link to="/contact" className="btn btn-primary cta-btn">Schedule a call</Link>
                <Link to="/about" className="hero-video-trigger" style={{ textDecoration: 'none' }} aria-label="Learn how JAC Media Land works">
                  <span className="hero-play-btn" aria-hidden="true">
                    <FiPlay size={18} fill="var(--orange)" color="var(--orange)" style={{ transform: "translateX(2px)" }} />
                  </span>
                  <span className="watch-text">Learn who we are and how we work</span>
                </Link>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={500}>
              <div className="hero-scroll-down">
                <span className="scroll-text">Scroll down</span>
                <FiArrowDown size={20} color="var(--orange)" style={{ strokeWidth: 2 }} />
              </div>
            </ScrollReveal>
          </div>
          
          <div className="hero-content-right">
            <ScrollReveal direction="none" delay={300}>
              <HomeHeroIllustration className="hero-floating-img" />
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* WHAT YOU CAN EXPECT */}
      <section className="marquee-wrapper expectation-marquee" aria-labelledby="expectation-marquee-title">
        <ScrollReveal direction="up">
          <div className="home-section-heading">
            <span className="chip">What We Promise</span>
            <h2 id="expectation-marquee-title">What You Can Expect</h2>
            <p>Thoughtful collaboration and dependable delivery at every stage of your project.</p>
          </div>
        </ScrollReveal>
        <div className="marquee-track" tabIndex={0}>
          {[...[
            { name: 'Clear Communication', icon: <FiMessageCircle /> },
            { name: 'Practical Strategy', icon: <FiCompass /> },
            { name: 'Thoughtful Design', icon: <FiFeather /> },
            { name: 'Reliable Delivery', icon: <FiCheckCircle /> },
            { name: 'Ongoing Support', icon: <FiHeadphones /> }
          ], ...[
            { name: 'Clear Communication', icon: <FiMessageCircle /> },
            { name: 'Practical Strategy', icon: <FiCompass /> },
            { name: 'Thoughtful Design', icon: <FiFeather /> },
            { name: 'Reliable Delivery', icon: <FiCheckCircle /> },
            { name: 'Ongoing Support', icon: <FiHeadphones /> }
          ]].map((capability, index) => (
            <div key={`${capability.name}-${index}`} className="marquee-pill marquee-icon-pill">
              <span className="marquee-pill-icon">{capability.icon}</span>
              <span>{capability.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SNIPPET */}
      <section className="section" style={{"background":"radial-gradient(circle at 10% 20%, rgba(249, 115, 22, 0.06) 0%, var(--white) 90%)","borderBottom":"1px solid var(--gray-100)"}}>
        <div className="wrap split" style={{"alignItems":"flex-start", "gap":"60px"}}>
          <ScrollReveal direction="right" delay={100}>
            <span className="chip" style={{"background":"var(--orange-light)","color":"var(--orange)","border":"none","marginBottom":"8px"}}>Something</span>
            <h2 className="section-title" style={{"textAlign":"left","fontSize":"46px","lineHeight":"1.1","fontWeight":"800","letterSpacing":"-1.5px","marginBottom":"0"}}>About Us</h2>
          </ScrollReveal>
          <ScrollReveal direction="left" delay={200} style={{"display":"flex","flexDirection":"column","gap":"16px"}}>
            <p style={{"fontSize":"15px","color":"var(--gray-600)","lineHeight":"1.8","marginBottom":"0"}}>
              We provide premium quality IT services to our clients through the latest technologies at an affordable cost.
            </p>
            <p style={{"fontSize":"15px","color":"var(--gray-600)","lineHeight":"1.8","marginBottom":"0"}}>
              Our goal is to dynamically grow your business, starting from the ground up or assisting in an already operating scenario.
            </p>
            
            {/* Premium callout card for the angry-less birds hook */}
            <div className="about-highlight-card" style={{"background":"rgba(249, 115, 22, 0.05)","border":"1.5px dashed rgba(249, 115, 22, 0.25)","borderRadius":"14px","padding":"20px 22px","display":"flex","gap":"16px","alignItems":"flex-start","marginTop":"12px","transition":"var(--transition)","cursor":"default"}}>
              <div style={{"width":"38px","height":"38px","background":"var(--orange-light)","borderRadius":"50%","display":"flex","alignItems":"center","justifyContent":"center","flexShrink":"0","fontSize":"18px"}}>🐦</div>
              <div>
                <h4 style={{"fontFamily":"'Syne', sans-serif","fontSize":"15px","fontWeight":"700","color":"var(--black)","marginBottom":"4px"}}>We are "angry-less birds"!</h4>
                <p style={{"fontSize":"13.5px","color":"var(--gray-600)","lineHeight":"1.6","marginBottom":"0"}}>We stay cool, collected, and friendly in every situation to answer your queries and provide the absolute best service.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* INDUSTRIES WE SERVE */}
      <section className="marquee-wrapper industries-marquee" style={{"background":"var(--white)","borderTop":"1px solid var(--card-border)"}} aria-labelledby="industries-marquee-title">
        <div>
          <ScrollReveal direction="up" delay={100}>
            <div className="home-section-heading">
              <span className="chip">Industry Experience</span>
              <h2 id="industries-marquee-title">Industries We Serve</h2>
              <p>Flexible digital services shaped around the needs of different sectors.</p>
            </div>
          </ScrollReveal>
          <div className="marquee-track marquee-track-reverse" tabIndex={0}>
            {[...[
              { name: 'Agriculture', icon: <FiWind size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Bank', icon: <FiDollarSign size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Chemical', icon: <FiDroplet size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Construction', icon: <FiTool size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Education', icon: <FiBookOpen size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Health', icon: <FiHeart size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Insurance', icon: <FiShield size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Logistics', icon: <FiTruck size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Media', icon: <FiVideo size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: "NGO's", icon: <FiUsers size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Real Estate', icon: <FiHome size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Retail Business', icon: <FiShoppingBag size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Social Network', icon: <FiMessageSquare size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Space', icon: <FiGlobe size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Sports', icon: <FiAward size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Tourism', icon: <FiMap size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> }
            ], ...[
              { name: 'Agriculture', icon: <FiWind size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Bank', icon: <FiDollarSign size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Chemical', icon: <FiDroplet size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Construction', icon: <FiTool size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Education', icon: <FiBookOpen size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Health', icon: <FiHeart size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Insurance', icon: <FiShield size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Logistics', icon: <FiTruck size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Media', icon: <FiVideo size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: "NGO's", icon: <FiUsers size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Real Estate', icon: <FiHome size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Retail Business', icon: <FiShoppingBag size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Social Network', icon: <FiMessageSquare size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Space', icon: <FiGlobe size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Sports', icon: <FiAward size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> },
              { name: 'Tourism', icon: <FiMap size={28} color="var(--orange)" style={{ strokeWidth: 1.6 }} /> }
            ]].map((ind, idx) => (
              <div className="marquee-pill marquee-icon-pill" key={`${ind.name}-${idx}`}>
                <span className="marquee-pill-icon">{ind.icon}</span>
                <span>{ind.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR HIGHLIGHTS */}
      <section className="home-section-padding highlights-showcase" style={{"background":"var(--gray-50)","borderTop":"1px solid var(--card-border)","borderBottom":"1px solid var(--card-border)"}}>
        <div style={{"maxWidth":"1100px","margin":"0 auto"}}>
          <ScrollReveal direction="up" delay={100}>
            <div className="home-section-heading">
              <span className="chip">Our Progress</span>
              <h2>Our Highlights</h2>
              <p>A growing body of work supported by a committed creative and technology team.</p>
            </div>
          </ScrollReveal>
          <div className="highlights-grid">
            {highlights.map((stat, idx) => (
              <ScrollReveal key={stat.slug} direction="up" delay={idx * 100}>
                <div className="highlight-card-premium">
                  <span className="highlight-index">0{idx + 1}</span>
                  <div className="highlight-number">{stat.value}</div>
                  <div className="highlight-label">{stat.title}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="home-section-padding what-we-do-showcase" style={{"background":"var(--white)"}}>
        <div style={{"maxWidth":"1100px","margin":"0 auto"}}>
          <ScrollReveal direction="up" delay={100}>
            <div className="home-section-heading">
              <span className="chip">Our Expertise</span>
              <h2>What We Do</h2>
              <p>Focused digital services that help businesses build stronger brands, products, and customer connections.</p>
            </div>
          </ScrollReveal>
          <div className="what-we-do-grid">
            {[
              { icon: <FiPenTool />, title: 'Graphic Design', desc: 'Distinctive visual communication that makes your brand easier to recognize.', link: '/services/graphic-design' },
              { icon: <FiSmartphone />, title: 'App Development', desc: 'Useful, reliable applications shaped around your users and business goals.', link: '/services/app-development' },
              { icon: <FiCode />, title: 'Website Development', desc: 'Responsive websites designed to communicate clearly and convert visitors.', link: '/services/website-development' },
              { icon: <FiSearch />, title: 'SEO Marketing', desc: 'Practical search strategies that improve visibility and attract relevant traffic.', link: '/services/seo-marketing' },
              { icon: <FiLayers />, title: 'UI / UX Design', desc: 'Clear, intuitive interfaces that make digital products easier to use.', link: '/services/ui-ux-design' },
              { icon: <FiTrendingUp />, title: 'Digital Marketing', desc: 'Focused campaigns that connect your business with the right audience.', link: '/services/digital-marketing' },
              { icon: <FiUsers />, title: 'Social Media', desc: 'Consistent content and community management that strengthen your presence.', link: '/services/social-media' }
            ].map((card, idx) => (
              <ScrollReveal key={card.title} direction="up" delay={(idx % 3) * 100}>
                <Link to={card.link} className="what-we-do-card">
                  <div className="what-we-do-card-top">
                    <span className="what-we-do-icon">{card.icon}</span>
                    <FiArrowUpRight className="what-we-do-arrow" aria-hidden="true" />
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                  <span className="what-we-do-link-text">Explore service</span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE ARE */}
      <section className="how-we-are-section">
        <div style={{"maxWidth":"1100px","margin":"0 auto"}}>
          <ScrollReveal direction="up" delay={100}>
            <div className="home-section-heading">
              <span className="chip">Our Culture</span>
              <h2>How We Are</h2>
              <p>A collaborative environment built around curiosity, flexibility, and meaningful growth.</p>
            </div>
          </ScrollReveal>
          <div className="how-we-are-grid">
              <ScrollReveal direction="right" delay={100} className="culture-featured-card">
                <TeamIllustration />
                <div className="culture-featured-overlay">
                  <span className="chip">Life at JAC</span>
                  <h3>Creative people. Shared purpose.</h3>
                </div>
              </ScrollReveal>
              {[
                { name: 'Like-minded Peers', desc: 'Work with curious people who share ideas openly.', icon: <FiUsers /> },
                { name: 'Flexible Timings', desc: 'Do your best work with room to manage your day.', icon: <FiClock /> },
                { name: 'Relax Zone', desc: 'Pause, recharge, and return with a fresh perspective.', icon: <FiCoffee /> },
                { name: 'Casual Dress Code', desc: 'Bring your ideas and feel comfortable being yourself.', icon: <FiSmile /> },
                { name: 'Career Growth', desc: 'Build skills through meaningful, hands-on opportunities.', icon: <FiTrendingUp /> },
                { name: 'Hyper-Growth Mode', desc: 'Move quickly, learn constantly, and create real impact.', icon: <FiZap /> }
              ].map((item, idx) => (
                <ScrollReveal key={item.name} direction="up" delay={(idx % 3) * 80}>
                  <div className="culture-card">
                    <div className="culture-card-icon">
                      {item.icon}
                    </div>
                    <div className="culture-card-copy">
                      <h3>{item.name}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
          </div>
        </div>
      </section>

    </div>
  );
}
