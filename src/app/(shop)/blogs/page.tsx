import pool from '@/lib/db';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata = {
  title: 'Blog - SMD Medicare',
  description: 'Latest news, insights, and updates from SMD Medicare.',
};

export default async function BlogsPage() {
  let blogs = [];
  try {
    const [rows] = await pool.query('SELECT * FROM blog WHERE status = "published" ORDER BY created_at DESC') as any[];
    blogs = rows;
  } catch (err) {
    console.error("Failed to fetch blogs", err);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8 text-center">SMD Medicare Blog</h1>
        
        {blogs.length === 0 ? (
          <p className="text-center text-slate-500">No blogs published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog: any) => (
              <Link href={`/blogs/${blog.id}`} key={blog.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                {blog.blog_image && (
                  <img src={blog.blog_image.startsWith('http') ? blog.blog_image : (blog.blog_image.includes('/') ? `/backend-media/${blog.blog_image}` : `/backend-media/images/${blog.blog_image}`)} alt={blog.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <div className="text-xs text-primary font-semibold mb-2 uppercase tracking-wide">
                    {blog.read_time || '5 min read'}
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2">{blog.title}</h2>
                  <p className="text-slate-600 line-clamp-3 text-sm mb-4" dangerouslySetInnerHTML={{__html: blog.content}}></p>
                  <div className="flex items-center mt-4">
                    <div className="text-sm">
                      <p className="text-slate-900 font-medium">{blog.author_name || 'Admin'}</p>
                      <p className="text-slate-500">{new Date(blog.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
