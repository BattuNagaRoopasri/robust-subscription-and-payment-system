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
          
          <div className={styles.actions}>
            <button formAction={login} className={styles.primaryBtn}>Log In</button>
            <button formAction={signup} className={styles.secondaryBtn}>Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}
