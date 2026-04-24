import Link from 'next/link';
import { Heart, Trophy, Target } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent} animate-fade-in`}>
          <h1 className={styles.title}>
            Turn Your <span className="text-gradient">Scores</span> Into <span className="text-gradient">Impact</span>
          </h1>
          <p className={styles.subtitle}>
            The platform that rewards your performance while supporting the causes you care about. Join our monthly draws, track your progress, and make a difference with every round.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/subscribe" className={styles.primaryBtn}>
              Start Making an Impact
            </Link>
            <Link href="/concept" className={styles.secondaryBtn}>
              How it Works
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={`container ${styles.featureGrid}`}>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <Target size={32} />
            </div>
            <h3 className={styles.featureTitle}>Track Performance</h3>
            <p className={styles.featureDesc}>
              Log your last 5 Stableford scores. Simple, intuitive entry designed to keep you focused on improving.
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <Heart size={32} />
            </div>
            <h3 className={styles.featureTitle}>Support Charities</h3>
            <p className={styles.featureDesc}>
              A portion of every subscription goes directly to a charity of your choice. Play for a purpose.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <Trophy size={32} />
            </div>
            <h3 className={styles.featureTitle}>Monthly Rewards</h3>
            <p className={styles.featureDesc}>
              Your scores enter you into our monthly algorithmic draws. Match numbers to win from the prize pool.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.spotlight}>
        <div className={styles.spotlightContainer}>
          <div className={styles.spotlightHeader}>
            <h2 className={styles.spotlightTitle}>Featured Charity Spotlight</h2>
            <p className={styles.subtitle}>See the direct impact of your contributions.</p>
          </div>
          
          <div className={styles.spotlightCard}>
            <div className={styles.spotlightImage}></div>
            <div className={styles.spotlightContent}>
              <span className={styles.spotlightTag}>Charity of the Month</span>
              <h3 className={styles.spotlightCharityName}>First Tee Foundation</h3>
              <p className={styles.spotlightDesc}>
                Impacting the lives of young people by providing educational programs that build character, instill life-enhancing values and promote healthy choices through the game of golf. 
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link href="/charities" className={styles.primaryBtn}>
                  Donate Directly
                </Link>
                <Link href="/charities" className={styles.secondaryBtn}>
                  View All Charities
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
