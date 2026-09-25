// ============================================
// server.js — NEXUS HR Backend Entry Point
// ============================================
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 8000;

// ============================================
// Middleware
// ============================================
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging (dev)
if (process.env.NODE_ENV === 'development') {
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

// ============================================
// Routes
// ============================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/payroll', require('./routes/payroll'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/dashboard', require('./routes/dashboard'));

// ============================================
// Health Check
// ============================================
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

// API Routes listing
app.get('/api', (req, res) => {
  res.json({
    name: 'NEXUS HR Management System API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/login': 'Đăng nhập',
        'GET  /api/auth/me': 'Thông tin cá nhân',
        'POST /api/auth/change-password': 'Đổi mật khẩu',
      },
      employees: {
        'GET  /api/employees': 'Danh sách NV (search, filter, pagination)',
        'GET  /api/employees/:id': 'Chi tiết NV',
        'POST /api/employees': 'Thêm NV (HRD/CEO)',
        'PUT  /api/employees/:id': 'Sửa NV (HRD/CEO)',
      },
      departments: {
        'GET  /api/departments': 'Danh sách phòng ban',
        'GET  /api/departments/:id/employees': 'NV theo phòng ban',
      },
      attendance: {
        'POST /api/attendance/check-in': 'Check-in',
        'POST /api/attendance/check-out': 'Check-out',
        'GET  /api/attendance': 'Lịch sử chấm công',
        'GET  /api/attendance/me/today': 'Trạng thái hôm nay',
      },
      leaves: {
        'POST  /api/leaves': 'Nộp đơn phép',
        'GET   /api/leaves': 'Danh sách đơn phép',
        'GET   /api/leaves/types': 'Loại phép',
        'GET   /api/leaves/balances/:empId': 'Số dư phép',
        'PATCH /api/leaves/:id/approve': 'Duyệt phép (2 cấp)',
        'PATCH /api/leaves/:id/reject': 'Từ chối phép',
        'PATCH /api/leaves/:id/cancel': 'Hủy đơn phép',
      },
      payroll: {
        'GET  /api/payroll/periods': 'Kỳ lương',
        'GET  /api/payroll/payslips': 'Phiếu lương',
        'GET  /api/payroll/me': 'Lương cá nhân',
        'POST /api/payroll/calculate': 'Tính lương tháng (HRD)',
      },
      projects: {
        'GET   /api/projects': 'Danh sách dự án',
        'GET   /api/projects/:id/tasks': 'Tasks theo dự án',
        'PATCH /api/projects/tasks/:id/stage': 'Chuyển Kanban stage',
        'GET   /api/projects/squads': 'Danh sách squads',
      },
      dashboard: {
        'GET /api/dashboard/stats': 'KPIs Dashboard',
        'GET /api/dashboard/notifications': 'Thông báo',
      },
    },
  });
});

// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} không tồn tại`,
  });
});

// ============================================
// Error Handler
// ============================================
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, async () => {
  console.log('');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   🚀 NEXUS HR Backend API                 ║');
  console.log(`║   📡 http://localhost:${PORT}                 ║`);
  console.log(`║   📖 http://localhost:${PORT}/api              ║`);
  console.log(`║   💚 http://localhost:${PORT}/api/health       ║`);
  console.log('╚════════════════════════════════════════════╝');
  console.log('');

  // Test DB connection
  try {
    const result = await db.query('SELECT COUNT(*) AS tables FROM information_schema.tables WHERE table_schema = $1', ['public']);
    console.log(`📦 Database: ${process.env.DB_NAME} (${result.rows[0].tables} tables)`);
    console.log(`🔗 PostgreSQL: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
});
