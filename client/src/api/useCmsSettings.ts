import { useEffect, useState } from 'react';
import { fetchCmsSettings } from './cmsClient';
import { fallbackContacts } from '../data/cmsSections';

export type CmsSiteSettings = {
  logoUrl: string;
  faviconUrl: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  address: string;
  socialMediaLinks: {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
  };
  footerContent: string;
};

const fallbackContact = fallbackContacts[0];

export const fallbackSiteSettings: CmsSiteSettings = {
  logoUrl: '',
  faviconUrl: '',
  companyName: 'JAC MediaLand',
  email: fallbackContact?.email || 'jaccreationhouse@gmail.com',
  phoneNumber: fallbackContact?.phone || '+91 73388 91367',
  address: fallbackContact?.address || '',
  socialMediaLinks: {
    linkedin: 'https://www.linkedin.com/in/jac-medialand-597111409/',
    twitter: 'https://x.com/vjcharles_off',
    facebook: 'https://www.facebook.com/profile.php?id=61586776786162',
    instagram: 'https://www.instagram.com/jac_medialand/'
  },
  footerContent: 'Copyright 2026 JAC MediaLand Pvt. Ltd. All rights reserved.'
};

export function useCmsSettings() {
  const [settings, setSettings] = useState<CmsSiteSettings>(fallbackSiteSettings);

  useEffect(() => {
    let active = true;

    void fetchCmsSettings()
      .then((result) => {
        if (!active) return;

        setSettings({
          ...fallbackSiteSettings,
          ...result,
          socialMediaLinks: {
            ...fallbackSiteSettings.socialMediaLinks,
            ...(result.socialMediaLinks || {})
          }
        });
      })
      .catch(() => {
        if (active) {
          setSettings(fallbackSiteSettings);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return settings;
}
