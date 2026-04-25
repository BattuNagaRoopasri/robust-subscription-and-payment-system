'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/scores`;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

export async function fetchScores() {
  const token = await getToken();
  if (!token) return [];

  try {
    const res = await fetch(API_URL, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch scores');
    return await res.json();
  } catch (error) {
    console.error('fetchScores error:', error);
    return [];
  }
}

export async function addScore(date: string, score: number) {
  const token = await getToken();
  if (!token) return { status: 'error', message: 'Unauthorized' };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date, score })
    });
    
    const data = await res.json();
    if (!res.ok) {
      return { status: 'error', message: data.message || 'Failed to add score' };
    }
    
    revalidatePath('/dashboard/scores');
    return { status: 'success' };
  } catch (error: any) {
    return { status: 'error', message: error.message };
  }
}

export async function deleteScore(id: string) {
  const token = await getToken();
  if (!token) return { status: 'error', message: 'Unauthorized' };

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!res.ok) {
      const data = await res.json();
      return { status: 'error', message: data.message || 'Failed to delete score' };
    }
    
    revalidatePath('/dashboard/scores');
    return { status: 'success' };
  } catch (error: any) {
    return { status: 'error', message: error.message };
  }
}
