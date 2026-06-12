'use client';

import { clearCmsSession, cmsFetch, redirectToCmsLogin } from '../lib/api';

export default function SessionActions() {
  async function signOut() {
    const refreshToken = localStorage.getItem('cmsRefreshToken');
    try {
      if (refreshToken) {
        await cmsFetch('/v1/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken })
        });
      }
    } finally {
      clearCmsSession();
      redirectToCmsLogin();
    }
  }

  return <button className="topbar-button" onClick={() => void signOut()} type="button">Sign out</button>;
}
