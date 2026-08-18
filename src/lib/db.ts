import mysql from 'mysql2/promise';

let pool: mysql.Pool;

const isTiDB = process.env.DB_HOST?.includes('tidbcloud.com') || process.env.DB_SSL === 'true';

const dbConfig: mysql.PoolOptions = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || process.env.DB_DATABASE || 'smd_medicare',
  ssl: isTiDB ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

if (process.env.NODE_ENV === 'production') {
  pool = mysql.createPool(dbConfig);
} else {
  if (!(global as any).mysqlPool) {
    (global as any).mysqlPool = mysql.createPool(dbConfig);
  }
  pool = (global as any).mysqlPool;
}

export default pool;
