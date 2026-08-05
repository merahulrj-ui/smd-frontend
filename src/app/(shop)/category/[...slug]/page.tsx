import pool from '@/lib/db';
import Link from 'next/link';
import InquireButton from '@/components/InquireButton';
import ProductCard from '@/components/ProductCard';
import SidebarFilter from '@/components/SidebarFilter';
import CategoryCarousel from '@/components/CategoryCarousel';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const slugs = resolvedParams.slug;
  const targetSlug = slugs[slugs.length - 1];
  
  let name = targetSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  
  try {
    const [subCats] = await pool.query('SELECT name FROM sub_categories WHERE slug = ? OR REPLACE(LOWER(name), " ", "-") = ? LIMIT 1', [targetSlug, targetSlug]) as any[];
    if (subCats && subCats.length > 0) {
      name = subCats[0].name;
    } else {
      const [cats] = await pool.query('SELECT name FROM categories WHERE slug = ? OR REPLACE(LOWER(name), " ", "-") = ? LIMIT 1', [targetSlug, targetSlug]) as any[];
      if (cats && cats.length > 0) {
        name = cats[0].name;
      }
    }
  } catch(e) {}
  
  const title = `${name} | Buy Online at SMD MEDICARE`;
  const description = `Shop for high-quality ${name} online at wholesale prices on SMD Medicare. Explore our wide range of medical and hospital supplies.`;
  const url = `https://smdmedicare.com/category/${slugs.join('/')}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: url,
    }
  };
}

export default async function CategoryPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string[] }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const slugs = resolvedParams.slug;
  const baseCatSlug = slugs[0];
  const currentSubcatSlug = slugs.length > 1 ? slugs[slugs.length - 1] : undefined;
  
  let products = [];
  let subcategories = [];
  let brands = [];
  
  let categoryName = baseCatSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  let categoryId = null;
  let currentSubcategoryObj = null;

  try {
    // 1. Fetch main category
    const [cats] = await pool.query('SELECT * FROM categories WHERE slug = ? OR REPLACE(LOWER(name), " ", "-") = ? LIMIT 1', [baseCatSlug, baseCatSlug]) as any[];
    if (cats && cats.length > 0) {
      categoryId = cats[0].id;
      categoryName = cats[0].name;
      
      // 2. Fetch subcategories for carousel and sidebar
      const [subRows] = await pool.query('SELECT id, name, slug, image, faq, how_to_use FROM sub_categories WHERE category_id = ?', [categoryId]) as any[];
      subcategories = subRows;

      // 3. Find current subcategory if nested
      if (currentSubcatSlug) {
        currentSubcategoryObj = subcategories.find((s: any) => s.slug === currentSubcatSlug || s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === currentSubcatSlug);
      }
      
      // 4. Build SQL Query for Products
      let sql = 'SELECT * FROM products WHERE 1=1';
      let sqlParams: any[] = [];

      // Subcategory Filter
      if (resolvedSearchParams.subcats) {
        const subcatSlugs = (resolvedSearchParams.subcats as string).split(',');
        const matchedSubIds = subcategories.filter((s: any) => subcatSlugs.includes(s.slug)).map((s: any) => s.id);
        if (matchedSubIds.length > 0) {
          sql += ` AND sub_category_id IN (${matchedSubIds.map(() => '?').join(',')})`;
          sqlParams.push(...matchedSubIds);
        } else {
          sql += ' AND category = ?';
          sqlParams.push(categoryName);
        }
      } else if (currentSubcategoryObj) {
        sql += ' AND sub_category_id = ?';
        sqlParams.push(currentSubcategoryObj.id);
      } else {
        const subIds = subcategories.map((s: any) => s.id);
        if (subIds.length > 0) {
           sql += ` AND (category = ? OR sub_category_id IN (${subIds.map(() => '?').join(',')}))`;
           sqlParams.push(categoryName, ...subIds);
        } else {
           sql += ' AND category = ?';
           sqlParams.push(categoryName);
        }
      }

      // Price Filter
      if (resolvedSearchParams.min_price) {
        sql += ' AND price >= ?';
        sqlParams.push(Number(resolvedSearchParams.min_price));
      }
      if (resolvedSearchParams.max_price) {
        sql += ' AND price <= ?';
        sqlParams.push(Number(resolvedSearchParams.max_price));
      }

      // Discount Filter
      if (resolvedSearchParams.discount) {
        const disc = Number(resolvedSearchParams.discount);
        sql += ' AND mrp > 0 AND price > 0 AND (((mrp - price) / mrp) * 100) >= ?';
        sqlParams.push(disc);
      }

      // Brand Filter
      if (resolvedSearchParams.brands) {
        const brandNames = (resolvedSearchParams.brands as string).split(',');
        if (brandNames.length > 0) {
          sql += ` AND brand IN (${brandNames.map(() => '?').join(',')})`;
          sqlParams.push(...brandNames);
        }
      }

      // Sorting
      const sortBy = resolvedSearchParams.sort_by as string;
      if (sortBy === 'price_low') sql += ' ORDER BY price ASC';
      else if (sortBy === 'price_high') sql += ' ORDER BY price DESC';
      else if (sortBy === 'newest') sql += ' ORDER BY id DESC';
      // else relevance/popular -> we just use id DESC as fallback
      else sql += ' ORDER BY id DESC';
      
      // LIMIT for performance
      sql += ' LIMIT 100';

      const [prodRows] = await pool.query(sql, sqlParams) as any[];
      products = prodRows;

      // 5. Fetch unique brands for the sidebar based on current category
      const [brandRows] = await pool.query('SELECT DISTINCT brand FROM products WHERE category_id = ? AND brand IS NOT NULL AND brand != "" AND brand != "0"', [categoryId]) as any[];
      brands = brandRows.map((b: any) => b.brand);
      
    } else {
      // Fallback if category not found by slug, search by subcat directly
      if (currentSubcatSlug || slugs.length === 1) {
         const targetSlug = currentSubcatSlug || slugs[0];
         const [subCats] = await pool.query('SELECT * FROM sub_categories WHERE slug = ? OR REPLACE(LOWER(name), " ", "-") = ? LIMIT 1', [targetSlug, targetSlug]) as any[];
         if (subCats && subCats.length > 0) {
             currentSubcategoryObj = subCats[0];
             categoryName = currentSubcategoryObj.name;
             const [prodRows] = await pool.query('SELECT * FROM products WHERE sub_category_id = ? ORDER BY id DESC LIMIT 100', [currentSubcategoryObj.id]) as any[];
             products = prodRows;
         }
      }
    }
  } catch (err) {
    console.error("Failed to fetch category products", err);
  }

  // FAQ logic
  const faqSource = currentSubcategoryObj || (categoryId ? { name: categoryName } : null); // We should ideally get FAQs from categories too if available

  const displayTitle = currentSubcategoryObj ? currentSubcategoryObj.name : categoryName;

  return (
    <div className="bg-slate-50 min-h-screen pb-12 pt-[76px]">
      {/* Tailwind Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-sm text-slate-500 font-medium overflow-x-auto whitespace-nowrap custom-scrollbar pb-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span className="mx-2 text-slate-300">»</span>
          <Link href="/categories" className="hover:text-blue-600 transition-colors">Categories</Link>
          <span className="mx-2 text-slate-300">»</span>
          {currentSubcategoryObj && baseCatSlug !== currentSubcatSlug ? (
            <>
              <Link href={`/category/${baseCatSlug}`} className="hover:text-blue-600 transition-colors capitalize">{categoryName}</Link>
              <span className="mx-2 text-slate-300">»</span>
              <span className="text-slate-800">{displayTitle}</span>
            </>
          ) : (
            <span className="text-slate-800">{displayTitle}</span>
          )}
        </div>
      </div>

      {/* Light Blue Hero Section */}
      <section className="relative overflow-hidden bg-white py-12 lg:py-16 mb-8 border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 opacity-80"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[150%] bg-blue-200/40 blur-3xl rounded-full mix-blend-multiply pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[30%] h-[150%] bg-indigo-200/40 blur-3xl rounded-full mix-blend-multiply pointer-events-none"></div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block py-1.5 px-4 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-4 border border-blue-200">
              <i className="fas fa-boxes mr-2"></i> EXPLORE SUBCATEGORY
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {displayTitle}
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
              Explore our premium selection of {displayTitle.toLowerCase()} products
            </p>
        </div>
      </section>

      {/* Subcategory Carousel */}
      {subcategories.length > 0 && (
        <section className="bg-white border-y border-slate-200 py-6 mb-8">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <CategoryCarousel 
              subcategories={subcategories} 
              categorySlug={baseCatSlug} 
              currentSubcatSlug={currentSubcatSlug} 
            />
          </div>
        </section>
      )}

      {/* Products Display Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {products.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Sidebar Filter */}
            <div className="w-full lg:w-[280px] shrink-0 sticky top-24">
              <SidebarFilter 
                subcategories={subcategories} 
                brands={brands} 
                isSearch={false} 
              />
            </div>

            {/* Right Results Column */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((product: any) => (
                  <ProductCard 
                    key={product.id}
                    id={product.id}
                    slug={product.slug || product.id}
                    name={product.name}
                    price={product.price}
                    mrp={product.mrp}
                    image={product.image ? `/backend-media/${product.image}` : '/backend-media/images/placeholder.png'}
                  />
                ))}
              </div>
              
              {products.length === 100 && (
                <div className="mt-12 flex justify-center">
                  <p className="text-slate-500 text-sm bg-white px-6 py-2 rounded-full border border-slate-200 shadow-sm">Showing top 100 results. Please refine your filters.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto my-8">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 text-3xl">
              <i className="fas fa-box-open"></i>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">Apologies, Products Coming Soon! 🚀</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">We are currently restocking our inventory for this category to bring you the best medical supplies. Please check back shortly.</p>
            <Link href="/categories" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              <i className="fas fa-arrow-left"></i> Browse Other Categories
            </Link>
          </div>
        )}

        {/* FAQs Section */}
        {faqSource && ((faqSource.how_to_use && faqSource.how_to_use.trim() !== '') || (faqSource.faq && faqSource.faq.trim() !== '')) && (
          <div className="max-w-4xl mx-auto mt-16 mb-12 space-y-8 overflow-hidden">
            <style dangerouslySetInnerHTML={{__html: `
              .rich-text-content {
                font-size: 1rem;
                line-height: 1.8;
                color: #334155;
                word-wrap: break-word;
                overflow-wrap: break-word;
                word-break: break-word;
              }
              .rich-text-content * {
                white-space: pre-wrap !important;
                max-width: 100%;
              }
              .rich-text-content h1, .rich-text-content h2, .rich-text-content h3, .rich-text-content h4, .rich-text-content h5 { 
                color: #0f172a; 
                font-weight: 700; 
                margin-top: 1.5em; 
                margin-bottom: 0.75em; 
              }
              .rich-text-content p { margin-bottom: 1.25em; }
              .rich-text-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25em; }
              .rich-text-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.25em; }
              .rich-text-content li { margin-bottom: 0.5em; }
              .rich-text-content strong, .rich-text-content b { font-weight: 600; color: #1e293b; }
              .rich-text-content a { color: #2563eb; text-decoration: underline; font-weight: 500; }
            `}} />

            {faqSource.how_to_use && faqSource.how_to_use.trim() !== '' && (
              <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-slate-200">
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <i className="fas fa-info-circle text-lg"></i>
                  </div>
                  How to Use {faqSource.name}
                </h3>
                <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: faqSource.how_to_use }}></div>
              </div>
            )}

            {faqSource.faq && faqSource.faq.trim() !== '' && (
              <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-slate-200">
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <i className="fas fa-question-circle text-lg"></i>
                  </div>
                  Frequently Asked Questions
                </h3>
                <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: faqSource.faq }}></div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
