import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp, FaXTwitter } from 'react-icons/fa6';
import { FiMail, FiPhoneCall } from 'react-icons/fi';
import logoImageDark from '../assets/websitelogo_dark.webp';
import { useCmsSettings } from '../api/useCmsSettings';

export default function Footer() {
  const settings = useCmsSettings();
  const companyName = settings.companyName || 'JAC MediaLand';
  const logoSrc = settings.logoUrl || logoImageDark;
  const phoneHref = settings.phoneNumber ? `tel:${settings.phoneNumber.replace(/[^\d+]/g, '')}` : 'tel:+917338891367';
  const footerContent = settings.footerContent || 'Copyright 2026 JAC MediaLand Pvt. Ltd. All rights reserved.';
  const social = settings.socialMediaLinks;

  return (
    <footer className="modern-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="logo footer-logo">
              <img className="logo-mark" src={logoSrc} alt={`${companyName} Logo`} />
              <div>
                <span className="logo-text">{companyName}</span>
                <span className="logo-sub">IT Solutions</span>
              </div>
            </Link>
            <p className="footer-desc">Empowering businesses globally with cutting-edge digital solutions, robust engineering, and seamless user experiences.</p>
            <div className="footer-contact-links">
              <a href={`mailto:${settings.email}`}>
                <FiMail aria-hidden="true" />
                <span>{settings.email}</span>
              </a>
              <a href={phoneHref}>
                <FiPhoneCall aria-hidden="true" />
                <span>{settings.phoneNumber}</span>
              </a>
            </div>
            <div className="footer-social-card">
              <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${companyName} on Instagram`} className="fsocial-link fsocial-link--instagram">
                <FaInstagram />
              </a>
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${companyName} on LinkedIn`} className="fsocial-link fsocial-link--linkedin">
                <FaLinkedinIn />
              </a>
              <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label={`${companyName} on Facebook`} className="fsocial-link fsocial-link--facebook">
                <FaFacebookF />
              </a>
              <a href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${companyName} on X`} className="fsocial-link fsocial-link--twitter">
                <FaXTwitter />
              </a>
              <a href={`https://wa.me/${(settings.phoneNumber || '+917338891367').replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer" aria-label={`Contact ${companyName} on WhatsApp`} className="fsocial-link fsocial-link--whatsapp">
                <FaWhatsapp />
              </a>
            </div>

          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/programs">Our Programs</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Our Services</h4>
            <ul>
              <li><Link to="/services/graphic-design">Graphic Design</Link></li>
              <li><Link to="/services/app-development">App Development</Link></li>
              <li><Link to="/services/website-development">Website Development</Link></li>
              <li><Link to="/services/seo-marketing">SEO Marketing</Link></li>
              <li><Link to="/services/ui-ux-design">UI / UX Design</Link></li>
              <li><Link to="/services/digital-marketing">Digital Marketing</Link></li>
              <li><Link to="/services/social-media">Social Media Management</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Other Services</h4>
            <ul>
              <li><Link to="/more">JAC Construction</Link></li>
              <li><Link to="/more">JAC Cars</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{footerContent}</span>
          <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15" /></svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
