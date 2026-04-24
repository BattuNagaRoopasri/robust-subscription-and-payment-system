'use server';

import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    cache: 'no-store', // Admin actions should not be cached
  });

  const data = await response.json();
  return data;
}

// --- Stats ---
export async function fetchAdminStats() {
  return await fetchWithAuth('/api/admin/stats');
}

// --- Users ---
export async function fetchAdminUsers() {
  return await fetchWithAuth('/api/admin/users');
}

export async function updateAdminUser(id: string, updates: any) {
  return await fetchWithAuth(`/api/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

// --- Charities ---
export async function fetchAdminCharities() {
  return await fetchWithAuth('/api/admin/charities');
}

export async function createAdminCharity(charity: any) {
  return await fetchWithAuth('/api/admin/charities', {
    method: 'POST',
    body: JSON.stringify(charity),
  });
}

export async function updateAdminCharity(id: string, charity: any) {
  return await fetchWithAuth(`/api/admin/charities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(charity),
  });
}

export async function deleteAdminCharity(id: string) {
  return await fetchWithAuth(`/api/admin/charities/${id}`, {
    method: 'DELETE',
  });
}

// --- Draws ---
export async function fetchAdminDraws() {
  return await fetchWithAuth('/api/admin/draws');
}

export async function simulateAdminDraw() {
  return await fetchWithAuth('/api/admin/draws/simulate', {
    method: 'POST',
  });
}

export async function publishAdminDraw(month: string, winners: any[]) {
  return await fetchWithAuth('/api/admin/draws/publish', {
    method: 'POST',
    body: JSON.stringify({ month, winners }),
  });
}
