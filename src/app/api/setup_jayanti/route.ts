import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Delete corrupted cache rows
    await pool.query(`DELETE FROM jayanti_qa_caches WHERE answer LIKE '%[CAROUSEL]%'`);

    return NextResponse.json({ success: true, message: 'Cleaned cache' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
