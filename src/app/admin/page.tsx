import pool from '@/lib/db';
import Link from 'next/link';
import AdminDashboardClient from './DashboardClient'; // We'll extract client logic to a child component for charts/toggles

export const dynamic = 'force-dynamic';

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search as string || '';
  const category = resolvedParams?.category as string || '';
  const brand = resolvedParams?.brand as string || '';
  const stock = resolvedParams?.stock as string || '';
  const page = parseInt(resolvedParams?.page as string) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  // Build Query
  let query = 'SELECT * FROM products WHERE 1=1';
  const queryParams: any[] = [];

  if (search) {
    query += ' AND (name LIKE ? OR brand LIKE ? OR category LIKE ? OR description LIKE ?)';
    const searchLike = `%${search}%`;
    queryParams.push(searchLike, searchLike, searchLike, searchLike);
  }
  if (category) {
    query += ' AND category = ?';
    queryParams.push(category);
  }
  if (brand) {
    query += ' AND brand = ?';
    queryParams.push(brand);
  }

  if (stock === 'in_stock') {
    query += ' AND stock_quantity > 0 AND (image IS NOT NULL AND image != "images/placeholder.png" AND image != "images/Med.jpg")';
  } else if (stock === 'out_of_stock') {
    query += ' AND stock_quantity <= 0 AND (image IS NOT NULL AND image != "images/placeholder.png" AND image != "images/Med.jpg")';
  } else if (stock === 'unlisted') {
    query += ' AND (image IS NULL OR image = "images/placeholder.png" OR image = "images/Med.jpg" OR image = "")';
  } else if (stock !== 'all') {
    // Default: listed only
    query += ' AND (image IS NOT NULL AND image != "images/placeholder.png" AND image != "images/Med.jpg" AND image != "")';
  }

  // Count Query
  let countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
  
  query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
  queryParams.push(limit, offset);

  // Stats queries
  let totalProducts = 0, totalCategories = 0, outOfStockCount = 0, unlistedCount = 0, totalEnquiries = 0;
  let products = [];
  let totalRows = 0;
  let allCategories = [];
  let allBrands = [];
  let allSubCategories: any[] = [];
  let allCategoryObjects: any[] = [];

  try {
    // Run ALL queries in parallel instead of sequentially — massive speed boost
    const [
      [prodRows],
      [countRows],
      [stat1],
      [stat2],
      [stat3],
      [stat4],
      [catRows],
      [brandRows],
      [subCatRows],
      [catObjectsRows],
    ] = await Promise.all([
      pool.query(query, queryParams),
      pool.query(countQuery, queryParams.slice(0, -2)),
      pool.query('SELECT COUNT(*) as c FROM products'),
      pool.query('SELECT COUNT(DISTINCT category) as c FROM products WHERE category IS NOT NULL AND category != ""'),
      pool.query('SELECT COUNT(*) as c FROM products WHERE stock_quantity <= 0'),
      pool.query('SELECT COUNT(*) as c FROM products WHERE (image IS NULL OR image = "images/placeholder.png" OR image = "images/Med.jpg" OR image = "")'),
      pool.query('SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != "" ORDER BY category ASC'),
      pool.query('SELECT DISTINCT brand FROM products WHERE brand IS NOT NULL AND brand != "" ORDER BY brand ASC'),
      pool.query('SELECT sc.id, sc.name, c.name as category_name FROM sub_categories sc JOIN categories c ON sc.category_id = c.id ORDER BY sc.name ASC'),
      pool.query('SELECT id, name FROM categories ORDER BY name ASC'),
    ]) as any[];

    products = (prodRows as any[]);
    totalRows = (countRows as any[])[0].total;
    totalProducts = (stat1 as any[])[0].c;
    totalCategories = (stat2 as any[])[0].c;
    outOfStockCount = (stat3 as any[])[0].c;
    unlistedCount = (stat4 as any[])[0].c;
    allCategories = (catRows as any[]).map((r: any) => r.category);
    allBrands = (brandRows as any[]).map((r: any) => r.brand);
    allSubCategories = subCatRows as any[];
    allCategoryObjects = catObjectsRows as any[];

    // Enquiries count (separate try-catch because table might not exist)
    try {
      const [stat5] = await pool.query('SELECT COUNT(*) as c FROM enquiries') as any[];
      totalEnquiries = stat5[0].c;
    } catch(e) {}

  } catch (e) {
    console.error("Dashboard Error:", e);
  }

  const totalPages = Math.ceil(totalRows / limit);

  return (
    <div>
      {/* Top Clickable KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Link href="/admin?stock=all" className={`bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-5 flex items-center gap-4 transition-all duration-300 shadow-sm no-underline hover:-translate-y-1.5 hover:shadow-xl ${stock === 'all' ? 'border-teal-500 ring-4 ring-teal-500/10' : 'hover:border-teal-200'}`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-2xl ${stock === 'all' ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-600'}`}>
                  <i className="fas fa-boxes"></i>
              </div>
              <div>
                  <h3 className="text-2xl font-bold text-slate-800 m-0">{totalProducts}</h3>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1 m-0">Total Catalog</p>
              </div>
          </Link>

          <Link href="/admin/categories" className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-5 flex items-center gap-4 transition-all duration-300 shadow-sm no-underline hover:-translate-y-1.5 hover:shadow-xl hover:border-emerald-200">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-2xl bg-emerald-50 text-emerald-600">
                  <i className="fas fa-tags"></i>
              </div>
              <div>
                  <h3 className="text-2xl font-bold text-slate-800 m-0">{totalCategories}</h3>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1 m-0">Categories</p>
              </div>
          </Link>

          <Link href="/admin/enquiries" className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-5 flex items-center gap-4 transition-all duration-300 shadow-sm no-underline hover:-translate-y-1.5 hover:shadow-xl hover:border-amber-200">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-2xl bg-amber-50 text-amber-600">
                  <i className="fas fa-paper-plane"></i>
              </div>
              <div>
                  <h3 className="text-2xl font-bold text-slate-800 m-0">{totalEnquiries}</h3>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1 m-0">Inquiries</p>
              </div>
          </Link>

          <Link href="/admin?stock=out_of_stock" className={`bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-5 flex items-center gap-4 transition-all duration-300 shadow-sm no-underline hover:-translate-y-1.5 hover:shadow-xl ${stock === 'out_of_stock' ? 'border-rose-400 ring-4 ring-rose-500/10' : 'hover:border-rose-200'}`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-2xl ${stock === 'out_of_stock' ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-600'}`}>
                  <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div>
                  <h3 className={`text-2xl font-bold ${stock === 'out_of_stock' ? 'text-rose-600' : 'text-slate-800'} m-0`}>{outOfStockCount}</h3>
                  <p className="text-xs font-semibold text-rose-600 uppercase tracking-wide mt-1 m-0">Out of Stock</p>
              </div>
          </Link>

          <Link href="/admin?stock=unlisted" className={`bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-5 flex items-center gap-4 transition-all duration-300 shadow-sm no-underline hover:-translate-y-1.5 hover:shadow-xl ${stock === 'unlisted' ? 'border-fuchsia-400 ring-4 ring-fuchsia-500/10' : 'hover:border-fuchsia-200'}`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-2xl ${stock === 'unlisted' ? 'bg-fuchsia-500 text-white' : 'bg-fuchsia-50 text-fuchsia-600'}`}>
                  <i className="fas fa-eye-slash"></i>
              </div>
              <div>
                  <h3 className={`text-2xl font-bold ${stock === 'unlisted' ? 'text-fuchsia-600' : 'text-slate-800'} m-0`}>{unlistedCount}</h3>
                  <p className="text-xs font-semibold text-fuchsia-600 uppercase tracking-wide mt-1 m-0">Unlisted</p>
              </div>
          </Link>
      </div>

      <AdminDashboardClient 
        products={products} 
        totalRows={totalRows}
        stock={stock}
        search={search}
        category={category}
        brand={brand}
        allCategories={allCategories}
        allBrands={allBrands}
        allSubCategories={allSubCategories}
        allCategoryObjects={allCategoryObjects}
        page={page}
        totalPages={totalPages}
      />

    </div>
  );
}
