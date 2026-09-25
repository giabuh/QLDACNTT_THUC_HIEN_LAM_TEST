// ============================================
// routes/leaves.js — Leave Request API (2-cấp duyệt)
// ============================================
const express = require('express');
const db = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/leaves
 * NV nộp đơn nghỉ phép
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const leaveTypeId = req.body.leaveTypeId || req.body.leave_type_id;
    const startDate = req.body.startDate || req.body.start_date;
    const endDate = req.body.endDate || req.body.end_date;
    const totalDays = req.body.totalDays || req.body.total_days;
    const reason = req.body.reason;
    const handoverTo = req.body.handoverTo || req.body.handover_to;
    const attachmentUrl = req.body.attachmentUrl || req.body.attachment_url;
    const attachmentName = req.body.attachmentName || req.body.attachment_name;

    if (!leaveTypeId || !startDate || !endDate || !totalDays || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin: loại phép, ngày bắt đầu, kết thúc, số ngày, lý do',
      });
    }

    // Kiểm tra số dư phép
    const { rows: balRows } = await db.query(
      `SELECT remaining_days FROM leave_balances 
       WHERE employee_id = $1 AND leave_type_id = $2 AND year = EXTRACT(YEAR FROM CURRENT_DATE)`,
      [req.user.employeeId, leaveTypeId]
    );

    if (balRows.length > 0 && balRows[0].remaining_days < totalDays) {
      return res.status(400).json({
        success: false,
        message: `Không đủ ngày phép. Còn lại: ${balRows[0].remaining_days} ngày`,
      });
    }

    // Tạo ID: LP-YYYY-XXX
    const year = new Date().getFullYear();
    const { rows: countRows } = await db.query(
      "SELECT COUNT(*) FROM leave_requests WHERE id LIKE $1",
      [`LP-${year}-%`]
    );
    const nextNum = parseInt(countRows[0].count) + 1;
    const leaveId = `LP-${year}-${String(nextNum).padStart(3, '0')}`;

    const { rows } = await db.query(`
      INSERT INTO leave_requests (
        id, employee_id, leave_type_id, start_date, end_date,
        total_days, reason, handover_to, attachment_url, attachment_name,
        stage
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'CHO_TRUONG_PHONG_DUYET')
      RETURNING *
    `, [leaveId, req.user.employeeId, leaveTypeId, startDate, endDate,
        totalDays, reason, handoverTo, attachmentUrl, attachmentName]);

    return res.status(201).json({
      success: true,
      message: 'Đã nộp đơn nghỉ phép — Chờ Trưởng phòng duyệt',
      data: rows[0],
    });
  } catch (error) {
    console.error('❌ Create leave error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

/**
 * GET /api/leaves
 * Query: ?stage=&employeeId=&month=
 * RBAC: CEO/HRD → tất cả, MANAGER → phòng mình, NV → chỉ mình
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { stage, month } = req.query;
    const params = [];
    let paramIndex = 1;
    let whereClause = 'WHERE 1=1';

    // RBAC
    if (req.user.roleCode === 'EMPLOYEE') {
      whereClause += ` AND lr.employee_id = $${paramIndex}`;
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

    if (stage) {
      whereClause += ` AND lr.stage = $${paramIndex}`;
      params.push(stage);
      paramIndex++;
    }

    if (month) {
      whereClause += ` AND TO_CHAR(lr.start_date, 'YYYY-MM') = $${paramIndex}`;
      params.push(month);
      paramIndex++;
    }

    const { rows } = await db.query(`
      SELECT 
        lr.*,
        e.full_name, e.avatar_url, e.job_title,
        d.name AS department_name,
        lt.name AS leave_type_name, lt.code AS leave_type_code,
        ma.full_name AS manager_approver_name,
        ha.full_name AS hr_approver_name
      FROM leave_requests lr
      JOIN employees e ON lr.employee_id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
      JOIN leave_types lt ON lr.leave_type_id = lt.id
      LEFT JOIN employees ma ON lr.manager_approved_by = ma.id
      LEFT JOIN employees ha ON lr.hr_approved_by = ha.id
      ${whereClause}
      ORDER BY lr.submitted_at DESC
      LIMIT 200
    `, params);

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ Get leaves error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

/**
 * GET /api/leaves/balances/:employeeId
 * Số dư phép năm hiện tại
 */
router.get('/balances/:employeeId', authenticate, async (req, res) => {
  try {
    const empId = req.params.employeeId === 'me' ? req.user.employeeId : req.params.employeeId;

    // RBAC
    if (req.user.roleCode === 'EMPLOYEE' && empId !== req.user.employeeId) {
      return res.status(403).json({ success: false, message: 'Không có quyền xem phép của người khác' });
    }

    const { rows } = await db.query(`
      SELECT lb.*, lt.name AS leave_type_name, lt.code AS leave_type_code, lt.is_paid
      FROM leave_balances lb
      JOIN leave_types lt ON lb.leave_type_id = lt.id
      WHERE lb.employee_id = $1 AND lb.year = EXTRACT(YEAR FROM CURRENT_DATE)
      ORDER BY lt.name
    `, [empId]);

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ Get balances error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

/**
 * GET /api/leaves/types
 * Danh sách loại phép
 */
router.get('/types', authenticate, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM leave_types ORDER BY name');
    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ Get leave types error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

/**
 * PATCH /api/leaves/:id/approve
 * Duyệt phép (Manager cấp 1 hoặc HR cấp 2)
 * Body: { note }
 */
router.patch('/:id/approve', authenticate, authorize('CEO', 'HR_DIRECTOR', 'LINE_MANAGER'), async (req, res) => {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const { note } = req.body;
    const leaveId = req.params.id;

    // Lấy đơn phép hiện tại
    const { rows } = await client.query('SELECT * FROM leave_requests WHERE id = $1', [leaveId]);
    if (rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn phép' });
    }

    const leave = rows[0];

    // Xử lý theo stage hiện tại
    if (leave.stage === 'CHO_TRUONG_PHONG_DUYET' &&
        (req.user.roleCode === 'LINE_MANAGER' || req.user.roleCode === 'CEO')) {
      // Cấp 1: Manager duyệt → chuyển sang CHO_HR_PHE_CHUAN
      await client.query(`
        UPDATE leave_requests SET
          stage = 'CHO_HR_PHE_CHUAN',
          manager_approved_by = $1,
          manager_approved_at = NOW(),
          manager_note = $2
        WHERE id = $3
      `, [req.user.employeeId, note || 'Đồng ý', leaveId]);

      await client.query('COMMIT');
      return res.json({
        success: true,
        message: 'Đã duyệt cấp 1 — Chờ HR phê chuẩn',
      });

    } else if (leave.stage === 'CHO_HR_PHE_CHUAN' &&
               (req.user.roleCode === 'HR_DIRECTOR' || req.user.roleCode === 'CEO')) {
      // Cấp 2: HR duyệt → DA_PHE_DUYET (trigger auto trừ phép)
      await client.query(`
        UPDATE leave_requests SET
          stage = 'DA_PHE_DUYET',
          hr_approved_by = $1,
          hr_approved_at = NOW(),
          hr_note = $2
        WHERE id = $3
      `, [req.user.employeeId, note || 'Phê chuẩn', leaveId]);

      await client.query('COMMIT');
      return res.json({
        success: true,
        message: 'Đã phê chuẩn — Nghỉ phép được duyệt',
      });

    } else {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: `Không thể duyệt đơn ở stage "${leave.stage}" với vai trò "${req.user.roleCode}"`,
      });
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Approve leave error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  } finally {
    client.release();
  }
});

/**
 * PATCH /api/leaves/:id/reject
 * Từ chối phép
 */
router.patch('/:id/reject', authenticate, authorize('CEO', 'HR_DIRECTOR', 'LINE_MANAGER'), async (req, res) => {
  try {
    const { note } = req.body;
    if (!note) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập lý do từ chối' });
    }

    const { rows } = await db.query('SELECT stage FROM leave_requests WHERE id = $1', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn phép' });
    }

    if (!['CHO_TRUONG_PHONG_DUYET', 'CHO_HR_PHE_CHUAN'].includes(rows[0].stage)) {
      return res.status(400).json({ success: false, message: 'Đơn không ở trạng thái có thể từ chối' });
    }

    await db.query(`
      UPDATE leave_requests SET
        stage = 'TU_CHOI',
        manager_note = CASE WHEN stage = 'CHO_TRUONG_PHONG_DUYET' THEN $1 ELSE manager_note END,
        hr_note = CASE WHEN stage = 'CHO_HR_PHE_CHUAN' THEN $1 ELSE hr_note END
      WHERE id = $2
    `, [note, req.params.id]);

    return res.json({ success: true, message: 'Đã từ chối đơn nghỉ phép' });
  } catch (error) {
    console.error('❌ Reject leave error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

/**
 * PATCH /api/leaves/:id/cancel
 * NV hủy đơn (chỉ khi chưa duyệt hoàn tất)
 */
router.patch('/:id/cancel', authenticate, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT employee_id, stage FROM leave_requests WHERE id = $1', [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn phép' });
    }

    if (rows[0].employee_id !== req.user.employeeId) {
      return res.status(403).json({ success: false, message: 'Bạn chỉ có thể hủy đơn của mình' });
    }

    if (rows[0].stage === 'TU_CHOI' || rows[0].stage === 'DA_HUY') {
      return res.status(400).json({ success: false, message: 'Đơn đã bị từ chối hoặc đã hủy' });
    }

    // DA_PHE_DUYET → DA_HUY: trigger sẽ auto hoàn phép
    await db.query("UPDATE leave_requests SET stage = 'DA_HUY' WHERE id = $1", [req.params.id]);

    return res.json({ success: true, message: 'Đã hủy đơn nghỉ phép' });
  } catch (error) {
    console.error('❌ Cancel leave error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

module.exports = router;
