import pool from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  try {
    const [rows] = await pool.query('SELECT name, category FROM products WHERE slug = ? LIMIT 1', [resolvedParams.slug]) as any[];
    if (rows && rows.length > 0) {
      const product = rows[0];
      return {
        title: `${product.name} - Buy Online at SMD MEDICARE`,
        description: `Shop for high-quality ${product.name} online at wholesale prices on SMD Medicare.`
      };
    }
  } catch(e) {}
  
  return {
    title: 'Product Not Found - SMD MEDICARE',
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  let product: any = null;
  let relatedProducts: any[] = [];
  let brandLogo: string | null = null;
  
  try {
    // 1. Fetch main product
    const [prodRows] = await pool.query('SELECT * FROM products WHERE slug = ? LIMIT 1', [slug]) as any[];
    if (!prodRows || prodRows.length === 0) {
      return notFound();
    }
    product = prodRows[0];
    
    // Attempt to parse JSON specifications if stored as string, otherwise keep as is
    if (typeof product.specifications === 'string') {
      try {
        product.specifications = JSON.parse(product.specifications);
      } catch(e) {
        product.specifications = [];
      }
    }

    // 2. Fetch Brand Logo
    if (product.brand && product.brand !== '0' && product.brand !== '') {
      const [brandRows] = await pool.query('SELECT logo FROM brands WHERE name = ? LIMIT 1', [product.brand]) as any[];
      if (brandRows && brandRows.length > 0 && brandRows[0].logo) {
         const logoStr = brandRows[0].logo;
         brandLogo = logoStr.startsWith('http') ? logoStr : (logoStr.includes('/') ? `/backend-media/${logoStr}` : `/backend-media/images/${logoStr}`);
      }
    }

    // 3. Fetch Related Products (same category, excluding current product)
    const [relRows] = await pool.query(
      'SELECT id, name, slug, image, price, mrp FROM products WHERE category = ? AND id != ? AND status = 1 ORDER BY RAND() LIMIT 8', 
      [product.category, product.id]
    ) as any[];
    relatedProducts = relRows;

  } catch (err) {
    console.error("Failed to fetch product", err);
    return notFound();
  }

  return (
    <ProductClient 
      product={product} 
      relatedProducts={relatedProducts} 
      brandLogo={brandLogo} 
    />
  );
}
