// ============================================
// routes/payroll.js — Payroll API
// ============================================
const express = require('express');
const db = require('../../config/db');
const { authenticate } = require('../../middleware/auth');
const { requirePermission } = require('../../policies');

const router = express.Router();

/**
 * GET /api/payroll/periods
 * Danh sách kỳ lương
 */
router.get('/periods', authenticate, requirePermission('payroll.periods.read'), async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT * FROM payroll_periods ORDER BY period DESC LIMIT 24
    `);
    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ Get payroll periods error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

/**
 * GET /api/payroll/payslips
 * Query: ?period=2026-09
 * RBAC: CEO/HRD → tất cả, NV → chỉ mình
 */
router.get('/payslips', authenticate, async (req, res) => {
  try {
    const { period } = req.query;
    const params = [];
    let paramIndex = 1;
    let whereClause = 'WHERE 1=1';

    if (period) {
      whereClause += ` AND pp.period = $${paramIndex}`;
      params.push(period);
      paramIndex++;
    }

    // RBAC: NV chỉ xem mình, Manager xem phòng mình
    if (req.user.roleCode === 'EMPLOYEE') {
      whereClause += ` AND ps.employee_id = $${paramIndex}`;
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

    const { rows } = await db.query(`
      SELECT 
        ps.*,
        pp.period, pp.status AS period_status,
        e.full_name, e.avatar_url, e.job_title,
        d.name AS department_name
      FROM payslips ps
      JOIN payroll_periods pp ON ps.period_id = pp.id
      JOIN employees e ON ps.employee_id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
      ${whereClause}
      ORDER BY e.full_name
    `, params);

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ Get payslips error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

/**
 * GET /api/payroll/me
 * Phiếu lương của NV đang login
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        ps.*,
        pp.period, pp.status AS period_status
      FROM payslips ps
      JOIN payroll_periods pp ON ps.period_id = pp.id
      WHERE ps.employee_id = $1
      ORDER BY pp.period DESC
      LIMIT 12
    `, [req.user.employeeId]);

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ Get my payslips error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

/**
 * POST /api/payroll/calculate
 * Tính lương tháng cho tất cả NV (HRD only)
 * Body: { period: "2026-09" }
 */
router.post('/calculate', authenticate, requirePermission('payroll.calculate'), async (req, res) => {
  const client = await db.getClient();
  try {
    const { period } = req.body; // format: "2026-09"
    if (!period || !/^\d{4}-\d{2}$/.test(period)) {
      return res.status(400).json({ success: false, message: 'Period format phải là YYYY-MM' });
    }

    await client.query('BEGIN');

    // Tạo hoặc lấy payroll_period
    let periodRow;
    const existingPeriod = await client.query(
      'SELECT * FROM payroll_periods WHERE period = $1', [period]
    );

    if (existingPeriod.rows.length > 0) {
      periodRow = existingPeriod.rows[0];
      // Xóa payslips cũ để tính lại
      await client.query('DELETE FROM payslips WHERE period_id = $1', [periodRow.id]);
    } else {
      const { rows } = await client.query(
        "INSERT INTO payroll_periods (period) VALUES ($1) RETURNING *", [period]
      );
      periodRow = rows[0];
    }

    // Lấy tất cả NV active
    const { rows: employees } = await client.query(
      "SELECT id, base_salary, bank_account, bank_name FROM employees WHERE status = 'DANG_LAM_VIEC'"
    );

    let totalNet = 0;
    let totalBhxh = 0;
    let totalTax = 0;
    let totalOtHours = 0;

    for (const emp of employees) {
      const base = parseFloat(emp.base_salary) || 0;

      // Đếm số ngày làm việc thực tế và giờ OT từ bảng attendance_logs
      const { rows: attRows } = await client.query(`
        SELECT 
          COUNT(*) FILTER (WHERE status != 'VANG_KHONG_PHEP') AS work_days,
          COALESCE(SUM(ot_hours), 0) AS total_ot
        FROM attendance_logs
        WHERE employee_id = $1 AND TO_CHAR(work_date, 'YYYY-MM') = $2
      `, [emp.id, period]);

      const loggedDays = parseInt(attRows[0]?.work_days) || 0;
      const actualWorkDays = loggedDays > 0 ? loggedDays : 22;
      const otHours = parseFloat(attRows[0]?.total_ot) || 0;
      totalOtHours += otHours;

      const otPay = Math.round(otHours * (base / 22 / 8 * 1.5));
      const allowances = 1500000; // Phụ cấp trưa + xăng xe
      const salaryByDays = Math.round((base / 22) * actualWorkDays);
      const gross = salaryByDays + otPay + allowances;

      // Tính các khoản khấu trừ theo Luật LĐ VN
      const bhxh = Math.round(base * 0.08);
      const bhyt = Math.round(base * 0.015);
      const bhtn = Math.round(base * 0.01);
      const taxableIncome = Math.max(0, gross - bhxh - bhyt - bhtn - 11000000); // Giảm trừ gia cảnh 11tr
      const pit = taxableIncome > 0 ? Math.round(taxableIncome * 0.05) : 0; // Bậc 1: 5%
      const totalDeductions = bhxh + bhyt + bhtn + pit;
      const net = gross - totalDeductions;

      await client.query(`
        INSERT INTO payslips (
          period_id, employee_id, base_salary, actual_work_days, standard_work_days,
          ot_hours, ot_pay, allowances, gross_income,
          bhxh_amount, bhyt_amount, bhtn_amount, pit_deduction, pit_taxable, pit_amount,
          total_deductions, net_salary, status, bank_account, bank_name
        ) VALUES (
          $1, $2, $3, $4, 22,
          $5, $6, $7, $8,
          $9, $10, $11, 11000000, $12, $13,
          $14, $15, 'DU_THAO', $16, $17
        )
      `, [
        periodRow.id, emp.id, base, actualWorkDays,
        otHours, otPay, allowances, gross,
        bhxh, bhyt, bhtn, taxableIncome, pit,
        totalDeductions, net, emp.bank_account, emp.bank_name
      ]);

      totalNet += net;
      totalBhxh += bhxh;
      totalTax += pit;
    }

    // Cập nhật tổng kỳ lương
    await client.query(`
      UPDATE payroll_periods SET
        total_headcount = $1, total_net = $2, total_bhxh = $3, total_tax = $4, total_ot_hours = $5
      WHERE id = $6
    `, [employees.length, totalNet, totalBhxh, totalTax, totalOtHours, periodRow.id]);

    await client.query('COMMIT');

    return res.json({
      success: true,
      message: `Đã tính lương tháng ${period} cho ${employees.length} nhân viên`,
      data: { period, headcount: employees.length, totalNet, totalBhxh, totalTax },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Calculate payroll error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  } finally {
    client.release();
  }
});

module.exports = router;
