'use client';
import { useState, useEffect } from 'react';
import styles from '../page.module.css';
import { fetchAdminUsers, updateAdminUser } from '../actions';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ role: '', subscriptionStatus: '' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminUsers();
      if (res.status === 'success') {
        setUsers(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.username && u.username.toLowerCase().includes(search.toLowerCase())) || 
    (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const startEdit = (user: any) => {
    setEditingUserId(user._id);
    setEditForm({ role: user.role || 'user', subscriptionStatus: user.subscriptionStatus || 'inactive' });
  };

  const cancelEdit = () => {
    setEditingUserId(null);
  };

  const saveEdit = async (id: string) => {
    try {
      const res = await updateAdminUser(id, editForm);
      if (res.status === 'success') {
        setUsers(users.map(u => u._id === id ? res.data : u));
        setEditingUserId(null);
      } else {
        alert('Failed to update user');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating user');
    }
  };

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

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '1rem' }}>Name / Email</th>
                <th style={{ padding: '1rem' }}>Role</th>
                <th style={{ padding: '1rem' }}>Subscription</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => {
                const isEditing = editingUserId === user._id;
                
                return (
                  <tr key={user._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600 }}>{user.username}</div>
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{user.email}</div>
                    </td>
                    
                    <td style={{ padding: '1rem' }}>
                      {isEditing ? (
                        <select 
                          value={editForm.role} 
                          onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                          style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-primary)' }}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span style={{ 
                          backgroundColor: user.role === 'admin' ? 'rgba(59, 130, 246, 0.1)' : 'var(--color-bg-base)',
                          color: user.role === 'admin' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          fontWeight: 600
                        }}>
                          {user.role || 'user'}
                        </span>
                      )}
                    </td>
                    
                    <td style={{ padding: '1rem' }}>
                      {isEditing ? (
                        <select 
                          value={editForm.subscriptionStatus} 
                          onChange={(e) => setEditForm({...editForm, subscriptionStatus: e.target.value})}
                          style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-primary)' }}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="canceled">Canceled</option>
                          <option value="past_due">Past Due</option>
                        </select>
                      ) : (
                        <span style={{ 
                          color: user.subscriptionStatus === 'active' ? '#10b981' : 
                                 user.subscriptionStatus === 'canceled' ? '#f59e0b' : '#ef4444', 
                          fontWeight: 600 
                        }}>
                          {user.subscriptionStatus || 'inactive'}
                        </span>
                      )}
                    </td>
                    
                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                      {isEditing ? (
                        <>
                          <button onClick={() => saveEdit(user._id)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#10b981', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>Save</button>
                          <button onClick={cancelEdit} style={{ padding: '0.4rem 0.8rem', backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-text-primary)' }}>Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => startEdit(user)} style={{ padding: '0.4rem 0.8rem', backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-text-primary)' }}>Edit</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
