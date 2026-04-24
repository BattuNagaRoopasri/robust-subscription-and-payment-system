'use client';
import { useState } from 'react';
import styles from './page.module.css';

// Mock data for demonstration purposes without Supabase connection
const MOCK_SCORES = [
  { id: '1', date: '2023-10-15', score: 36 },
  { id: '2', date: '2023-10-12', score: 32 },
  { id: '3', date: '2023-10-05', score: 41 },
];

export default function ScoresPage() {
  const [scores, setScores] = useState(MOCK_SCORES);
  const [newScore, setNewScore] = useState('');
  const [newDate, setNewDate] = useState('');
  const [error, setError] = useState('');

  const handleAddScore = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const scoreNum = parseInt(newScore, 10);
    if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 45) {
      setError('Score must be between 1 and 45.');
      return;
    }

    if (scores.some(s => s.date === newDate)) {
      setError('A score for this date already exists.');
      return;
    }

    const newScoreObj = {
      id: Math.random().toString(),
      date: newDate,
      score: scoreNum,
    };

    const updatedScores = [...scores, newScoreObj]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Keep only the latest 5 scores (oldest is replaced if > 5)
    if (updatedScores.length > 5) {
      updatedScores.length = 5;
    }

    setScores(updatedScores);
    setNewScore('');
    setNewDate('');
  };

  const handleDelete = (id: string) => {
    setScores(scores.filter(s => s.id !== id));
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
        
        {scores.length === 0 ? (
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
                  <tr key={score.id}>
                    <td>{new Date(score.date).toLocaleDateString()}</td>
                    <td className={styles.scoreValue}>{score.score}</td>
                    <td className={styles.actionsCell}>
                      <button onClick={() => handleDelete(score.id)} className={styles.deleteBtn}>Delete</button>
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
