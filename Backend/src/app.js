const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/env');
const db = require('./config/db');
const catalog = require('./catalog');
const { authLimiter } = require('./middleware/rateLimit');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
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

// Routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth', require('./modules/auth/routes'));
app.use('/api/employees', require('./modules/employees/routes'));
app.use('/api/departments', require('./modules/departments/routes'));
app.use('/api/attendance', require('./modules/attendance/routes'));
app.use('/api/leaves', require('./modules/leaves/routes'));
app.use('/api/payroll', require('./modules/payroll/routes'));
app.use('/api/projects', require('./modules/projects/routes'));
app.use('/api/dashboard', require('./modules/dashboard/routes'));

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
