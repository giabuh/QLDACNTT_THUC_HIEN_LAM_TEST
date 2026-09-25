const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const db = require('./config/db');
const catalog = require('./catalog');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: config.corsOrigins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging (dev only)
if (config.env === 'development') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const ms = Date.now() - start;
      const color = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
      console.log(`${color}${req.method}\x1b[0m ${req.originalUrl} → ${res.statusCode} (${ms}ms)`);
    });
    next();
  });
}

// Routes (moved into src/modules in Task 5)
app.use('/api/auth', require('../routes/auth'));
app.use('/api/employees', require('../routes/employees'));
app.use('/api/departments', require('../routes/departments'));
app.use('/api/attendance', require('../routes/attendance'));
app.use('/api/leaves', require('../routes/leaves'));
app.use('/api/payroll', require('../routes/payroll'));
app.use('/api/projects', require('../routes/projects'));
app.use('/api/dashboard', require('../routes/dashboard'));

app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW() AS server_time, current_database() AS db_name');
    return res.json({
      status: 'OK',
      server: 'NEXUS HR Backend API',
      database: result.rows[0].db_name,
      serverTime: result.rows[0].server_time,
      uptime: Math.floor(process.uptime()) + 's',
    });
  } catch (error) {
    return res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

app.get('/api', (req, res) => res.json(catalog));

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
