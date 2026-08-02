const mysql = require('mysql2/promise');

async function debug() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smd_medicare',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    const [subcats] = await pool.query('SELECT id, name, slug, category_id FROM sub_categories WHERE name LIKE "%ecg%" OR slug LIKE "%ecg%"');
    console.log("Subcategories matching ECG:", subcats);

    if (subcats.length > 0) {
      const subcatId = subcats[0].id;
      const catId = subcats[0].category_id;
      
      const [products] = await pool.query('SELECT id, name, category_id, sub_category_id FROM products WHERE sub_category_id = ? OR name LIKE "%ecg%" LIMIT 5', [subcatId]);
      console.log(`Products in subcat ${subcatId} or matching ECG:`, products);
      
      const [cats] = await pool.query('SELECT id, name, slug FROM categories WHERE id = ?', [catId]);
      console.log("Parent Category:", cats);
    } else {
       // Maybe search products directly
       const [products] = await pool.query('SELECT id, name, category_id, sub_category_id, category FROM products WHERE name LIKE "%ecg%" LIMIT 5');
       console.log("Products matching ECG (by name):", products);
    }
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

debug();
