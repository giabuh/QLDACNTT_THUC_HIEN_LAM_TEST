// ============================================
// routes/attendance.js — Attendance API
// ============================================
const express = require('express');
const db = require('../../config/db');
const { authenticate } = require('../../middleware/auth');

const router = express.Router();

/**
 * POST /api/attendance/check-in
 * Body: { method, gpsLat, gpsLng, faceConfidence }
 */
router.post('/check-in', authenticate, async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    const { method = 'manual', gpsLat, gpsLng, faceConfidence } = req.body;
    const today = new Date().toISOString().split('T')[0];

    // Kiểm tra đã check-in chưa
    const existing = await db.query(
      'SELECT id FROM attendance_logs WHERE employee_id = $1 AND work_date = $2',
      [employeeId, today]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Bạn đã check-in hôm nay rồi',
      });
    }

    // Insert check-in (trigger sẽ auto tính late_minutes, status)
    const { rows } = await db.query(`
      INSERT INTO attendance_logs (
        employee_id, work_date, check_in_time, check_in_method,
        gps_lat, gps_lng, face_confidence
      ) VALUES ($1, $2, NOW(), $3, $4, $5, $6)
      RETURNING *
    `, [employeeId, today, method, gpsLat, gpsLng, faceConfidence]);

    return res.status(201).json({
      success: true,
      message: rows[0].late_minutes > 0
        ? `Check-in thành công (muộn ${rows[0].late_minutes} phút)`
        : 'Check-in thành công — Đúng giờ!',
      data: rows[0],
    });
  } catch (error) {
    console.error('❌ Check-in error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống khi check-in' });
  }
});

/**
 * POST /api/attendance/check-out
 * Body: { method }
 */
router.post('/check-out', authenticate, async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    const { method = 'manual' } = req.body;
    const today = new Date().toISOString().split('T')[0];

    // Tìm bản ghi check-in hôm nay
    const existing = await db.query(
      'SELECT id, check_out_time FROM attendance_logs WHERE employee_id = $1 AND work_date = $2',
      [employeeId, today]
    );

    if (existing.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Bạn chưa check-in hôm nay',
      });
    }

    if (existing.rows[0].check_out_time) {
      return res.status(409).json({
        success: false,
        message: 'Bạn đã check-out hôm nay rồi',
      });
    }

    // Update check-out (trigger sẽ auto tính work_hours, ot_hours)
    const { rows } = await db.query(`
      UPDATE attendance_logs 
      SET check_out_time = NOW(), check_out_method = $1
      WHERE id = $2
      RETURNING *
    `, [method, existing.rows[0].id]);

    return res.json({
      success: true,
      message: `Check-out thành công — Làm ${rows[0].work_hours}h${rows[0].ot_hours > 0 ? ` (OT: ${rows[0].ot_hours}h)` : ''}`,
      data: rows[0],
    });
  } catch (error) {
    console.error('❌ Check-out error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống khi check-out' });
  }
});

/**
 * GET /api/attendance
 * Query: ?date=2026-09-18&department=DEPT-IT&month=2026-09
 * RBAC: CEO/HRD → tất cả, MANAGER → phòng mình, NV → chỉ mình
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { date, department, month, employeeId: filterEmpId } = req.query;
    const params = [];
    let paramIndex = 1;
    let whereClause = 'WHERE 1=1';

    // RBAC
    if (req.user.roleCode === 'EMPLOYEE') {
      whereClause += ` AND a.employee_id = $${paramIndex}`;
      params.push(req.user.employeeId);
      paramIndex++;
    } else if (req.user.roleCode === 'LINE_MANAGER') {
      const { rows: mgrRows } = await db.query(
        'SELECT department_id FROM employees WHERE id = $1', [req.user.employeeId]
      );
      if (mgrRows.length > 0) {
        whereClause += ` AND e.department_id = $${paramIndex}`;
        params.push(mgrRows[0].department_id);
        paramIndex++;
      }
    }

    // Filter by specific employee
    if (filterEmpId) {
      whereClause += ` AND a.employee_id = $${paramIndex}`;
      params.push(filterEmpId);
      paramIndex++;
    }

    // Filter: date
    if (date) {
      whereClause += ` AND a.work_date = $${paramIndex}`;
      params.push(date);
      paramIndex++;
    }

    // Filter: month (YYYY-MM)
    if (month) {
      whereClause += ` AND TO_CHAR(a.work_date, 'YYYY-MM') = $${paramIndex}`;
      params.push(month);
      paramIndex++;
    }

    // Filter: department
    if (department) {
      whereClause += ` AND e.department_id = $${paramIndex}`;
      params.push(department);
      paramIndex++;
    }

    const { rows } = await db.query(`
      SELECT 
        a.*,
        e.full_name, e.avatar_url, e.job_title,
        d.name AS department_name
      FROM attendance_logs a
      JOIN employees e ON a.employee_id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
      ${whereClause}
      ORDER BY a.work_date DESC, e.full_name
      LIMIT 500
    `, params);

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ Get attendance error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

/**
 * GET /api/attendance/me/today
 * Trạng thái check-in/out hôm nay của NV đang login
 */
router.get('/me/today', authenticate, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { rows } = await db.query(
      'SELECT * FROM attendance_logs WHERE employee_id = $1 AND work_date = $2',
      [req.user.employeeId, today]
    );

    return res.json({
      success: true,
      data: rows.length > 0 ? rows[0] : null,
      checkedIn: rows.length > 0,
      checkedOut: rows.length > 0 && rows[0].check_out_time !== null,
    });
  } catch (error) {
    console.error('❌ Get today attendance error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

module.exports = router;
