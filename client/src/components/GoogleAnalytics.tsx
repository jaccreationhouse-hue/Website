import { useEffect, useState } from 'react';
import { fetchCmsSettings, loadWithFallback } from '../api/cmsClient';

export default function GoogleAnalytics() {
  const [analyticsId, setAnalyticsId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    loadWithFallback(() => fetchCmsSettings(), {})
      .then((settings) => {
        if (!mounted) return;

        const analyticsCandidate = settings as { analyticsId?: string; ['site.seo']?: { analyticsId?: string } };
        if (analyticsCandidate.analyticsId) {
          setAnalyticsId(analyticsCandidate.analyticsId);
          return;
        }

        if (analyticsCandidate['site.seo']?.analyticsId) {
          setAnalyticsId(analyticsCandidate['site.seo'].analyticsId);
        }
      })
      .catch(console.error);

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!analyticsId) return;

    // Check if scripts are already injected to avoid duplicates
    if (document.getElementById('ga-script-external')) return;

    // Inject external script
    const externalScript = document.createElement('script');
    externalScript.id = 'ga-script-external';
    externalScript.async = true;
    externalScript.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
    document.head.appendChild(externalScript);

    // Inject inline script
    const inlineScript = document.createElement('script');
    inlineScript.id = 'ga-script-inline';
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${analyticsId}');
    `;
    document.head.appendChild(inlineScript);

    return () => {
      // We generally don't remove analytics scripts once loaded,
      // as they track across the single-page app lifecycle.
    };
  }, [analyticsId]);

  return null; // This component does not render anything visible
}
