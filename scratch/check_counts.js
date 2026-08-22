const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function check() {
  const isTiDB = process.env.DB_HOST?.includes('tidbcloud.com') || process.env.DB_SSL === 'true';
  const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || process.env.DB_DATABASE || 'smd_medicare',
    ssl: isTiDB ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
  });

  try {
    // Old Queries
    const [oldCat] = await pool.query('SELECT slug FROM categories WHERE status = 1 OR status = "1"');
    const [oldSub] = await pool.query(`SELECT sc.slug as sub_slug, c.slug as cat_slug FROM sub_categories sc JOIN categories c ON sc.category_id = c.id WHERE (sc.status = 1 OR sc.status = "1") AND (c.status = 1 OR c.status = "1")`);
    const [oldProd] = await pool.query(`SELECT slug FROM products WHERE status = 'live' OR status = 'active' OR status = '1' OR status = 1 OR status IS NULL`);
    const [oldBlog] = await pool.query(`SELECT slug FROM blog WHERE status = 1 OR status = "1" OR status = "published"`);

    // New Queries
    const [newCat] = await pool.query(`SELECT DISTINCT c.slug FROM categories c INNER JOIN products p ON (p.category_id = c.id OR p.category = c.name) WHERE c.status = 1 AND p.status = 'live'`);
    const [newSub] = await pool.query(`SELECT DISTINCT sc.slug as sub_slug, c.slug as cat_slug FROM sub_categories sc JOIN categories c ON sc.category_id = c.id INNER JOIN products p ON p.sub_category_id = sc.id WHERE sc.status = 1 AND c.status = 1 AND p.status = 'live'`);
    
    // Core pages
    const corePages = 5; // Home, About, Contact, Categories, Blogs

    const oldTotal = corePages + oldCat.length + oldSub.length + oldProd.length + oldBlog.length;
    const newTotal = corePages + newCat.length + newSub.length + oldProd.length + oldBlog.length;

    console.log(`Old Categories: ${oldCat.length}`);
    console.log(`Old Subcategories: ${oldSub.length}`);
    console.log(`New Categories (with products): ${newCat.length}`);
    console.log(`New Subcategories (with products): ${newSub.length}`);
    console.log(`Products: ${oldProd.length}`);
    console.log(`Blogs: ${oldBlog.length}`);
    console.log('-------------------------');
    console.log(`Total Pages Before: ${oldTotal}`);
    console.log(`Total Pages After: ${newTotal}`);

  } catch (err) {
    console.error('SQL Error:', err);
  }

  process.exit(0);
}
check();
