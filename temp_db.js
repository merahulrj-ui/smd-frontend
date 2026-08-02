const mysql = require('mysql2/promise');
async function run() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', database: 'smd_medicare' });
  const [rows1] = await pool.query('DESCRIBE blog');
  console.log('blog schema:', rows1);
  pool.end();
}
run();
