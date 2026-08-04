import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import fs from 'fs';

export async function GET() {
  try {
    const [products]: any = await pool.query('SELECT * FROM products LIMIT 2');
    const [categories]: any = await pool.query('SELECT * FROM categories LIMIT 2');
    
    const output = JSON.stringify({ products, categories }, null, 2);
    fs.writeFileSync('c:\\Users\\merah\\.gemini\\antigravity\\brain\\49f4ab21-e64b-40e8-9896-3aca64349a4b\\scratch\\db_dump.json', output);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
