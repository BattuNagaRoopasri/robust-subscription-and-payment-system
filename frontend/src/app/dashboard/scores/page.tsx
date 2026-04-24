'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { fetchScores, addScore, deleteScore } from './actions';

export default function ScoresPage() {
  const [scores, setScores] = useState<any[]>([]);
  const [newScore, setNewScore] = useState('');
  const [newDate, setNewDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    setLoading(true);
    const data = await fetchScores();
    setScores(data);
    setLoading(false);
  };

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const scoreNum = parseInt(newScore, 10);
    if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 45) {
      setError('Score must be between 1 and 45.');
      return;
    }

    const result = await addScore(newDate, scoreNum);
    
    if (result.status === 'error') {
      setError(result.message);
      return;
    }

    setNewScore('');
    setNewDate('');
    await loadScores();
  };

  const handleDelete = async (id: string) => {
    const result = await deleteScore(id);
    if (result.status === 'error') {
      setError(result.message);
    } else {
      await loadScores();
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>My Scores</h1>
      <p className={styles.subtitle}>Enter your latest Stableford scores. We automatically keep your 5 most recent rounds for the monthly draw.</p>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Log a Round</h2>
        <form onSubmit={handleAddScore} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="date" className={styles.label}>Date Played</label>
              <input 
                type="date" 
                id="date" 
                required 
                className={styles.input}
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="score" className={styles.label}>Stableford Score</label>
              <input 
                type="number" 
                id="score" 
                min="1" 
                max="45" 
                required 
                className={styles.input}
                value={newScore}
                onChange={(e) => setNewScore(e.target.value)}
                placeholder="e.g. 36"
              />
            </div>
            <button type="submit" className={styles.submitBtn}>Add Score</button>
          </div>
          {error && <p className={styles.errorText}>{error}</p>}
        </form>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Recent Scores</h2>
          <span className={styles.badge}>{scores.length} / 5</span>
        </div>
        
        {loading ? (
          <p className={styles.emptyState}>Loading scores...</p>
        ) : scores.length === 0 ? (
          <p className={styles.emptyState}>No scores logged yet.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Stableford Score</th>
                  <th className={styles.actionsCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score) => (
                  <tr key={score._id}>
                    <td>{new Date(score.date).toLocaleDateString()}</td>
                    <td className={styles.scoreValue}>{score.score}</td>
                    <td className={styles.actionsCell}>
                      <button onClick={() => handleDelete(score._id)} className={styles.deleteBtn}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
