import styles from './page.module.css';
import { Target, Trophy, Heart, Calendar } from 'lucide-react';
import { cookies } from 'next/headers';
import jwtDecode from 'jwt-decode';
import { fetchScores } from './scores/actions';

export default async function Dashboard() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('token');
  let username = 'Golfer';

  if (tokenCookie && tokenCookie.value) {
    try {
      const decoded: any = jwtDecode(tokenCookie.value);
      username = decoded.username || 'Golfer';
    } catch (e) {
      console.error('Failed to decode token');
    }
  }

  const scores = await fetchScores();

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Welcome back, {username}</h1>
      
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
            <p className={styles.statValue}>{scores.length} / 5 Scores</p>
            <p className={styles.statSubtext}>{scores.length === 5 ? 'Ready for next draw' : 'Log more scores'}</p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Activity</h2>
        <div className={styles.card}>
          {scores.length === 0 ? (
            <p className={styles.emptyState}>No recent activity to show. Add a score to get started!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {scores.map((score: any) => (
                <div key={score._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--color-bg-base)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '0.8rem', borderRadius: '50%' }}>
                    <Calendar size={20} color="#3b82f6" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Logged a Stableford Score of {score.score}</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Played on {new Date(score.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
