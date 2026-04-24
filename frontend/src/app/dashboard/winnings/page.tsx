'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import { fetchMyVerifications, uploadProof } from './actions';

export default function WinningsPage() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [drawMonth, setDrawMonth] = useState('October 2023');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    setLoading(true);
    const data = await fetchMyVerifications();
    setVerifications(data);
    setLoading(false);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError('Please select an image file first.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, etc).');
      return;
    }

    setUploading(true);

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = event.target?.result as string;
      
      const result = await uploadProof(drawMonth, base64String);
      
      if (result.status === 'error') {
        setError(result.message);
      } else {
        setSuccess('Proof uploaded successfully! Awaiting Admin review.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        await loadVerifications();
      }
      setUploading(false);
    };
    reader.onerror = () => {
      setError('Failed to read file.');
      setUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Winnings & Verification</h1>
      <p className={styles.subtitle}>Upload proof of your scores to claim your monthly draw winnings.</p>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Upload Proof of Score</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          Please upload a clear screenshot of your official golf club or handicap app showing the scores for the winning dates.
        </p>

        <form onSubmit={handleUpload} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="drawMonth" className={styles.label}>Draw Month</label>
            <select 
              id="drawMonth" 
              className={styles.input}
              value={drawMonth}
              onChange={e => setDrawMonth(e.target.value)}
            >
              <option value="October 2023">October 2023</option>
              <option value="September 2023">September 2023</option>
              <option value="August 2023">August 2023</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="proof" className={styles.label}>Screenshot Image</label>
            <input 
              type="file" 
              id="proof" 
              accept="image/*"
              className={styles.input}
              ref={fileInputRef}
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Submit Proof for Verification'}
          </button>

          {error && <p className={styles.errorText}>{error}</p>}
          {success && <p className={styles.successText}>{success}</p>}
        </form>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>My Verification Status</h2>
        
        {loading ? (
          <p className={styles.emptyState}>Loading...</p>
        ) : verifications.length === 0 ? (
          <p className={styles.emptyState}>You haven't submitted any proofs yet.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date Submitted</th>
                  <th>Draw Month</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {verifications.map((v) => (
                  <tr key={v._id}>
                    <td>{new Date(v.createdAt).toLocaleDateString()}</td>
                    <td>{v.drawMonth}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[v.status.replace(/\s+/g, '')]}`}>
                        {v.status}
                      </span>
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
