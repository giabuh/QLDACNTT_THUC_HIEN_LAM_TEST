// ============================================
// routes/departments.js — Department API
// ============================================
const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/departments
 * Danh sách phòng ban + số NV + trưởng phòng
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        d.id, d.name, d.description, d.budget_yearly, d.is_active,
        d.manager_id,
        m.full_name AS manager_name,
        m.avatar_url AS manager_avatar,
        COUNT(e.id) FILTER (WHERE e.status = 'DANG_LAM_VIEC') AS employee_count
      FROM departments d
      LEFT JOIN employees m ON d.manager_id = m.id
      LEFT JOIN employees e ON e.department_id = d.id
      WHERE d.is_active = true
      GROUP BY d.id, d.name, d.description, d.budget_yearly, d.is_active,
               d.manager_id, m.full_name, m.avatar_url
      ORDER BY d.name
    `);

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ Get departments error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

/**
 * GET /api/departments/:id/employees
 * Danh sách NV theo phòng ban
 */
router.get('/:id/employees', authenticate, async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        e.id, e.full_name, e.job_title, e.work_email, 
        e.avatar_url, e.status, e.kpi_score, e.attendance_rate,
        p.name AS position_name
      FROM employees e
      LEFT JOIN positions p ON e.position_id = p.id
      WHERE e.department_id = $1 AND e.status = 'DANG_LAM_VIEC'
      ORDER BY e.full_name
    `, [req.params.id]);

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ Get dept employees error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

module.exports = router;
