import { MetadataRoute } from 'next';
import pool from '@/lib/db';

const BASE_URL = 'https://smdmedicare.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapData: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  try {
    // 1. Fetch Categories
    const [categories] = await pool.query('SELECT slug FROM categories WHERE status = 1') as any[];
    categories.forEach((cat: any) => {
      sitemapData.push({
        url: `${BASE_URL}/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    });

    // 2. Fetch Subcategories
    const [subcategories] = await pool.query(`
      SELECT sc.slug as sub_slug, c.slug as cat_slug 
      FROM sub_categories sc 
      JOIN categories c ON sc.category_id = c.id 
      WHERE sc.status = 1 AND c.status = 1
    `) as any[];
    subcategories.forEach((sub: any) => {
      sitemapData.push({
        url: `${BASE_URL}/category/${sub.cat_slug}/${sub.sub_slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });

    // 3. Fetch Products
    const [products] = await pool.query('SELECT slug FROM products WHERE status = "live" OR status = "1"') as any[];
    products.forEach((prod: any) => {
      sitemapData.push({
        url: `${BASE_URL}/product/${prod.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      });
    });

    // 4. Fetch Blog Posts
    const [blogs] = await pool.query('SELECT slug FROM blog WHERE status = 1') as any[];
    blogs.forEach((blog: any) => {
      sitemapData.push({
        url: `${BASE_URL}/blog/${blog.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return sitemapData;
}
