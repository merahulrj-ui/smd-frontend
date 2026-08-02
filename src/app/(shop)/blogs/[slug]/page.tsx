import pool from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let title = 'Blog Not Found';
  try {
    const [rows] = await pool.query('SELECT title FROM blog WHERE id = ?', [resolvedParams.slug]) as any[];
    if (rows && rows.length > 0) {
      title = rows[0].title;
    }
  } catch(e) {}
  return { title: `${title} - SMD Medicare Blog` };
}

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let blog: any = null;
  try {
    const [rows] = await pool.query('SELECT * FROM blog WHERE id = ?', [resolvedParams.slug]) as any[];
    if (rows && rows.length > 0) {
      blog = rows[0];
      // Increment views
      await pool.query('UPDATE blog SET views = views + 1 WHERE id = ?', [resolvedParams.slug]);
    }
  } catch(e) {}

  if (!blog) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-500">
        <h2 className="text-2xl font-bold mb-4">Blog Not Found</h2>
        <Link href="/blogs" className="text-primary hover:underline">Back to Blogs</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/blogs" className="text-sm text-slate-500 hover:text-primary mb-8 inline-block">&larr; Back to all blogs</Link>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">{blog.title}</h1>
        
        <div className="flex items-center text-sm text-slate-600 mb-8 pb-8 border-b border-slate-100">
          <div className="font-semibold text-slate-800 mr-4">{blog.author_name || 'Admin'}</div>
          <div className="mr-4">&bull;</div>
          <div className="mr-4">{new Date(blog.created_at).toLocaleDateString()}</div>
          <div className="mr-4">&bull;</div>
          <div>{blog.read_time || '5 min read'}</div>
          <div className="mr-4">&bull;</div>
          <div>{blog.views} Views</div>
        </div>

        {blog.blog_image && (
          <img src={`/backend-media/${blog.blog_image}`} alt={blog.title} className="w-full rounded-2xl shadow-sm mb-10" />
        )}

        <div className="prose prose-lg max-w-none prose-slate" dangerouslySetInnerHTML={{__html: blog.content}}></div>
      </div>
    </div>
  );
}
