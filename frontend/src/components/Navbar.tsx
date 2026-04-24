import Link from 'next/link';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { logout } from '@/app/login/actions';
import styles from './Navbar.module.css';

export default async function Navbar() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('token');
  let username = null;
  let role = null;

  if (tokenCookie && tokenCookie.value) {
    try {
      const decoded: any = jwtDecode(tokenCookie.value);
      username = decoded.username;
      role = decoded.role;
    } catch (e) {
      console.error('Failed to decode token');
    }
  }

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        Impact<span>Golf</span>
      </Link>
      
      <div className={styles.navLinks}>
        <Link href="/concept" className={styles.link}>How it Works</Link>
        <Link href="/charities" className={styles.link}>Charities</Link>
        <Link href="/draws" className={styles.link}>Monthly Draws</Link>
        <Link href="/subscribe" className={styles.link}>Subscription</Link>
      </div>

      <div className={styles.actions}>
        {username ? (
          <>
            <span className={styles.link} style={{ marginRight: '15px' }}>Welcome, {username}</span>
            {role === 'admin' && (
              <Link href="/admin" className={styles.loginBtn} style={{ marginRight: '10px', backgroundColor: '#6366f1', color: 'white' }}>Admin Panel</Link>
            )}
            <Link href="/dashboard" className={styles.loginBtn}>Dashboard</Link>
            <form action={logout} style={{ display: 'inline' }}>
              <button type="submit" className={styles.subscribeBtn}>Log Out</button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className={styles.loginBtn}>Log In</Link>
            <Link href="/subscribe" className={styles.subscribeBtn}>Subscribe</Link>
          </>
        )}
      </div>
    </nav>
  );
}
