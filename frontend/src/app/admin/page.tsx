'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { fetchAdminStats } from './actions';

export default function AdminReportsPage() {
  const [stats, setStats] = useState({ totalUsers: 0, activeSubscriptions: 0, totalPrizePool: 0, charityContributions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetchAdminStats();
        if (res.status === 'success') {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Reports & Analytics</h1>
      <p className={styles.subtitle}>Overview of platform performance and metrics.</p>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Total Users</h3>
          <p className={styles.statValue}>{stats.totalUsers.toLocaleString()}</p>
        </div>
        
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Total Prize Pool</h3>
          <p className={styles.statValue}>${stats.totalPrizePool.toLocaleString()}</p>
        </div>

        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Charity Contributions</h3>
          <p className={styles.statValue}>${stats.charityContributions.toLocaleString()}</p>
        </div>
        
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Active Subscriptions</h3>
          <p className={styles.statValue}>{stats.activeSubscriptions.toLocaleString()}</p>
        </div>
      </div>

      <div className={styles.chartSection}>
        <h2 className={styles.sectionTitle}>Monthly Growth</h2>
        <div className={styles.chartPlaceholder}>
          <p style={{ color: 'var(--color-text-secondary)' }}>Growth Chart Visualization</p>
        </div>
      </div>
    </div>
  );
}
