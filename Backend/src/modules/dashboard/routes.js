// ============================================
// routes/dashboard.js — Dashboard Stats API
// ============================================
const express = require('express');
const db = require('../../config/db');
const { authenticate } = require('../../middleware/auth');

const router = express.Router();

/**
 * GET /api/dashboard/stats
 * KPIs cho Dashboard (refresh materialized view)
 */
router.get('/stats', authenticate, async (req, res) => {
  try {
    // Refresh materialized view
    await db.query('REFRESH MATERIALIZED VIEW mv_dashboard_stats');

    const { rows } = await db.query('SELECT * FROM mv_dashboard_stats');

    // Thêm thông tin chi tiết
    const { rows: deptStats } = await db.query(`
      SELECT d.id, d.name, COUNT(e.id) AS headcount
      FROM departments d
      LEFT JOIN employees e ON e.department_id = d.id AND e.status = 'DANG_LAM_VIEC'
      WHERE d.is_active = true
      GROUP BY d.id, d.name
      ORDER BY headcount DESC
    `);

    const { rows: recentLeaves } = await db.query(`
      SELECT lr.id, lr.stage, lr.total_days, lr.start_date,
             e.full_name, lt.name AS leave_type
      FROM leave_requests lr
      JOIN employees e ON lr.employee_id = e.id
      JOIN leave_types lt ON lr.leave_type_id = lt.id
      WHERE lr.stage IN ('CHO_TRUONG_PHONG_DUYET', 'CHO_HR_PHE_CHUAN')
      ORDER BY lr.submitted_at DESC
      LIMIT 5
    `);

    return res.json({
      success: true,
      data: {
        overview: rows[0] || {},
        departmentStats: deptStats,
        pendingLeaves: recentLeaves,
      },
    });
  } catch (error) {
    console.error('❌ Get dashboard stats error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

/**
 * GET /api/dashboard/notifications
 * Thông báo theo vai trò
 */
router.get('/notifications', authenticate, async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT * FROM notifications
      WHERE user_id = (SELECT id FROM users WHERE employee_id = $1 LIMIT 1)
         OR role_target = $2
      ORDER BY created_at DESC
      LIMIT 30
    `, [req.user.employeeId, req.user.roleCode]);

    const unreadCount = rows.filter(n => !n.is_read).length;

    return res.json({ success: true, data: rows, unreadCount });
  } catch (error) {
    console.error('❌ Get notifications error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

module.exports = router;
