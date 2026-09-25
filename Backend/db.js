// ============================================
// db.js — PostgreSQL Connection Pool
// ============================================
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // Connection pool settings
  max: 20,                // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Log khi kết nối thành công
pool.on('connect', () => {
  console.log('📦 PostgreSQL connected to', process.env.DB_NAME);
});

// Log khi có lỗi
pool.on('error', (err) => {
  console.error('❌ PostgreSQL pool error:', err.message);
});

/**
 * Helper: Chạy 1 query đơn giản
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters ($1, $2, ...)
 * @returns {Promise<pg.QueryResult>}
 * 
 * Ví dụ:
 *   const { rows } = await db.query('SELECT * FROM employees WHERE id = $1', ['NV-0842']);
 */
const query = (text, params) => pool.query(text, params);

/**
 * Helper: Lấy 1 client từ pool (dùng cho transactions)
 * 
 * Ví dụ:
 *   const client = await db.getClient();
 *   try {
 *     await client.query('BEGIN');
 *     await client.query('INSERT INTO ...');
 *     await client.query('COMMIT');
 *   } catch (e) {
 *     await client.query('ROLLBACK');
 *     throw e;
 *   } finally {
 *     client.release();
 *   }
 */
const getClient = () => pool.connect();

module.exports = { pool, query, getClient };
