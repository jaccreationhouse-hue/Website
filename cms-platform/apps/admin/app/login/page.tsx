'use client';

import { FormEvent, useState } from 'react';
import { cmsFetch } from '../../lib/api';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export default function LoginPage() {
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setMessage('Signing in...');
    try {
      const tokens = await cmsFetch<Tokens>('/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: form.get('email'),
          password: form.get('password')
        })
      });
      localStorage.setItem('cmsAccessToken', tokens.accessToken);
      localStorage.setItem('cmsRefreshToken', tokens.refreshToken);
      setMessage('Signed in. Opening Website Sections...');
      window.location.assign('/collections');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Sign in failed');
    }
  }

  return (
    <section className="page narrow">
      <div className="page-heading"><div><span>Secure workspace</span><h1>Welcome back.</h1><p>Sign in to publish website content, review enquiries, and keep JAC Media Land up to date.</p></div></div>
      <form className="panel form" onSubmit={submit}>
        <label>Email<input name="email" type="email" required autoComplete="email" /></label>
        <label>Password<input name="password" type="password" required minLength={8} autoComplete="current-password" /></label>
        <button className="button" type="submit">Sign in</button>
        <p role="status">{message}</p>
      </form>
    </section>
  );
}
