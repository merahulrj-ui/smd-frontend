import pool from '@/lib/db';
import SearchClient from './SearchClient';

export default async function SearchResultsPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ query: string }> | { query: string },
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined }
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const query = decodeURIComponent(resolvedParams.query);
  
  // Extract filters from searchParams
  const minPrice = resolvedSearchParams.min_price ? Number(resolvedSearchParams.min_price) : 0;
  const maxPrice = resolvedSearchParams.max_price ? Number(resolvedSearchParams.max_price) : 9999999;
  const sort = typeof resolvedSearchParams.sort_by === 'string' ? resolvedSearchParams.sort_by : 'relevance';
  
  const categoryFilters = resolvedSearchParams.cats 
    ? (resolvedSearchParams.cats as string).split(',')
    : [];
    
  const brandFilters = resolvedSearchParams.brands 
    ? (resolvedSearchParams.brands as string).split(',')
    : [];

  const discountFilter = typeof resolvedSearchParams.discount === 'string' ? Number(resolvedSearchParams.discount) : 0;

  // Build the base query
  const searchTerm = `%${query.trim()}%`;
  let sql = `
    SELECT id, name, slug, image, price, mrp, category, brand 
    FROM products 
    WHERE (name LIKE ? OR brand LIKE ? OR category LIKE ?)
      AND price >= ? 
      AND price <= ?
  `;
  
  const queryParams: any[] = [searchTerm, searchTerm, searchTerm, minPrice, maxPrice];

  // Discount Filter
  if (discountFilter > 0) {
    sql += ` AND ((mrp - price) / mrp * 100) >= ?`;
    queryParams.push(discountFilter);
  }

  // Categories Filter
  if (categoryFilters.length > 0) {
    sql += ` AND category IN (${categoryFilters.map(() => '?').join(',')})`;
    queryParams.push(...categoryFilters);
  }

  // Brands Filter
  if (brandFilters.length > 0) {
    sql += ` AND brand IN (${brandFilters.map(() => '?').join(',')})`;
    queryParams.push(...brandFilters);
  }

  // Sorting
  if (sort === 'price_asc') {
    sql += ` ORDER BY price ASC`;
  } else if (sort === 'price_desc') {
    sql += ` ORDER BY price DESC`;
  } else {
    // Relevance (default) - no strict order, but can order by id
    sql += ` ORDER BY id DESC`;
  }

  // Fetch matched products
  const [products] = await pool.query(sql, queryParams) as any[];

  // Fetch unique categories and brands for the sidebar based ONLY on the base search term
  const [facets] = await pool.query(
    `SELECT DISTINCT category, brand 
     FROM products 
     WHERE name LIKE ? OR brand LIKE ? OR category LIKE ?`,
    [searchTerm, searchTerm, searchTerm]
  ) as any[];

  const availableCategories = Array.from(new Set(facets.map((f: any) => f.category).filter(Boolean)));
  const availableBrands = Array.from(new Set(facets.map((f: any) => f.brand).filter(Boolean)));

  // Fetch Top Recommended Products
  const [recommended] = await pool.query(
    `SELECT id, name, slug, image, price, mrp 
     FROM products 
     ORDER BY RAND() 
     LIMIT 5`
  ) as any[];

  // Fetch Top Brands for the strip from the brands table
  const [topBrands] = await pool.query(
    `SELECT name, logo FROM brands WHERE status = 1 ORDER BY RAND() LIMIT 8`
  ) as any[];

  return (
    <SearchClient 
      query={query} 
      products={products}
      availableCategories={availableCategories as string[]}
      availableBrands={availableBrands as string[]}
      recommendedProducts={recommended}
      topBrands={topBrands.map((b: any) => ({
        name: b.name,
        logo: b.logo ? (b.logo.startsWith('http') ? b.logo : (b.logo.includes('/') ? `/backend-media/${b.logo}` : `/backend-media/images/${b.logo}`)) : null
      }))}
    />
  );
}
