"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    const email = String(fd.get('email') || '');
    const password = String(fd.get('password') || '');
    if (isSignup) {
      const confirm = String(fd.get('confirm') || '');
      if (password !== confirm) {
        alert('Passwords do not match');
        setLoading(false);
        return;
      }
    }

    const payload: any = { email, password };
    if (isSignup) {
      payload.username = String(fd.get('username') || email.split('@')[0]);
      payload.selectedCharity = String(fd.get('charity') || '1');
    }

    const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Authentication failed');
        setLoading(false);
        return;
      }

      // token cookie set by server route; navigate to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      alert(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>{isSignup ? 'Create Account' : 'Welcome Back'}</h1>
        <p className={styles.subtitle}>{isSignup ? 'Fill the details to create your account.' : 'Sign in to your ImpactGolf account or create a new one.'}</p>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          {isSignup && (
            <div className={styles.inputGroup}>
              <label htmlFor="username" className={styles.label}>Username</label>
              <input id="username" name="username" type="text" required className={styles.input} />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input id="email" name="email" type="email" required className={styles.input} />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input id="password" name="password" type="password" required className={styles.input} />
          </div>

          {isSignup && (
            <div className={styles.inputGroup}>
              <label htmlFor="confirm" className={styles.label}>Confirm Password</label>
              <input id="confirm" name="confirm" type="password" required className={styles.input} />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="charity" className={styles.label}>Support a Charity (Signup Only)</label>
            <select id="charity" name="charity" className={styles.input} style={{ backgroundColor: 'var(--color-bg-base)' }}>
              <option value="1">First Tee Foundation</option>
              <option value="2">Make-A-Wish</option>
              <option value="3">Local Youth Sports</option>
              <option value="4">Ocean Conservancy</option>
              <option value="5">Community Youth Golf Fund</option>
              <option value="6">Clean Greens Initiative</option>
              <option value="7">Women in Golf Network</option>
            </select>
          </div>
          
          <div className={styles.actions}>
            {!isSignup ? (
              <>
                <button type="submit" className={styles.primaryBtn} disabled={loading}>{loading ? 'Working...' : 'Log In'}</button>
                <button type="button" onClick={() => setIsSignup(true)} className={styles.secondaryBtn}>Sign Up</button>
              </>
            ) : (
              <>
                <button type="submit" className={styles.primaryBtn} disabled={loading}>{loading ? 'Working...' : 'Create Account'}</button>
                <button type="button" onClick={() => setIsSignup(false)} className={styles.secondaryBtn}>Back to Login</button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
