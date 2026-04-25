'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/verifications`;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

export async function fetchMyVerifications() {
  const token = await getToken();
  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('fetchMyVerifications error:', error);
    return [];
  }
}

export async function uploadProof(drawMonth: string, proofImageBase64: string) {
  const token = await getToken();
  if (!token) return { status: 'error', message: 'Unauthorized' };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ drawMonth, proofImageBase64 })
    });
    
    const data = await res.json();
    if (!res.ok) {
      return { status: 'error', message: data.message || 'Failed to upload proof' };
    }
    
    revalidatePath('/dashboard/winnings');
    return { status: 'success' };
  } catch (error: any) {
    return { status: 'error', message: error.message };
  }
}
