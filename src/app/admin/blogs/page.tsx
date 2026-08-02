import pool from '@/lib/db';
import BlogsClient from './BlogsClient';

export const dynamic = 'force-dynamic';

export default async function AdminBlogs() {
  let dbBlogs = [];
  
  try {
    const [blogRows] = await pool.query('SELECT * FROM blog ORDER BY created_at DESC') as any[];
    dbBlogs = blogRows;
  } catch (e) {
    console.error(e);
  }

    return (
        <BlogsClient dbBlogs={dbBlogs} />
    );
}
