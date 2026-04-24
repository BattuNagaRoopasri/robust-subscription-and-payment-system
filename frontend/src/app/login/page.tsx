import Link from 'next/link';
import { login, signup } from './actions';
import styles from './page.module.css';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to your ImpactGolf account or create a new one.</p>
        
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input id="email" name="email" type="email" required className={styles.input} />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input id="password" name="password" type="password" required className={styles.input} />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="charity" className={styles.label}>Support a Charity (Signup Only)</label>
            <select id="charity" name="charity" className={styles.input} style={{ backgroundColor: 'var(--color-bg-base)' }}>
              <option value="1">First Tee Foundation</option>
              <option value="2">Make-A-Wish</option>
              <option value="3">Local Youth Sports</option>
              <option value="4">Ocean Conservancy</option>
            </select>
          </div>
          
          <div className={styles.actions}>
            <button formAction={login} className={styles.primaryBtn}>Log In</button>
            <button formAction={signup} className={styles.secondaryBtn}>Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}
