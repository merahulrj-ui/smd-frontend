const mysql = require('mysql2/promise');

async function main() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'smd_medicare'
  });
  
  const [rows] = await conn.execute('SELECT * FROM admins');
  console.log(rows);
  conn.end();
}
main();
