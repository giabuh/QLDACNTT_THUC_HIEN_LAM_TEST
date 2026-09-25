const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { parseTrustProxy } = require('../utils/trustProxy');

const isTest = process.env.NODE_ENV === 'test';

const list = (value, fallback) =>
  value ? value.split(',').map((s) => s.trim()).filter(Boolean) : fallback;

const defaultOrigins = [3000, 3001, 3002, 3003, 3004, 3005, 5173].flatMap((port) => [
  `http://localhost:${port}`,
  `http://127.0.0.1:${port}`,
]);

const config = {
  env: process.env.NODE_ENV || 'development',
  isTest,
  port: parseInt(process.env.PORT || '8000', 10),
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: isTest ? process.env.DB_NAME_TEST || 'nexus_hrms_test' : process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  trustProxy: parseTrustProxy(process.env.TRUST_PROXY),
  corsOrigins: [
    ...new Set([...list(process.env.CORS_ORIGINS, defaultOrigins), process.env.FRONTEND_URL].filter(Boolean)),
  ],
};

if (isTest && !/^[a-z0-9_]+_test$/.test(config.db.database || '')) {
  throw new Error(`Refusing to run in test mode against database "${config.db.database}": its name must end with _test`);
}

if (!config.jwt.secret) {
  throw new Error('JWT_SECRET is required (set it in Backend/.env)');
}

module.exports = config;
