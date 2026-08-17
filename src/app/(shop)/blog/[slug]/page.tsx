import Link from 'next/link';
import Image from 'next/image';
import pool from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ShareButtons from '@/components/ShareButtons';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const [rows] = await pool.query('SELECT * FROM blog WHERE slug = ? LIMIT 1', [slug]) as any[];
    if (rows.length > 0) {
      const article = rows[0];
      const title = `${article.title} | SMD MEDICARE Blog`;
      
      let description = 'Read medical equipment and diagnostics insights on SMD Medicare.';
      if (typeof article.content === 'string') {
        try {
          const parsed = JSON.parse(article.content);
          if (Array.isArray(parsed) && parsed.length > 0) {
            description = (parsed[0].paragraph || parsed[0].content || article.title).substring(0, 160);
          }
        } catch {
          description = article.content.replace(/<[^>]*>?/gm, '').substring(0, 160);
        }
      }
      
      const url = `https://www.smdmedicare.in/blog/${slug}`;
      const imgRaw = article.blog_image || article.image || 'images/blog_hospital_furniture_guide.jpg';
      const imageUrl = imgRaw.startsWith('http') 
        ? imgRaw 
        : (imgRaw.startsWith('/') 
            ? `https://www.smdmedicare.in${imgRaw}` 
            : `https://www.smdmedicare.in/backend-media/${imgRaw}`);
      
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url,
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: article.title,
            }
          ],
          type: 'article',
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [imageUrl],
        },
        alternates: {
          canonical: url,
        }
      };
    }
  } catch (error) {}
  return { title: 'Blog Article - SMD MEDICARE' };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let article: any = null;
  let relatedBlogs: any[] = [];
  let relatedProducts: any[] = [];
  
  try {
    const [rows] = await pool.query('SELECT * FROM blog WHERE slug = ?', [slug]) as any[];
    if (rows.length === 0) {
      notFound();
    }
    article = rows[0];
    
    // Fetch related blogs
    const [relRows] = await pool.query('SELECT * FROM blog WHERE status = "published" AND id != ? ORDER BY created_at DESC LIMIT 3', [article.id]) as any[];
    relatedBlogs = relRows;

    // Fetch related products based on blog title keywords
    const keywords = article.title.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter((w: string) => w.length > 3 && !['best', 'practices', 'guide', 'essential', 'standards', '2026', 'maintenance'].includes(w));
    
    let prodQuery = 'SELECT id, slug, name, price, mrp, image FROM products WHERE status = "live" AND (';
    let prodParams: any[] = [];
    
    if (keywords.length > 0) {
      const likeClauses = keywords.map(() => 'name LIKE ?');
      prodQuery += likeClauses.join(' OR ');
      prodParams = keywords.map((k: string) => `%${k}%`);
      prodQuery += ') ORDER BY RAND() LIMIT 4';
      
      const [matchedRows] = await pool.query(prodQuery, prodParams) as any[];
      relatedProducts = matchedRows;
    }

    // Fallback to random if not enough matched
    if (relatedProducts.length < 4) {
      const needed = 4 - relatedProducts.length;
      const excludeIds = relatedProducts.length > 0 ? relatedProducts.map((p:any) => p.id).join(',') : '0';
      const [fallbackRows] = await pool.query(`SELECT id, slug, name, price, mrp, image FROM products WHERE status = "live" AND id NOT IN (${excludeIds}) ORDER BY RAND() LIMIT ?`, [needed]) as any[];
      relatedProducts = [...relatedProducts, ...fallbackRows];
    }

    // Increment views (fire and forget)
    pool.query('UPDATE blog SET views = views + 1 WHERE id = ?', [article.id]).catch(e => console.error(e));
  } catch (error) {
    console.error("Error fetching blog post:", error);
    notFound();
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  // Parse JSON content
  let sections = null;
  try {
    sections = JSON.parse(article.content);
  } catch (e) {
    // Not JSON, keep as string
  }

  const articleUrl = `https://www.smdmedicare.in/blog/${slug}`;
  const rawImg = article.blog_image || article.image || 'images/blog_hospital_furniture_guide.jpg';
  const imageUrl = rawImg.startsWith('http') 
    ? rawImg 
    : (rawImg.startsWith('/') 
        ? `https://www.smdmedicare.in${rawImg}` 
        : `https://www.smdmedicare.in/backend-media/${rawImg}`);
  const displayCoverImg = rawImg.startsWith('http') 
    ? rawImg 
    : (rawImg.startsWith('/') ? rawImg : `/backend-media/${rawImg}`);
  
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.smdmedicare.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://www.smdmedicare.in/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    headline: article.title,
    image: imageUrl,
    datePublished: article.created_at || article.date || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: article.author_name || 'SMD Editorial Team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'SMD MEDICARE',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.smdmedicare.in/images/img_68ae826eb6cc47.12112340_logo.webp'
      }
    },
    description: typeof article.content === 'string' ? article.content.replace(/<[^>]*>?/gm, '').substring(0, 160) : 'Read medical equipment and diagnostics insights on SMD Medicare.',
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-20 pt-[76px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="bg-white py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
          <div className="max-w-[1400px] mx-auto text-sm text-slate-500 font-medium overflow-x-auto whitespace-nowrap custom-scrollbar pb-2">
              <Link href="/" className="hover:text-blue-600 transition-colors shrink-0">Home</Link> 
              <span className="mx-2 text-slate-300">»</span>
              <Link href="/blog" className="hover:text-blue-600 transition-colors shrink-0">Blogs</Link>
              <span className="mx-2 text-slate-300">»</span>
              <span className="text-slate-900 font-semibold truncate">{article.title}</span>
          </div>
      </div>

      {/* Full-width Hero Header */}
      <div className="w-full bg-white pt-16 pb-32 md:pt-24 md:pb-40 text-center relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 opacity-80"></div>
        {/* Decorative blur blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[150%] bg-blue-200/40 blur-3xl rounded-full mix-blend-multiply pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[30%] h-[150%] bg-indigo-200/40 blur-3xl rounded-full mix-blend-multiply pointer-events-none"></div>
        
        <div className="relative z-10 px-4 sm:px-6 lg:px-8">
          <span className="inline-block border border-blue-200 bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-8 shadow-sm">
            <i className="fas fa-circle text-[0.5rem] mr-2 text-blue-500 animate-pulse"></i>
            MEDICAL & DIAGNOSTIC ARTICLE
          </span>
          
          <h1 className="text-3xl md:text-5xl lg:text-[54px] font-extrabold text-slate-900 mb-8 leading-[1.1] max-w-5xl mx-auto tracking-tight">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm md:text-base font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <i className="far fa-user text-blue-600"></i>
              <span className="text-slate-900 font-bold">{article.author_name || 'SMD Editorial'}</span>
              {article.author_title && <span className="hidden sm:inline text-slate-500">({article.author_title})</span>}
            </div>
            <div className="flex items-center gap-2">
              <i className="far fa-calendar-alt text-blue-600"></i>
              <span>{formatDate(article.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="far fa-clock text-blue-600"></i>
              <span>{article.read_time || '5'} mins read</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="far fa-eye text-blue-600"></i>
              <span>{article.views + 1} views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Box Overlapping Hero */}
      <article className="max-w-[920px] mx-auto px-4 sm:px-6 lg:px-8 -mt-20 md:-mt-28 relative z-20">
        
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-slate-100">
          
          {/* Cover Image */}
          {displayCoverImg && (
            <div className="w-full rounded-xl overflow-hidden mb-12 shadow-sm border border-slate-100">
              <Image 
                src={displayCoverImg} 
                alt={article.title} 
                width={1200}
                height={480}
                className="w-full max-h-[480px] object-cover"
              />
            </div>
          )}

          {/* Article Content Parsing */}
          <div className="prose prose-lg max-w-none text-slate-800 font-sans leading-relaxed">
            {Array.isArray(sections) ? (
              sections.map((section: any, idx: number) => (
                <div key={idx}>
                  {section.heading && (
                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 border-l-4 border-blue-600 pl-4">
                      {section.heading}
                    </h2>
                  )}
                  {section.paragraph && (
                    <div className="mb-6 text-slate-600">
                      {section.paragraph.split('\n').map((line: string, lineIdx: number) => {
                        const trimmed = line.trim();
                        if (!trimmed) return null;
                        
                        // Check for bullet points
                        if (/^[-*•✅✔]\s*/.test(trimmed)) {
                          const cleanText = trimmed.replace(/^[-*•✅✔]\s*/, '');
                          return (
                            <div key={lineIdx} className="flex gap-3 mb-2 items-start pl-2">
                              <i className="fas fa-check-circle text-blue-600 mt-1.5 shrink-0"></i>
                              <span>{cleanText}</span>
                            </div>
                          );
                        } else {
                          return <p key={lineIdx} className="mb-3">{trimmed}</p>;
                        }
                      })}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div dangerouslySetInnerHTML={{ __html: article.content?.replace(/\n/g, '<br/>') }} />
            )}
          </div>

          {/* Author Profile Bio Box */}
          <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 text-xl shadow-sm">
              <i className="fas fa-user-md"></i>
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-lg mb-1">Written by {article.author_name || 'SMD MEDICARE Medical Team'}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">Published by clinical specialists at SMD MEDICARE. Providing certified insights on healthcare products, lab diagnostics, and hospital supplies across India.</p>
            </div>
          </div>
          
          {/* Share Section */}
          <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <ShareButtons title={article.title} />
            <Link href="/blog" className="text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-2">
              <i className="fas fa-arrow-left text-sm"></i> Back to Blogs
            </Link>
          </div>

        </div>
      </article>

      {/* Featured Medical Products Mentioned */}
      {relatedProducts.length > 0 && (
        <section className="bg-slate-100 border-t border-slate-200 mt-16 pt-16 pb-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Medical Products Mentioned</h2>
              <p className="text-slate-500">Explore clinical-grade diagnostic equipment and wholesale supplies related to this topic.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(product => (
                <ProductCard 
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  price={product.price}
                  mrp={product.mrp}
                  image={product.image}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Blog Posts */}
      {relatedBlogs.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Related Articles & Research</h2>
            <p className="text-slate-500">More healthcare updates from our medical writing panel.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedBlogs.map((post, idx) => {
              const COLORS = [
                'from-emerald-400 to-blue-500',
                'from-rose-400 to-pink-500',
                'from-blue-500 to-indigo-600',
                'from-amber-400 to-orange-500',
                'from-violet-500 to-purple-600',
                'from-cyan-500 to-blue-500'
              ];
              return (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col transform hover:-translate-y-1">
                <div className="h-48 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  {post.blog_image ? (
                    <Image 
                      src={`/backend-media/${post.blog_image}`} 
                      alt={post.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${COLORS[idx % COLORS.length]}`}>
                      <div className="absolute inset-0 bg-black/10"></div>
                      <i className={`fas fa-file-medical text-6xl text-white/80 drop-shadow-md group-hover:scale-125 group-hover:rotate-6 transition-transform duration-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}></i>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-500 mt-auto pt-4 border-t border-slate-50">
                    <span className="flex items-center gap-2"><i className="far fa-user text-blue-600"></i> {post.author_name || 'SMD MEDICARE Team'}</span>
                    <span className="flex items-center gap-2"><i className="far fa-clock text-blue-600"></i> {post.read_time || '5'} mins read</span>
                  </div>
                </div>
              </Link>
            )})}
          </div>
        </section>
      )}

    </div>
  );
}
