'use client';
import { useState } from 'react';
import styles from '../page.module.css';

export default function AdminDrawsPage() {
  const [drawLogic, setDrawLogic] = useState('random');
  const [simulated, setSimulated] = useState(false);

  const runSimulation = () => {
    alert(`Running ${drawLogic} draw simulation...`);
    setTimeout(() => setSimulated(true), 1000);
  };

  const publishResults = () => {
    alert('Draw results published! Winners have been notified.');
    setSimulated(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Draw Management</h1>
      <p className={styles.subtitle}>Configure, simulate, and publish the monthly prize draws.</p>

      <div className={styles.chartSection} style={{ marginBottom: '2rem' }}>
        <h2 className={styles.sectionTitle}>Draw Configuration</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Draw Logic</label>
            <select 
              value={drawLogic}
              onChange={(e) => setDrawLogic(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-primary)' }}
            >
              <option value="random">Random Generation (Standard)</option>
              <option value="algorithmic">Algorithmic (Weighted by Scores)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              onClick={runSimulation}
              style={{ flex: 1, padding: '0.8rem', backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-text-primary)', fontWeight: 600 }}
            >
              Run Simulation
            </button>
            <button 
              onClick={publishResults}
              disabled={!simulated}
              style={{ flex: 1, padding: '0.8rem', backgroundColor: simulated ? 'var(--color-primary)' : 'var(--color-bg-base)', border: 'none', borderRadius: '4px', cursor: simulated ? 'pointer' : 'not-allowed', color: simulated ? 'white' : 'var(--color-text-secondary)', fontWeight: 600, opacity: simulated ? 1 : 0.5 }}
            >
              Publish Results
            </button>
          </div>
        </div>
      </div>

      {simulated && (
        <div className={styles.chartSection} style={{ borderLeft: '4px solid #10b981' }}>
          <h2 className={styles.sectionTitle}>Simulation Results</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>These results are strictly for preview and have not been published.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-base)', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
              <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>5-Number Match (Jackpot)</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>No Winners. Rolling over to next month.</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-base)', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
              <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>4-Number Match</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>2 Winners - Jane Smith, Bob Wilson</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
