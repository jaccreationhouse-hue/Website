import { FiMessageCircle } from 'react-icons/fi';
import { createWhatsAppGreeting } from '../utils/whatsapp';

export default function FloatingWhatsApp() {
  const whatsappUrl = createWhatsAppGreeting("Hi JAC MediaLand, I'd like to discuss a project.");

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp-widget"
      aria-label="Chat with us on WhatsApp"
    >
      <FiMessageCircle size={32} />
    </a>
  );
}
