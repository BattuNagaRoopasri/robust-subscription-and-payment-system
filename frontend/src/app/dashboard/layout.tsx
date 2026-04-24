import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import styles from './layout.module.css';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If Supabase is not configured yet, we won't strictly block access to see the UI.
  // In a real env, we would enforce auth here.
  
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Dashboard</h2>
        </div>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navLink}>Overview</Link>
          <Link href="/dashboard/scores" className={styles.navLink}>My Scores</Link>
          <Link href="/dashboard/charity" className={styles.navLink}>My Charity</Link>
          <Link href="/dashboard/winnings" className={styles.navLink}>Winnings & Verification</Link>
          <Link href="/subscribe" className={styles.navLink}>Subscription</Link>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
