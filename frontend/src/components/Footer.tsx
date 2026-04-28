import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.content}`}>
        <div className={styles.column}>
          <Link href="/" className={styles.logo}>
            Impact<span>Golf</span>
          </Link>
          <p className={styles.description}>
            Transforming your golf scores into positive charitable impact and exciting monthly rewards.
          </p>
        </div>
        
        <div className={styles.column}>
          <h4 className={styles.title}>Platform</h4>
          <Link href="/draws" className={styles.link}>Monthly Draws</Link>
          <Link href="/leaderboard" className={styles.link}>Leaderboard</Link>
        </div>

        <div className={styles.column}>
          <h4 className={styles.title}>Impact</h4>
          <Link href="/charities" className={styles.link}>Our Charities</Link>
          <Link href="/impact-report" className={styles.link}>Impact Report</Link>
          <Link href="/nominate" className={styles.link}>Nominate a Charity</Link>
        </div>

        <div className={styles.column}>
          <h4 className={styles.title}>Legal</h4>
          <Link href="/terms" className={styles.link}>Terms & Conditions</Link>
          <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
          <Link href="/contact" className={styles.link}>Contact Us</Link>
        </div>
      </div>
      
      <div className={`container ${styles.bottom}`}>
        <p>&copy; {new Date().getFullYear()} ImpactGolf. All rights reserved. Not affiliated with any official golf organization.</p>
      </div>
    </footer>
  );
}
