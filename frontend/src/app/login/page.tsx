"use client";

import { useState } from 'react';
import Link from 'next/link';
import { login, signup } from './actions';
import styles from './page.module.css';

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>{isSignup ? 'Create Account' : 'Welcome Back'}</h1>
        <p className={styles.subtitle}>{isSignup ? 'Fill the details to create your account.' : 'Sign in to your ImpactGolf account or create a new one.'}</p>
        
        <form className={styles.form}>
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
                <button formAction={login} className={styles.primaryBtn}>Log In</button>
                <button type="button" onClick={() => setIsSignup(true)} className={styles.secondaryBtn}>Sign Up</button>
              </>
            ) : (
              <>
                <button formAction={signup} className={styles.primaryBtn}>Create Account</button>
                <button type="button" onClick={() => setIsSignup(false)} className={styles.secondaryBtn}>Back to Login</button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
