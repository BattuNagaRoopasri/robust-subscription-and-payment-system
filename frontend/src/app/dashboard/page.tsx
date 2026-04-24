import styles from './page.module.css';
import { Target, Trophy, Heart } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Welcome back, Golfer</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Target className={styles.iconPrimary} /></div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Subscription Status</p>
            <p className={styles.statValue}>Active (Pro Plan)</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}><Heart className={styles.iconAccent} /></div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Charity Impact</p>
            <p className={styles.statValue}>$45.00</p>
            <p className={styles.statSubtext}>To: First Tee Foundation</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}><Trophy className={styles.iconSecondary} /></div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Current Entries</p>
            <p className={styles.statValue}>5 Scores</p>
            <p className={styles.statSubtext}>Ready for next draw</p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Activity</h2>
        <div className={styles.card}>
          <p className={styles.emptyState}>No recent activity to show. Add a score to get started!</p>
        </div>
      </div>
    </div>
  );
}
