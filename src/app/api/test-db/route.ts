import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [columns] = await pool.query('SHOW COLUMNS FROM blog') as any[];
    return NextResponse.json(columns);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
