import mysql from 'mysql2/promise';

let pool: mysql.Pool;

if (process.env.NODE_ENV === 'production') {
  pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smd_medicare',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
} else {
  if (!(global as any).mysqlPool) {
    (global as any).mysqlPool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'smd_medicare',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  pool = (global as any).mysqlPool;
}

export default pool;
