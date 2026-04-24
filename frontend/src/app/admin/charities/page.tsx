'use client';
import { useState, useEffect } from 'react';
import styles from '../page.module.css';
import { fetchAdminCharities, createAdminCharity, updateAdminCharity, deleteAdminCharity } from '../actions';

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ _id: '', name: '', category: '', description: '', status: 'Active' });

  useEffect(() => {
    loadCharities();
  }, []);

  const loadCharities = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminCharities();
      if (res.status === 'success') {
        setCharities(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openForm = (charity: any = null) => {
    if (charity) {
      setForm(charity);
    } else {
      setForm({ _id: '', name: '', category: '', description: '', status: 'Active' });
    }
    setShowForm(true);
  };

  const closeForm = () => setShowForm(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (form._id) {
        // Update
        const res = await updateAdminCharity(form._id, form);
        if (res.status === 'success') {
          setCharities(charities.map(c => c._id === form._id ? res.data : c));
        }
      } else {
        // Create
        const res = await createAdminCharity(form);
        if (res.status === 'success') {
          setCharities([...charities, res.data]);
        }
      }
      closeForm();
    } catch (err) {
      console.error(err);
      alert('Error saving charity');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this charity?')) return;
    try {
      const res = await deleteAdminCharity(id);
      if (res.status === 'success') {
        setCharities(charities.filter(c => c._id !== id));
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting charity');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Charity Management</h1>
      <p className={styles.subtitle}>Add, edit, or remove charities from the public directory and signup flow.</p>

      {showForm && (
        <div style={{ backgroundColor: 'var(--color-bg-base)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>{form._id ? 'Edit Charity' : 'Add New Charity'}</h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
            <input 
              required 
              placeholder="Name" 
              value={form.name} 
              onChange={(e) => setForm({...form, name: e.target.value})} 
              style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-primary)' }}
            />
            <input 
              required 
              placeholder="Category (e.g., Youth, Health)" 
              value={form.category} 
              onChange={(e) => setForm({...form, category: e.target.value})} 
              style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-primary)' }}
            />
            <textarea 
              placeholder="Description" 
              value={form.description} 
              onChange={(e) => setForm({...form, description: e.target.value})} 
              style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-primary)', minHeight: '80px' }}
            />
            <select 
              value={form.status} 
              onChange={(e) => setForm({...form, status: e.target.value})}
              style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-primary)' }}
            >
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
            </select>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" style={{ padding: '0.8rem 1.2rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Save</button>
              <button type="button" onClick={closeForm} style={{ padding: '0.8rem 1.2rem', backgroundColor: 'transparent', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.chartSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2 className={styles.sectionTitle}>Active Charities</h2>
          <button onClick={() => openForm()} style={{ padding: '0.6rem 1.2rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
            + Add New Charity
          </button>
        </div>

        {loading ? (
          <p>Loading charities...</p>
        ) : charities.length === 0 ? (
          <p>No charities found.</p>
        ) : (
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
              {charities.map(charity => (
                <tr key={charity._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{charity.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>{charity.category}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>${(charity.totalRaised || 0).toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}><span style={{ color: charity.status === 'Active' ? '#10b981' : '#ef4444', fontWeight: 600 }}>{charity.status}</span></td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openForm(charity)} style={{ padding: '0.4rem 0.8rem', backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-text-primary)' }}>Edit</button>
                    <button onClick={() => handleDelete(charity._id)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
