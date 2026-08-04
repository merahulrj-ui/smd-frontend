const mysql = require('mysql2/promise');
async function run() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'smd_medicare' });
  
  // Check how many subcategories have at least 1 product with image
  const [results] = await pool.query(`
    SELECT sc.id, sc.name, sc.category_id,
      (SELECT p.image FROM products p WHERE p.sub_category_id = sc.id AND p.image IS NOT NULL AND p.image != '' LIMIT 1) as prod_image
    FROM sub_categories sc
    WHERE sc.status = 1
  `);
  
  const withImg = results.filter(r => r.prod_image);
  const withoutImg = results.filter(r => !r.prod_image);
  
  console.log('Total active subcategories:', results.length);
  console.log('With product image:', withImg.length);
  console.log('Without product image:', withoutImg.length);
  console.log('\n--- WITH IMAGE (sample) ---');
  withImg.slice(0, 5).forEach(r => console.log(`  ${r.name}: ${r.prod_image}`));
  console.log('\n--- WITHOUT IMAGE (sample) ---');
  withoutImg.slice(0, 5).forEach(r => console.log(`  ${r.name}`));
  
  process.exit(0);
}
run();
