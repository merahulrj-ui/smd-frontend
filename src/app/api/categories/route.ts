import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [categories] = await pool.query('SELECT id, name, slug FROM categories WHERE status = 1 ORDER BY name ASC') as any[];
    const [subCategories] = await pool.query('SELECT id, category_id, name, slug FROM sub_categories WHERE status = 1 ORDER BY name ASC') as any[];

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
