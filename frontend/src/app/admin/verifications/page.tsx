'use client';
import { useState, useEffect } from 'react';
import styles from '../page.module.css';
import { fetchAllVerifications, updateVerificationStatus } from './actions';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    setLoading(true);
    const data = await fetchAllVerifications();
    setVerifications(data);
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    const result = await updateVerificationStatus(id, status);
    if (result.status === 'success') {
      await loadVerifications();
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Winner Verification</h1>
      <p className={styles.subtitle}>Review user score proofs and manage payout states.</p>

      <div className={styles.chartSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 className={styles.sectionTitle}>Submitted Proofs</h2>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : verifications.length === 0 ? (
          <p>No verifications submitted yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>User</th>
                <th style={{ padding: '1rem' }}>Draw Month</th>
                <th style={{ padding: '1rem' }}>Proof</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {verifications.map((v) => (
                <tr key={v._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}>{new Date(v.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>
                    {v.userId?.username || 'Unknown User'}
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 'normal' }}>
                      {v.userId?.email || ''}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>{v.drawMonth}</td>
                  <td style={{ padding: '1rem' }}>
                    <button 
                      onClick={() => setSelectedImage(`${API_BASE_URL}${v.proofImage}`)}
                      style={{ padding: '0.4rem 0.8rem', backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-text-primary)' }}
                    >
                      View Image
                    </button>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.85rem', 
                      fontWeight: 600,
                      backgroundColor: v.status === 'Pending Review' ? 'rgba(245, 158, 11, 0.1)' :
                                       v.status === 'Approved' ? 'rgba(16, 185, 129, 0.1)' :
                                       v.status === 'Paid' ? 'rgba(59, 130, 246, 0.1)' :
                                       'rgba(239, 68, 68, 0.1)',
                      color: v.status === 'Pending Review' ? '#f59e0b' :
                             v.status === 'Approved' ? '#10b981' :
                             v.status === 'Paid' ? '#3b82f6' :
                             '#ef4444'
                    }}>
                      {v.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {v.status === 'Pending Review' && (
                      <>
                        <button onClick={() => handleUpdateStatus(v._id, 'Approved')} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#10b981', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>Approve</button>
                        <button onClick={() => handleUpdateStatus(v._id, 'Rejected')} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>Reject</button>
                      </>
                    )}
                    {v.status === 'Approved' && (
                      <button onClick={() => handleUpdateStatus(v._id, 'Paid')} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#3b82f6', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>Mark Paid</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setSelectedImage(null)}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img src={selectedImage} alt="Proof" style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }} />
            <button 
              onClick={() => setSelectedImage(null)}
              style={{ position: 'absolute', top: '-40px', right: '0', backgroundColor: 'transparent', color: 'white', border: 'none', fontSize: '2rem', cursor: 'pointer' }}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
