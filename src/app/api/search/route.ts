import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = `%${query.trim()}%`;
    
    const [rows] = await pool.query(
      `SELECT id, name, slug, image, price, mrp, category 
       FROM products 
       WHERE name LIKE ? OR brand LIKE ? OR category LIKE ?
       LIMIT 6`,
      [searchTerm, searchTerm, searchTerm]
    ) as any[];

    return NextResponse.json({ results: rows });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
