import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiArrowRight,
  FiChevronDown,
  FiMoon,
  FiPhone,
  FiSun,
} from 'react-icons/fi';
import logoImageDark from '../assets/websitelogo_dark.webp';
import { services } from '../data/services';

const primaryLinks = [
  { id: 'nav-home', label: 'Home', path: '/' },
  { id: 'nav-about', label: 'About', path: '/about' },
  { id: 'nav-portfolio', label: 'Portfolio', path: '/portfolio' },
  { id: 'nav-programs', label: 'Our Programs', path: '/programs' },
  { id: 'nav-careers', label: 'Careers', path: '/careers', badge: "We're Hiring" }
];

export default function Navbar() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
  const location = useLocation();
  const isActivePath = (path: string) => path === '/'
    ? location.pathname === '/'
    : location.pathname === path || location.pathname.startsWith(`${path}/`);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const closeTimer = window.setTimeout(() => {
      setIsOpen(false);
      setServicesOpen(false);
      setDesktopServicesOpen(false);
    }, 0);

    return () => window.clearTimeout(closeTimer);
  }, [location.pathname]);

  return (
    <>
      <nav aria-label="Primary navigation">
        <div className="nav-inner">
          <Link to="/" className="logo">
            <img className="logo-mark" src={logoImageDark} alt="JAC Media Land Logo" />
            <span>
              <span className="logo-text">JAC Media Land</span>
              <span className="logo-sub">making sense</span>
            </span>
          </Link>

          <ul className="nav-links">
            {primaryLinks.slice(0, 3).map((link) => (
              <li key={link.path}>
                <Link id={link.id} to={link.path} className={isActivePath(link.path) ? 'active' : ''}>{link.label}</Link>
              </li>
            ))}
            <li
              className={`has-dropdown ${desktopServicesOpen ? 'open' : ''}`}
              onMouseEnter={() => setDesktopServicesOpen(true)}
              onMouseLeave={() => setDesktopServicesOpen(false)}
              onFocusCapture={() => setDesktopServicesOpen(true)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setDesktopServicesOpen(false);
                }
              }}
            >
              <Link
                id="nav-services"
                to="/services"
                className={location.pathname.startsWith('/services') ? 'active' : ''}
                aria-haspopup="true"
                aria-expanded={desktopServicesOpen}
                aria-controls="desktop-services-menu"
              >
                <span>Our Services</span>
                <FiChevronDown className="nav-services-chevron" size={14} aria-hidden="true" />
              </Link>
              <div className="dropdown" id="desktop-services-menu">
                <div className="services-dropdown-header">
                  <span>Our Services</span>
                  <p>Focused expertise, connected around your goals.</p>
                </div>
                <div className="services-dropdown-grid">
                  {services.map(({ title, subtitle, path, Icon }) => (
                    <Link to={path} key={path} className={isActivePath(path) ? 'active' : ''}>
                      <span className="dd-icon"><Icon aria-hidden="true" /></span>
                      <span><span className="dd-title">{title}</span><span className="dd-sub">{subtitle}</span></span>
                    </Link>
                  ))}
                </div>
                <Link to="/services" className={`services-dropdown-all ${location.pathname === '/services' ? 'active' : ''}`}>
                  <span>View all services</span>
                  <FiArrowRight aria-hidden="true" />
                </Link>
              </div>
            </li>
            {primaryLinks.slice(3).map((link) => (
              <li key={link.path}>
                <Link id={link.id} to={link.path} className={isActivePath(link.path) ? 'active' : ''}>
                  <span>{link.label}</span>
                  {link.badge && <span className="nav-careers-dot" aria-label={link.badge} />}
                </Link>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setTheme(current => current === 'light' ? 'dark' : 'light')}
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark'
              ? <FiSun className="theme-toggle-icon" size={18} aria-hidden="true" />
              : <FiMoon className="theme-toggle-icon" size={18} aria-hidden="true" />}
          </button>

          <Link to="/contact" className={`nav-contact ${isActivePath('/contact') ? 'active' : ''}`}>
            <FiPhone size={16} style={{ strokeWidth: 2.2 }} aria-hidden="true" />
            Contact
          </Link>

          <button
            onClick={() => setIsOpen(current => !current)}
            className={`hamburger ${isOpen ? 'open' : ''}`}
            aria-label="Toggle mobile menu"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-navigation"
        className={`mobile-menu ${isOpen ? 'open' : ''}`}
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <ul className="mobile-nav-links">
          {primaryLinks.slice(0, 3).map((link) => (
            <li key={link.path}>
              <Link to={link.path} className={isActivePath(link.path) ? 'active' : ''}>{link.label}</Link>
            </li>
          ))}
          <li>
            <button
              className={`mobile-services-toggle ${servicesOpen ? 'open' : ''} ${location.pathname.startsWith('/services') ? 'active' : ''}`}
              onClick={() => setServicesOpen(current => !current)}
              aria-expanded={servicesOpen}
              aria-controls="mobile-services-menu"
            >
              Our Services
              <FiChevronDown size={16} style={{ strokeWidth: 2.5 }} aria-hidden="true" />
            </button>
            <div id="mobile-services-menu" className={`mobile-dropdown ${servicesOpen ? 'open' : ''}`} aria-hidden={!servicesOpen}>
              <Link to="/services" className={`mobile-dropdown-all ${location.pathname === '/services' ? 'active' : ''}`}>
                <span>View all services</span>
                <FiArrowRight aria-hidden="true" />
              </Link>
              {services.map(({ title, subtitle, path, Icon }) => (
                <Link to={path} key={path} className={isActivePath(path) ? 'active' : ''}>
                  <span className="mobile-dd-icon"><Icon aria-hidden="true" /></span>
                  <span className="mobile-dd-copy">
                    <strong>{title}</strong>
                    <small>{subtitle}</small>
                  </span>
                </Link>
              ))}
            </div>
          </li>
          {primaryLinks.slice(3).map((link) => (
            <li key={link.path}>
              <Link to={link.path} className={isActivePath(link.path) ? 'active' : ''}>
                <span>{link.label}</span>
                {link.badge && <span className="mobile-hiring-badge">{link.badge}</span>}
              </Link>
            </li>
          ))}
        </ul>

        <Link to="/contact" className={`mobile-contact-btn ${isActivePath('/contact') ? 'active' : ''}`}>
          <FiPhone size={16} style={{ strokeWidth: 2.2 }} aria-hidden="true" />
          Get in Touch
        </Link>
      </div>
    </>
  );
}
