import mysql from 'mysql2/promise';

let pool: mysql.Pool;

if (process.env.NODE_ENV === 'production') {
  pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'smd_medicare',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
} else {
  if (!(global as any).mysqlPool) {
    (global as any).mysqlPool = mysql.createPool({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'smd_medicare',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  pool = (global as any).mysqlPool;
}

export default pool;
