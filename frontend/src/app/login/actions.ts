'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  let success = false;
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Login failed, backend response:', res.status, errorText);
      throw new Error('Invalid credentials');
    }
    
    const json = await res.json();
    if (json.token) {
      const cookieStore = await cookies();
      cookieStore.set('token', json.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7 });
      success = true;
    }
  } catch (error) {
    console.error('Login fetch error:', error);
    redirect('/login?message=Could not authenticate user')
  }

  if (success) {
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }
}

export async function signup(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    username: (formData.get('email') as string).split('@')[0], 
    selectedCharity: formData.get('charity') as string,
  }

  let success = false;
  try {
    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Signup failed, backend response:', res.status, errorText);
      throw new Error('Could not create account');
    }
    
    const json = await res.json();
    if (json.token) {
      const cookieStore = await cookies();
      cookieStore.set('token', json.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7 });
      success = true;
    }
  } catch (error) {
    console.error('Signup fetch error:', error);
    redirect('/login?message=Could not create user account')
  }

  if (success) {
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  revalidatePath('/', 'layout');
  redirect('/');
}

