const mysql = require('mysql2/promise');
async function run() {
  const conn = await mysql.createConnection({
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '38EqdW68VzZqmuG.root',
    password: '98BnOadXorLe8co6',
    database: 'smd_medicare',
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
  });
  const [rows] = await conn.query('SELECT username, password FROM admin_users');
  console.log(rows);
  process.exit(0);
}
run();
