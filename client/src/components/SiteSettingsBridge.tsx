import { useEffect } from 'react';
import { useCmsSettings } from '../api/useCmsSettings';

export default function SiteSettingsBridge() {
  const settings = useCmsSettings();

  useEffect(() => {
    const companyName = settings.companyName?.trim() || 'JAC MediaLand';
    document.title = `${companyName} - IT Solutions`;

    if (settings.faviconUrl) {
      let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = settings.faviconUrl;
    }

    const ogTitle = document.querySelector("meta[property='og:title']");
    if (ogTitle) {
      ogTitle.setAttribute('content', `${companyName} - IT Solutions`);
    }
  }, [settings.companyName, settings.faviconUrl]);

  return null;
}
