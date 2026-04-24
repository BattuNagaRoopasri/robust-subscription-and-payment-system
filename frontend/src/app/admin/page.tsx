'use client';
import styles from './page.module.css';

export default function AdminReportsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Reports & Analytics</h1>
      <p className={styles.subtitle}>Overview of platform performance and metrics.</p>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Total Users</h3>
          <p className={styles.statValue}>1,248</p>
          <span className={styles.statTrend positive}>+12% this month</span>
        </div>
        
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Total Prize Pool</h3>
          <p className={styles.statValue}>$15,420</p>
          <span className={styles.statTrend positive}>+8% this month</span>
        </div>

        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Charity Contributions</h3>
          <p className={styles.statValue}>$8,250</p>
          <span className={styles.statTrend positive}>+15% this month</span>
        </div>
        
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Active Subscriptions</h3>
          <p className={styles.statValue}>980</p>
          <span className={styles.statTrend positive}>+5% this month</span>
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
