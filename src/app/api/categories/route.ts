import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [categories] = await pool.query(`
      SELECT DISTINCT c.id, c.name, c.slug 
      FROM categories c 
      INNER JOIN products p ON (p.category_id = c.id OR p.category = c.name) 
      WHERE c.status = 1 AND p.status = 'live'
      ORDER BY c.name ASC
    `) as any[];
    const [subCategories] = await pool.query(`
      SELECT DISTINCT s.id, s.category_id, s.name, s.slug 
      FROM sub_categories s
      INNER JOIN products p ON p.sub_category_id = s.id
      WHERE s.status = 1 AND p.status = 'live'
      ORDER BY s.name ASC
    `) as any[];

    // Structure the data for the Mega Menu
    const structuredCategories = categories.map((cat: any) => {
      const subs = subCategories.filter((sub: any) => sub.category_id === cat.id);
      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
        subcategories: subs.map((sub: any) => ({
          id: sub.id,
          name: sub.name,
          slug: sub.slug || sub.name.toLowerCase().replace(/\s+/g, '-')
        }))
      };
    });

    return NextResponse.json(structuredCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
