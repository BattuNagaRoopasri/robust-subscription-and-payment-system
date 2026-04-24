'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

const API_URL = 'http://localhost:5000/api/admin/verifications';

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

export async function fetchAllVerifications() {
  const token = await getToken();
  if (!token) return [];

  try {
    const res = await fetch(API_URL, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('fetchAllVerifications error:', error);
    return [];
  }
}

export async function updateVerificationStatus(id: string, status: string) {
  const token = await getToken();
  if (!token) return { status: 'error', message: 'Unauthorized' };

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    
    const data = await res.json();
    if (!res.ok) {
      return { status: 'error', message: data.message || 'Failed to update' };
    }
    
    revalidatePath('/admin/verifications');
    return { status: 'success' };
  } catch (error: any) {
    return { status: 'error', message: error.message };
  }
}
