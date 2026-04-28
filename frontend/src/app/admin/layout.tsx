import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import styles from './layout.module.css';
import jwtDecode from "jwt-decode";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const decoded: any = jwtDecode(token);
    if (decoded.role !== 'admin') {
      redirect('/dashboard');
    }
  } catch (error) {
    redirect('/login');
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Admin Panel</h2>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>Reports</Link>
          <Link href="/admin/users" className={styles.navLink}>Manage Users</Link>
          <Link href="/admin/draws" className={styles.navLink}>Draw Engine</Link>
          <Link href="/admin/charities" className={styles.navLink}>Charities</Link>
          <Link href="/admin/verifications" className={styles.navLink}>Verifications</Link>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
