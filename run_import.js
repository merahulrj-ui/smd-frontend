const mysql = require('mysql2/promise');
const fs = require('fs');

async function run() {
  console.log("Waiting for MySQL to start...");
  let pool = null;
  
  // Poll until connected
  while (true) {
    try {
      pool = mysql.createPool({
        host: '127.0.0.1',
        port: 3306,
        database: 'smd_medicare',
        user: 'root',
        password: '',
        multipleStatements: true
      });
      const [r] = await pool.query('SELECT 1 as ok');
      if (r[0].ok) {
        console.log("MySQL is UP!");
        break;
      }
    } catch (e) {
      // Ignore and retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  try {
    const sql = fs.readFileSync('insert_sunmax_products.sql', 'utf8');
    console.log("Running SQL Insert script...");
    await pool.query(sql);
    console.log("Successfully inserted all 13 products into the database!");
  } catch (err) {
    console.error("Error running SQL:", err);
  }
  process.exit(0);
}

run();
