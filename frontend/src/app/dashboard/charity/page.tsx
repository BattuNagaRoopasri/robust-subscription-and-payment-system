'use client';
import { useState } from 'react';
import styles from './page.module.css';

const MOCK_CHARITIES = [
  { id: '1', name: 'First Tee Foundation', desc: 'Impacting the lives of young people through the game of golf.' },
  { id: '2', name: 'Make-A-Wish', desc: 'Creating life-changing wishes for children with critical illnesses.' },
  { id: '3', name: 'Local Youth Sports', desc: 'Supporting local youth sports programs and equipment.' },
];

export default function CharityPage() {
  const [selectedCharity, setSelectedCharity] = useState('1');
  const [percentage, setPercentage] = useState('10');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>My Impact</h1>
      <p className={styles.subtitle}>Choose the charity you want to support with your subscription.</p>

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
    </div>
  );
}
