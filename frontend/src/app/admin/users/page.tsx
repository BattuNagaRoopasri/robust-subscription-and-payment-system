'use client';
import { useState } from 'react';
import styles from '../page.module.css';

// Mock data for users
const MOCK_USERS = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', subStatus: 'Active', scores: 5 },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', subStatus: 'Lapsed', scores: 2 },
  { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'admin', subStatus: 'Active', scores: 1 },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>User Management</h1>
      <p className={styles.subtitle}>View and manage user accounts, roles, and subscriptions.</p>

      <div className={styles.chartSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 className={styles.sectionTitle}>Registered Users</h2>
          <input 
            type="text" 
            placeholder="Search users..." 
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-primary)' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Email</th>
              <th style={{ padding: '1rem' }}>Role</th>
              <th style={{ padding: '1rem' }}>Subscription</th>
              <th style={{ padding: '1rem' }}>Scores Logged</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem' }}>{user.name}</td>
                <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>{user.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    backgroundColor: user.role === 'admin' ? 'rgba(59, 130, 246, 0.1)' : 'var(--color-bg-base)',
                    color: user.role === 'admin' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    fontWeight: 600
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ color: user.subStatus === 'Active' ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                    {user.subStatus}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{user.scores}</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button style={{ padding: '0.4rem 0.8rem', backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-text-primary)' }}>Edit</button>
                  <button style={{ padding: '0.4rem 0.8rem', backgroundColor: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
