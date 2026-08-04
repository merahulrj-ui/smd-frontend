const mysql = require('mysql2/promise');

async function analyze() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'smd_medicare'
  });

  const [tables] = await conn.query('SHOW TABLES');
  
  for (const t of tables) {
    const tableName = Object.values(t)[0];
    const [cols] = await conn.query(`DESCRIBE ${tableName}`);
    
    console.log(`\n=== Table: ${tableName} ===`);
    cols.forEach(c => {
      console.log(`- ${c.Field} (${c.Type})`);
    });
    
    const [count] = await conn.query(`SELECT COUNT(*) as c FROM ${tableName}`);
    console.log(`Row count: ${count[0].c}`);
  }

  conn.end();
}

analyze().catch(console.error);
