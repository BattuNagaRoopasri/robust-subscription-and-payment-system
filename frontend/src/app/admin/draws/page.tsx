'use client';
import { useState, useEffect } from 'react';
import styles from '../page.module.css';
import { fetchAdminDraws, simulateAdminDraw, publishAdminDraw } from '../actions';

export default function AdminDrawsPage() {
  const [drawLogic, setDrawLogic] = useState('random');
  const [simulatedWinners, setSimulatedWinners] = useState<any[] | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [drawHistory, setDrawHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDraws();
  }, []);

  const loadDraws = async () => {
    try {
      const res = await fetchAdminDraws();
      if (res.status === 'success') {
        setDrawHistory(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async () => {
    setSimulatedWinners(null);
    try {
      const res = await simulateAdminDraw();
      if (res.status === 'success') {
        setSimulatedWinners(res.data);
      } else {
        alert('Simulation failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error running simulation.');
    }
  };

  const publishResults = async () => {
    if (!simulatedWinners) return;
    setIsPublishing(true);
    try {
      const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
      const res = await publishAdminDraw(month, simulatedWinners);
      if (res.status === 'success') {
        alert('Draw results published! Winners have been notified.');
        setSimulatedWinners(null);
        loadDraws();
      } else {
        alert('Failed to publish results.');
      }
    } catch (err) {
      console.error(err);
      alert('Error publishing results.');
    } finally {
      setIsPublishing(false);
    }
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
              disabled={!simulatedWinners || isPublishing}
              style={{ flex: 1, padding: '0.8rem', backgroundColor: (simulatedWinners && !isPublishing) ? 'var(--color-primary)' : 'var(--color-bg-base)', border: 'none', borderRadius: '4px', cursor: (simulatedWinners && !isPublishing) ? 'pointer' : 'not-allowed', color: (simulatedWinners && !isPublishing) ? 'white' : 'var(--color-text-secondary)', fontWeight: 600, opacity: (simulatedWinners && !isPublishing) ? 1 : 0.5 }}
            >
              {isPublishing ? 'Publishing...' : 'Publish Results'}
            </button>
          </div>
        </div>
      </div>

      {simulatedWinners && (
        <div className={styles.chartSection} style={{ borderLeft: '4px solid #10b981', marginBottom: '2rem' }}>
          <h2 className={styles.sectionTitle}>Simulation Results</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>These results are strictly for preview and have not been published.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {simulatedWinners.length === 0 ? (
              <p>No winners drawn (possibly no active users).</p>
            ) : (
              simulatedWinners.map((winner, index) => (
                <div key={index} style={{ padding: '1rem', backgroundColor: 'var(--color-bg-base)', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                  <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>{winner.matchType}</h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>Winner: {winner.user.username} ({winner.user.email}) - Prize: ${winner.prizeAmount}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className={styles.chartSection}>
        <h2 className={styles.sectionTitle}>Draw History</h2>
        {loading ? (
          <p>Loading history...</p>
        ) : drawHistory.length === 0 ? (
          <p>No published draws yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '1rem' }}>Month</th>
                <th style={{ padding: '1rem' }}>Date Executed</th>
                <th style={{ padding: '1rem' }}>Total Winners</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {drawHistory.map(draw => (
                <tr key={draw._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{draw.month}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>{new Date(draw.dateExecuted).toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>{draw.winners.length}</td>
                  <td style={{ padding: '1rem' }}><span style={{ color: '#10b981', fontWeight: 600 }}>{draw.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
