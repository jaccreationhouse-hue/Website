
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import ScrollToTop from './components/ScrollToTop';
import GoogleAnalytics from './components/GoogleAnalytics';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Loader from './components/Loader';
import Home from './pages/Home';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import GraphicDesign from './pages/GraphicDesign';
import AppDevelopment from './pages/AppDevelopment';
import WebsiteDevelopment from './pages/WebsiteDevelopment';
import SeoMarketing from './pages/SeoMarketing';
import UiUxDesign from './pages/UiUxDesign';
import DigitalMarketing from './pages/DigitalMarketing';
import SocialMediaManagement from './pages/SocialMediaManagement';
import CmsServiceDetail from './pages/CmsServiceDetail';
import Programs from './pages/Programs';
import InternshipDetails from './pages/InternshipDetails';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import CareerOpening from './pages/CareerOpening';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';
import './index.css';

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <Loader onFinished={() => setLoading(false)} />;
  }

  return (
    <Router>
      <GoogleAnalytics />
      <FloatingWhatsApp />
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/graphic-design" element={<GraphicDesign />} />
        <Route path="/services/app-development" element={<AppDevelopment />} />
        <Route path="/services/website-development" element={<WebsiteDevelopment />} />
        <Route path="/services/seo-marketing" element={<SeoMarketing />} />
        <Route path="/services/ui-ux-design" element={<UiUxDesign />} />
        <Route path="/services/digital-marketing" element={<DigitalMarketing />} />
        <Route path="/services/social-media" element={<SocialMediaManagement />} />
        <Route path="/services/:slug" element={<CmsServiceDetail />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/internship" element={<InternshipDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/careers/:slug" element={<CareerOpening />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
