import Link from 'next/link';
import pool from '@/lib/db';
import Image from 'next/image';

export const metadata = {
  title: 'Blog & Insights - SMD MEDICARE',
  description: 'Read the latest updates, guides, and diagnostic sector insights from SMD Medicare.'
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  let articles: any[] = [];
  try {
    const [rows] = await pool.query('SELECT * FROM blog WHERE status = "published" ORDER BY created_at DESC') as any[];
    articles = rows;
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const getExcerpt = (content: string) => {
    try {
      const sections = JSON.parse(content);
      if (Array.isArray(sections)) {
        for (const sec of sections) {
          if (sec.paragraph) {
            return sec.paragraph.substring(0, 150) + '...';
          }
        }
      }
    } catch (e) {
      // Not JSON, just strip HTML and return string
    }
    return content?.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';
  };

  const COLORS = [
    'from-blue-500 to-indigo-600',
    'from-emerald-400 to-teal-500',
    'from-rose-400 to-pink-500',
    'from-amber-400 to-orange-500',
    'from-violet-500 to-purple-600',
    'from-cyan-500 to-blue-500'
  ];

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const gridArticles = articles.length > 0 ? articles.slice(1) : [];

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      
      {/* Breadcrumbs Banner */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1400px] mx-auto flex items-center gap-2 text-sm font-medium text-slate-500">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link> 
              <i className="fas fa-chevron-right text-[0.6rem]"></i>
              <span className="text-slate-900 font-semibold">Blog & Insights</span>
          </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[100%] rounded-full bg-gradient-to-br from-teal-500/20 to-blue-600/20 blur-[100px]"></div>
            <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[80%] rounded-full bg-gradient-to-tl from-indigo-500/20 to-purple-600/20 blur-[120px]"></div>
        </div>
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block py-1.5 px-4 rounded-full bg-teal-500/10 text-teal-400 font-semibold text-sm mb-6 border border-teal-500/20">
              <i className="fas fa-newspaper mr-2"></i> SMD MEDICARE INSIGHTS
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Medical Insights, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">Delivered.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium">
              Explore our latest articles, guides, and industry trends to stay ahead in the rapidly evolving world of healthcare and diagnostics.
            </p>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 lg:py-24 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-slate-200 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Latest Articles</h2>
            <p className="text-slate-500 mt-2">Discover knowledge tailored for healthcare professionals.</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors">All</button>
            <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors">Technology</button>
            <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors">Guides</button>
          </div>
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-16">
            <Link href={`/blog/${featuredArticle.slug}`} className="group flex flex-col lg:flex-row bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.08)] transition-all duration-300 border border-slate-100">
              <div className="lg:w-1/2 h-64 lg:h-auto bg-slate-100 relative overflow-hidden flex items-center justify-center">
                {featuredArticle.blog_image ? (
                  <img src={`/backend-media/${featuredArticle.blog_image}`} alt={featuredArticle.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="absolute w-64 h-64 bg-teal-500/30 rounded-full blur-[80px] -top-10 -left-10 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="absolute w-64 h-64 bg-blue-500/30 rounded-full blur-[80px] -bottom-10 -right-10 group-hover:scale-110 transition-transform duration-700"></div>
                    <i className="fas fa-newspaper text-8xl text-white/90 drop-shadow-lg transform group-hover:scale-110 transition-transform duration-500"></i>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Featured
                </div>
              </div>
              <div className="lg:w-1/2 p-8 lg:p-14 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mb-4">
                  <span className="text-teal-600 font-bold">Insights</span>
                  <span>•</span>
                  <span>{formatDate(featuredArticle.created_at)}</span>
                  <span>•</span>
                  <span>{featuredArticle.read_time || '5 mins'}</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight group-hover:text-teal-600 transition-colors">
                  {featuredArticle.title}
                </h3>
                <p className="text-slate-600 text-lg mb-8 line-clamp-3">
                  {getExcerpt(featuredArticle.content)}
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(featuredArticle.author_name || 'Admin')}&background=0D9488&color=fff&size=100`} alt="Author" className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 shadow-sm" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{featuredArticle.author_name || 'SMD Editorial'}</p>
                    <p className="text-xs text-slate-500">{featuredArticle.author_title || 'Medical Contributor'}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridArticles.map((article, idx) => (
            <Link href={`/blog/${article.slug}`} key={article.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col transform hover:-translate-y-1">
              <div className={`h-48 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center`}>
                {article.blog_image ? (
                  <img src={`/backend-media/${article.blog_image}`} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${COLORS[idx % COLORS.length]}`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <i className={`fas fa-file-alt text-6xl text-white/80 drop-shadow-md group-hover:scale-125 group-hover:rotate-6 transition-transform duration-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}></i>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
                  Article
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mb-3">
                  <span>{formatDate(article.created_at)}</span>
                  <span>•</span>
                  <span>{article.read_time || '5 mins'}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-slate-600 text-sm mb-6 line-clamp-3">
                  {getExcerpt(article.content)}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(article.author_name || 'Admin')}&background=random&color=fff&size=100`} alt={article.author_name || 'Admin'} className="w-8 h-8 rounded-full" />
                    <span className="text-sm font-semibold text-slate-700">{article.author_name || 'SMD Editorial'}</span>
                  </div>
                  <span className="text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform flex items-center">
                    Read <i className="fas fa-arrow-right ml-1 text-xs"></i>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-20">
            <i className="fas fa-newspaper text-6xl text-slate-300 mb-4"></i>
            <h3 className="text-xl text-slate-600 font-semibold mb-2">No Articles Found</h3>
            <p className="text-slate-500">We are working on bringing you the best insights soon.</p>
          </div>
        )}

      </section>

      {/* Newsletter Section */}
      <section className="bg-teal-600 py-16 lg:py-20 mt-10">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Never Miss an Update</h2>
          <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to get the latest medical equipment reviews, industry news, and exclusive offers delivered straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-grow px-5 py-4 rounded-xl bg-white border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-teal-400/50 text-slate-900 placeholder-slate-400 shadow-lg"
              required
            />
            <button type="submit" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg whitespace-nowrap">
              Subscribe
            </button>
          </form>
          <p className="text-teal-200 text-xs mt-4">We care about your data in our <Link href="#" className="underline hover:text-white">privacy policy</Link>.</p>
        </div>
      </section>

    </div>
  );
}
