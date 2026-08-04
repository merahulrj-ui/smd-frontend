const mysql = require('mysql2/promise');

async function cleanDB() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'smd_medicare'
  });

  const tablesToDrop = [
    'cache',
    'cache_locks',
    'failed_jobs',
    'job_batches',
    'jobs',
    'migrations',
    'password_reset_tokens',
    'sessions',
    'users'
  ];

  for (const table of tablesToDrop) {
    try {
      await conn.query(`DROP TABLE IF EXISTS ${table}`);
      console.log(`Dropped table: ${table}`);
    } catch (e) {
      console.error(`Failed to drop ${table}:`, e.message);
    }
  }

  conn.end();
  console.log("Cleanup complete!");
}

cleanDB().catch(console.error);
