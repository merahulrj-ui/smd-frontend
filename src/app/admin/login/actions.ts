"use server";

import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Username and password are required' };
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, username, password FROM admin_users WHERE username = ? LIMIT 1',
      [username]
    ) as any[];

    if (rows.length === 0) {
      return { error: 'Invalid username or password' };
    }

    const admin = rows[0];

    // Verify bcrypt hash (Laravel uses bcrypt)
    // Note: Laravel bcrypt hashes might start with $2y$. bcryptjs handles them fine.
    let hash = admin.password;
    if (hash.startsWith('$2y$')) {
        hash = hash.replace('$2y$', '$2a$'); // bcryptjs compatibility fix for PHP $2y$ hashes
    }

    const isValid = await bcrypt.compare(password, hash);

    if (!isValid) {
      return { error: 'Invalid username or password' };
    }

    // Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_session', JSON.stringify({ id: admin.id, username: admin.username }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    });

    return { success: true };

  } catch (err: any) {
    console.error('Login error:', err);
    return { error: 'Database connection failed. Please make sure MySQL is running.' };
  }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    redirect('/admin/login');
}
