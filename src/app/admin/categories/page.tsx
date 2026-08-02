import pool from '@/lib/db';
import Link from 'next/link';
import CategoriesClient from './CategoriesClient';

export const dynamic = 'force-dynamic';

export default async function AdminCategories() {
  let dbCategories = [];
  let dbSubCategories = [];
  
  try {
    const [catRows] = await pool.query('SELECT * FROM categories ORDER BY name') as any[];
    dbCategories = catRows;
    
    // In original laravel, sub_categories has category_id. We fetch it with joins
    const [subRows] = await pool.query('SELECT s.*, c.name as category_name FROM sub_categories s LEFT JOIN categories c ON s.category_id = c.id ORDER BY s.name') as any[];
    dbSubCategories = subRows;
  } catch (e) {
    console.error(e);
  }

    return (
        <CategoriesClient dbCategories={dbCategories} dbSubCategories={dbSubCategories} />
    );
}
