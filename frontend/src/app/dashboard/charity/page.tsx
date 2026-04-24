'use client';
import { useState } from 'react';
import styles from './page.module.css';

const MOCK_CHARITIES = [
  { id: '1', name: 'First Tee Foundation', desc: 'Impacting the lives of young people through the game of golf.' },
  { id: '2', name: 'Make-A-Wish', desc: 'Creating life-changing wishes for children with critical illnesses.' },
  { id: '3', name: 'Local Youth Sports', desc: 'Supporting local youth sports programs and equipment.' },
];

const MOCK_HISTORY = [
  { id: 'h1', date: 'Oct 01, 2023', amount: '$25.00', charity: 'First Tee Foundation' },
  { id: 'h2', date: 'Sep 01, 2023', amount: '$25.00', charity: 'First Tee Foundation' },
  { id: 'h3', date: 'Aug 01, 2023', amount: '$15.00', charity: 'Local Youth Sports' },
];

export default function CharityPage() {
  const [selectedCharity, setSelectedCharity] = useState('1');
  const [percentage, setPercentage] = useState('10');
  const [saved, setSaved] = useState(false);
  const [savedSettings, setSavedSettings] = useState<{ id: string, name: string, percentage: string } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const charity = MOCK_CHARITIES.find(c => c.id === selectedCharity);
    if (charity) {
      setSavedSettings({ id: charity.id, name: charity.name, percentage });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>My Impact</h1>
      <p className={styles.subtitle}>Manage your charity preferences and see your total impact.</p>

      {/* Impact Summary Section */}
      <div className={styles.statsGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className={styles.card} style={{ textAlign: 'center', padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Lifetime Donations</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>$485.00</p>
        </div>
        <div className={styles.card} style={{ textAlign: 'center', padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Current Subscription</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>Active</p>
        </div>
        <div className={styles.card} style={{ textAlign: 'center', padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Months Supported</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>14</p>
        </div>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Select Charity</h2>
            <div className={styles.charityGrid}>
              {MOCK_CHARITIES.map(charity => (
                <div 
                  key={charity.id} 
                  className={`${styles.charityCard} ${selectedCharity === charity.id ? styles.selected : ''}`}
                  onClick={() => setSelectedCharity(charity.id)}
                >
                  <div className={styles.radioWrapper}>
                    <input 
                      type="radio" 
                      name="charity" 
                      checked={selectedCharity === charity.id} 
                      onChange={() => setSelectedCharity(charity.id)}
                      className={styles.radio}
                    />
                  </div>
                  <div className={styles.charityInfo}>
                    <h3 className={styles.charityName}>{charity.name}</h3>
                    <p className={styles.charityDesc}>{charity.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Contribution Amount</h2>
            <p className={styles.helpText}>Minimum contribution is 10% of your subscription fee.</p>
            
            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <label htmlFor="percentage" className={styles.label}>Percentage</label>
                <span className={styles.percentageValue}>{percentage}%</span>
              </div>
              <input 
                type="range" 
                id="percentage" 
                min="10" 
                max="100" 
                value={percentage} 
                onChange={(e) => setPercentage(e.target.value)}
                className={styles.slider}
              />
              <div className={styles.sliderLabels}>
                <span>10% (Min)</span>
                <span>100% (Max)</span>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.submitBtn}>
              {saved ? 'Saved Successfully!' : 'Save Impact Settings'}
            </button>
          </div>
        </form>
      </div>

      {savedSettings && (
        <div className={styles.section} style={{ marginTop: '2rem' }}>
          <h2 className={styles.sectionTitle}>Your Saved Settings</h2>
          <div className={styles.card}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-primary)' }}>{savedSettings.name}</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              You are currently contributing <strong>{savedSettings.percentage}%</strong> of your subscription to this charity.
            </p>
          </div>
        </div>
      )}

      {/* Donation History Section */}
      <div className={styles.section} style={{ marginTop: '3rem' }}>
        <h2 className={styles.sectionTitle}>Recent Donations</h2>
        <div className={styles.card} style={{ padding: '0' }}>
          {MOCK_HISTORY.map((record, index) => (
            <div key={record.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: index < MOCK_HISTORY.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-primary)' }}>{record.charity}</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{record.date}</span>
              </div>
              <div style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>
                {record.amount}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
