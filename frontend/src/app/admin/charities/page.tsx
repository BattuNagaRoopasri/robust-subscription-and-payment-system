'use client';
import { useState } from 'react';
import styles from '../page.module.css';

export default function AdminCharitiesPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Charity Management</h1>
      <p className={styles.subtitle}>Add, edit, or remove charities from the public directory and signup flow.</p>

      <div className={styles.chartSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2 className={styles.sectionTitle}>Active Charities</h2>
          <button style={{ padding: '0.6rem 1.2rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
            + Add New Charity
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
              <th style={{ padding: '1rem' }}>Charity Name</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Total Raised</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={{ padding: '1rem', fontWeight: 600 }}>First Tee Foundation</td>
              <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>Youth</td>
              <td style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>$12,450</td>
              <td style={{ padding: '1rem' }}><span style={{ color: '#10b981', fontWeight: 600 }}>Active</span></td>
              <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button style={{ padding: '0.4rem 0.8rem', backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-text-primary)' }}>Edit</button>
                <button style={{ padding: '0.4rem 0.8rem', backgroundColor: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>Disable</button>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={{ padding: '1rem', fontWeight: 600 }}>Make-A-Wish</td>
              <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>Health</td>
              <td style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>$8,100</td>
              <td style={{ padding: '1rem' }}><span style={{ color: '#10b981', fontWeight: 600 }}>Active</span></td>
              <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button style={{ padding: '0.4rem 0.8rem', backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-text-primary)' }}>Edit</button>
                <button style={{ padding: '0.4rem 0.8rem', backgroundColor: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>Disable</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
