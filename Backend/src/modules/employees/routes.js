// ============================================
// routes/employees.js — Employee CRUD API
// ============================================
const express = require('express');
const db = require('../../config/db');
const { authenticate } = require('../../middleware/auth');
const { requirePermission } = require('../../policies');

const router = express.Router();

/**
 * GET /api/employees
 * Query: ?search=&department=&status=&page=1&limit=20
 * RBAC: CEO, HR_DIRECTOR → tất cả NV
 *       LINE_MANAGER → chỉ NV cùng phòng
 *       EMPLOYEE → chỉ thông tin public
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { search, department, status, page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    let paramIndex = 1;

    // Base query
    let whereClause = 'WHERE 1=1';

    // RBAC: LINE_MANAGER chỉ xem phòng mình
    if (req.user.roleCode === 'LINE_MANAGER') {
      const { rows: empRows } = await db.query(
        'SELECT department_id FROM employees WHERE id = $1', [req.user.employeeId]
      );
      if (empRows.length > 0 && empRows[0].department_id) {
        whereClause += ` AND e.department_id = $${paramIndex}`;
        params.push(empRows[0].department_id);
        paramIndex++;
      }
    }

    // Filter: search (tên, email, mã NV)
    if (search) {
      whereClause += ` AND (
        e.full_name ILIKE $${paramIndex} OR
        e.work_email ILIKE $${paramIndex} OR
        e.id ILIKE $${paramIndex} OR
        e.phone_number ILIKE $${paramIndex}
      )`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Filter: department
    if (department) {
      whereClause += ` AND e.department_id = $${paramIndex}`;
      params.push(department);
      paramIndex++;
    }

    // Filter: status
    if (status) {
      whereClause += ` AND e.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    // Count total
    const countResult = await db.query(
      `SELECT COUNT(*) FROM employees e ${whereClause}`, params
    );
    const total = parseInt(countResult.rows[0].count);

    // Main query
    const dataParams = [...params, parseInt(limit), offset];
    const { rows } = await db.query(`
      SELECT 
        e.id, e.full_name, e.job_title, e.work_email, e.phone_number,
        e.date_of_birth, e.gender, e.address, e.avatar_url,
        e.joined_date, e.status, e.contract_type,
        e.kpi_score, e.attendance_rate,
        e.base_salary,
        e.citizen_id, e.bank_account, e.bank_name,
        e.manager_id, e.department_id, e.position_id,
        d.name AS department_name,
        p.name AS position_name,
        m.full_name AS manager_name,
        COALESCE(lb.remaining_days, 12) AS leave_balance
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN positions p ON e.position_id = p.id
      LEFT JOIN employees m ON e.manager_id = m.id
      LEFT JOIN leave_balances lb ON lb.employee_id = e.id AND lb.year = EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER AND lb.leave_type_id = 'LT-AL'
      ${whereClause}
      ORDER BY e.id
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, dataParams);

    // RBAC: EMPLOYEE chỉ xem thông tin public (ẩn lương, CCCD người khác)
    const isRestricted = req.user.roleCode === 'EMPLOYEE';
    const sanitized = rows.map(emp => {
      if (isRestricted && emp.id !== req.user.employeeId) {
        const { base_salary, citizen_id, bank_account, bank_name, ...publicInfo } = emp;
        return publicInfo;
      }
      return emp;
    });

    return res.json({
      success: true,
      data: sanitized,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('❌ Get employees error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

/**
 * GET /api/employees/:id
 * Chi tiết 1 nhân viên (Profile 360)
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // RBAC: EMPLOYEE chỉ xem chính mình
    if (req.user.roleCode === 'EMPLOYEE' && req.user.employeeId !== id) {
      return res.status(403).json({
        success: false,
        message: 'Bạn chỉ có thể xem thông tin cá nhân của mình',
      });
    }

    const { rows } = await db.query(`
      SELECT 
        e.*,
        d.name AS department_name,
        p.name AS position_name,
        p.level AS position_level,
        m.full_name AS manager_name,
        m.job_title AS manager_title
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN positions p ON e.position_id = p.id
      LEFT JOIN employees m ON e.manager_id = m.id
      WHERE e.id = $1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhân viên' });
    }

    // LINE_MANAGER: ẩn lương, CCCD nếu không phải NV cùng phòng
    const emp = rows[0];

    return res.json({ success: true, data: emp });
  } catch (error) {
    console.error('❌ Get employee error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

/**
 * POST /api/employees
 * Thêm nhân viên mới (HRD/CEO only)
 */
router.post('/', authenticate, requirePermission('employee.create'), async (req, res) => {
  try {
    const {
      id, fullName, departmentId, positionId, jobTitle,
      workEmail, phoneNumber, citizenId, dateOfBirth,
      gender, address, baseSalary, contractType, joinedDate,
      managerId, avatarUrl, bankAccount, bankName,
    } = req.body;

    // Validate required
    if (!id || !fullName || !jobTitle || !workEmail || !joinedDate) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: id, fullName, jobTitle, workEmail, joinedDate',
      });
    }

    // Check duplicate ID
    const existing = await db.query('SELECT id FROM employees WHERE id = $1', [id]);
    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Mã nhân viên ${id} đã tồn tại`,
      });
    }

    // Check duplicate email
    const existingEmail = await db.query('SELECT id FROM employees WHERE work_email = $1', [workEmail]);
    if (existingEmail.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Email ${workEmail} đã được sử dụng`,
      });
    }

    const { rows } = await db.query(`
      INSERT INTO employees (
        id, full_name, department_id, position_id, job_title,
        work_email, phone_number, citizen_id, date_of_birth,
        gender, address, base_salary, contract_type, joined_date,
        manager_id, avatar_url, bank_account, bank_name
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18
      ) RETURNING *
    `, [
      id, fullName, departmentId, positionId, jobTitle,
      workEmail, phoneNumber, citizenId, dateOfBirth,
      gender, address, baseSalary || 0, contractType || 'CHINH_THUC', joinedDate,
      managerId, avatarUrl, bankAccount, bankName,
    ]);

    return res.status(201).json({
      success: true,
      message: 'Thêm nhân viên thành công',
      data: rows[0],
    });
  } catch (error) {
    console.error('❌ Create employee error:', error);
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Dữ liệu trùng lặp (UNIQUE constraint)' });
    }
    if (error.code === '23503') {
      return res.status(400).json({ success: false, message: 'Phòng ban hoặc chức danh không tồn tại (FK constraint)' });
    }
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

/**
 * PUT /api/employees/:id
 * Sửa thông tin nhân viên (HRD/CEO only)
 */
router.put('/:id', authenticate, requirePermission('employee.update'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName, departmentId, positionId, jobTitle,
      phoneNumber, dateOfBirth, gender, address,
      baseSalary, contractType, managerId, avatarUrl,
      bankAccount, bankName, status,
    } = req.body;

    // Check exists
    const existing = await db.query('SELECT id FROM employees WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhân viên' });
    }

    const { rows } = await db.query(`
      UPDATE employees SET
        full_name = COALESCE($1, full_name),
        department_id = COALESCE($2, department_id),
        position_id = COALESCE($3, position_id),
        job_title = COALESCE($4, job_title),
        phone_number = COALESCE($5, phone_number),
        date_of_birth = COALESCE($6, date_of_birth),
        gender = COALESCE($7, gender),
        address = COALESCE($8, address),
        base_salary = COALESCE($9, base_salary),
        contract_type = COALESCE($10, contract_type),
        manager_id = COALESCE($11, manager_id),
        avatar_url = COALESCE($12, avatar_url),
        bank_account = COALESCE($13, bank_account),
        bank_name = COALESCE($14, bank_name),
        status = COALESCE($15, status)
      WHERE id = $16
      RETURNING *
    `, [
      fullName, departmentId, positionId, jobTitle,
      phoneNumber, dateOfBirth, gender, address,
      baseSalary, contractType, managerId, avatarUrl,
      bankAccount, bankName, status, id,
    ]);

    return res.json({
      success: true,
      message: 'Cập nhật nhân viên thành công',
      data: rows[0],
    });
  } catch (error) {
    console.error('❌ Update employee error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

module.exports = router;
