import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        Impact<span>Golf</span>
      </Link>
      
      <div className={styles.navLinks}>
        <Link href="/concept" className={styles.link}>How it Works</Link>
        <Link href="/charities" className={styles.link}>Charities</Link>
        <Link href="/draws" className={styles.link}>Monthly Draws</Link>
      </div>

      <div className={styles.actions}>
        <Link href="/login" className={styles.loginBtn}>Log In</Link>
        <Link href="/subscribe" className={styles.subscribeBtn}>Subscribe</Link>
      </div>
    </nav>
  );
}
