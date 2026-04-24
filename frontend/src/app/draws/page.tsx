import styles from './page.module.css';
import Link from 'next/link';

export default function DrawsPage() {
  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>The Monthly Draws</h1>
        <p className={styles.subtitle}>
          Turn your performance into rewards. Enter your Stableford scores to participate in our unique monthly prize pools.
        </p>
      </div>

      <div className={styles.grid}>
        {/* Draw Types & Prize Pool */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Draw Match Types</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            A fixed portion of every subscription contributes directly to the prize pool. Prizes are split equally among multiple winners in the same tier.
          </p>
          
          <div className={styles.tierList}>
            <div className={styles.tierItem}>
              <div className={styles.tierBadge}>5</div>
              <div className={styles.tierContent}>
                <h3>5-Number Match <span className={styles.jackpotBadge}>Jackpot</span></h3>
                <p><strong>40% of Prize Pool.</strong> If there are no 5-match winners in a month, the jackpot rolls over to the next month!</p>
              </div>
            </div>

            <div className={styles.tierItem}>
              <div className={styles.tierBadge}>4</div>
              <div className={styles.tierContent}>
                <h3>4-Number Match</h3>
                <p><strong>35% of Prize Pool.</strong> Does not roll over.</p>
              </div>
            </div>

            <div className={styles.tierItem}>
              <div className={styles.tierBadge}>3</div>
              <div className={styles.tierContent}>
                <h3>3-Number Match</h3>
                <p><strong>25% of Prize Pool.</strong> Does not roll over.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mechanics & Logic */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>How The System Works</h2>
          
          <div className={styles.infoSection}>
            <h3>Draw Logic Options</h3>
            <p>Our sophisticated draw engine operates using two distinct methodologies to ensure fairness and excitement:</p>
            <ul className={styles.infoList} style={{ marginTop: '0.5rem' }}>
              <li><strong>Random Generation:</strong> A standard, provably fair lottery-style random draw.</li>
              <li><strong>Algorithmic Draws:</strong> Advanced draws weighted by the most and least frequent user scores across the platform.</li>
            </ul>
          </div>

          <div className={styles.infoSection}>
            <h3>Operational Requirements</h3>
            <ul className={styles.infoList}>
              <li><strong>Monthly Cadence:</strong> Official draws are executed strictly once per month.</li>
              <li><strong>Simulated Pre-analysis:</strong> Our administrative team runs secure simulations and verifications before any results are officially published.</li>
              <li><strong>Transparency:</strong> Once published, winning scores and prize distributions are immediately visible on your dashboard.</li>
            </ul>
          </div>

          <div className={styles.infoSection}>
            <h3>Winner Verification</h3>
            <p>
              To claim a prize, winners must upload a verifiable screenshot of their official scores from their local golf platform or club system. Our team manually verifies every submission before payouts are processed.
            </p>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link href="/subscribe" style={{ display: 'inline-block', backgroundColor: 'var(--color-primary)', color: 'white', padding: '1rem 2rem', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '1.1rem', textDecoration: 'none' }}>
              Subscribe & Enter Now
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
