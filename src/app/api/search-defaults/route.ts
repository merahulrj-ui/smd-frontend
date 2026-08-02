import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Top Searches
    let topSearches = [];
    try {
      const [searchRows] = await pool.query(`
        SELECT query FROM search_queries 
        ORDER BY search_count DESC 
        LIMIT 10
      `) as any[];
      topSearches = searchRows.map((r: any) => r.query);
      
      if (topSearches.length === 0) {
        const [randomProducts] = await pool.query(`
          SELECT name FROM products 
          WHERE status = 1 
          ORDER BY RAND() 
          LIMIT 5
        `) as any[];
        topSearches = randomProducts.map((r: any) => r.name);
      }
    } catch (e) {
      topSearches = ['Stethoscopes', 'ECG Machines', 'Ventilators', 'Patient Monitor'];
    }

    // Top Brands
    const [brands] = await pool.query(`
      SELECT name, logo FROM brands 
      WHERE status = 1 
      ORDER BY id DESC 
      LIMIT 12
    `) as any[];

    // Top Products
    const [products] = await pool.query(`
      SELECT id, name, slug, image, price, mrp, category 
      FROM products 
      WHERE status = 1 AND image IS NOT NULL AND image != ''
      ORDER BY RAND() 
      LIMIT 4
    `) as any[];

    return NextResponse.json({
      topSearches,
      brands: brands.map((b: any) => ({
        name: b.name,
        logo: b.logo ? `http://localhost/smd2.0/public/uploads/brands/${b.logo}` : null
      })),
      topProducts: products
    });
  } catch (error) {
    console.error('Search Defaults API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch search defaults' }, { status: 500 });
  }
}
