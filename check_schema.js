const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env' });
const fs = require('fs');

async function check() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smd_medicare',
    port: parseInt(process.env.DB_PORT || '3306')
  });

  try {
    const [products] = await connection.execute('SELECT id, category_id, category, sub_category_id FROM products LIMIT 5');
    const [categories] = await connection.execute('SELECT id, name FROM categories LIMIT 5');
    
    const output = JSON.stringify({ products, categories }, null, 2);
    fs.writeFileSync('c:\\Users\\merah\\.gemini\\antigravity\\brain\\49f4ab21-e64b-40e8-9896-3aca64349a4b\\scratch\\db_dump.json', output);
    console.log("Dumped successfully");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await connection.end();
  }
}

check();
