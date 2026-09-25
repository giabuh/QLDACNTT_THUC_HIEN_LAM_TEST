// ============================================
// routes/projects.js — Projects & Tasks & Squads API
// ============================================
const express = require('express');
const db = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/projects
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        p.*,
        d.name AS department_name,
        m.full_name AS manager_name, m.avatar_url AS manager_avatar,
        COUNT(t.id) AS total_tasks,
        COUNT(t.id) FILTER (WHERE t.stage = 'done') AS done_tasks
      FROM projects p
      LEFT JOIN departments d ON p.department_id = d.id
      LEFT JOIN employees m ON p.manager_id = m.id
      LEFT JOIN tasks t ON t.project_id = p.id
      GROUP BY p.id, d.name, m.full_name, m.avatar_url
      ORDER BY p.start_date DESC
    `);
    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ Get projects error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

/**
 * GET /api/projects/:id/tasks
 */
router.get('/:id/tasks', authenticate, async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        t.*,
        a.full_name AS assignee_name, a.avatar_url AS assignee_avatar, a.job_title AS assignee_role,
        c.full_name AS creator_name
      FROM tasks t
      LEFT JOIN employees a ON t.assignee_id = a.id
      LEFT JOIN employees c ON t.creator_id = c.id
      WHERE t.project_id = $1
      ORDER BY 
        CASE t.priority WHEN 'Khẩn cấp' THEN 1 WHEN 'Cao' THEN 2 WHEN 'Trung bình' THEN 3 ELSE 4 END,
        t.deadline
    `, [req.params.id]);
    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ Get tasks error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

/**
 * PATCH /api/tasks/:id/stage
 * Chuyển Kanban stage (trigger auto ghi task_logs)
 * Body: { stage: "in_progress" | "review" | "done" | "todo" }
 */
router.patch('/tasks/:id/stage', authenticate, async (req, res) => {
  try {
    const { stage, note } = req.body;
    const validStages = ['todo', 'in_progress', 'review', 'done'];

    if (!validStages.includes(stage)) {
      return res.status(400).json({
        success: false,
        message: `Stage không hợp lệ. Cho phép: ${validStages.join(', ')}`,
      });
    }

    const { rows } = await db.query(`
      UPDATE tasks SET stage = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [stage, req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy task' });
    }

    return res.json({
      success: true,
      message: `Task ${req.params.id} → ${stage}`,
      data: rows[0],
    });
  } catch (error) {
    console.error('❌ Update task stage error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

/**
 * GET /api/squads
 */
router.get('/squads', authenticate, async (req, res) => {
  try {
    const { rows: squads } = await db.query(`
      SELECT s.*, l.full_name AS lead_name, l.avatar_url AS lead_avatar,
             p.name AS project_name
      FROM squads s
      LEFT JOIN employees l ON s.lead_id = l.id
      LEFT JOIN projects p ON s.project_id = p.id
      ORDER BY s.name
    `);

    // Lấy members cho mỗi squad
    for (const squad of squads) {
      const { rows: members } = await db.query(`
        SELECT sm.role_in_squad, e.id, e.full_name, e.avatar_url, e.job_title
        FROM squad_members sm
        JOIN employees e ON sm.employee_id = e.id
        WHERE sm.squad_id = $1
        ORDER BY sm.role_in_squad DESC, e.full_name
      `, [squad.id]);
      squad.members = members;
    }

    return res.json({ success: true, data: squads });
  } catch (error) {
    console.error('❌ Get squads error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

/**
 * POST /api/projects/:id/tasks
 * Tạo nhiệm vụ mới trong dự án
 */
router.post('/:id/tasks', authenticate, async (req, res) => {
  try {
    const projectId = req.params.id;
    const {
      title, description, assignee_id, deadline,
      priority = 'Trung bình', kpi_weight = 20, estimated_hours = 8,
      stage = 'todo'
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tiêu đề nhiệm vụ' });
    }

    // Tự sinh ID task tiếp theo: TSK-XXX
    const { rows: maxRows } = await db.query(
      `SELECT id FROM tasks WHERE id LIKE 'TSK-%' ORDER BY id DESC LIMIT 1`
    );
    let nextNum = 107;
    if (maxRows.length > 0) {
      const match = maxRows[0].id.match(/TSK-(\d+)/);
      if (match) nextNum = parseInt(match[1]) + 1;
    }
    const taskId = `TSK-${nextNum}`;

    const { rows } = await db.query(`
      INSERT INTO tasks (
        id, project_id, title, description, assignee_id, creator_id,
        deadline, priority, kpi_weight, estimated_hours, stage, progress
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 0)
      RETURNING *
    `, [
      taskId, projectId, title, description || null, assignee_id || req.user.employeeId,
      req.user.employeeId, deadline || null, priority, kpi_weight, estimated_hours, stage
    ]);

    return res.status(201).json({
      success: true,
      message: 'Tạo nhiệm vụ thành công',
      data: rows[0],
    });
  } catch (error) {
    console.error('❌ Create task error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

/**
 * POST /api/projects
 * Tạo dự án mới
 */
router.post('/', authenticate, authorize('CEO', 'HR_DIRECTOR', 'LINE_MANAGER'), async (req, res) => {
  try {
    const { name, code, department_id, start_date, end_date, priority = 'Trung bình', description, budget_hours = 100 } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Tên dự án là bắt buộc' });
    }

    const projectId = `PRJ-${Date.now().toString().slice(-4)}`;
    const projectCode = code || `PRJ-2026-${Math.floor(Math.random() * 90) + 10}`;

    const { rows } = await db.query(`
      INSERT INTO projects (
        id, code, name, department_id, manager_id, start_date, end_date,
        progress, status, priority, description, budget_hours, used_hours
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 'planned', $8, $9, $10, 0)
      RETURNING *
    `, [
      projectId, projectCode, name, department_id || 'DEPT-IT', req.user.employeeId,
      start_date || new Date(), end_date || null, priority, description || null, budget_hours
    ]);

    return res.status(201).json({
      success: true,
      message: 'Tạo dự án thành công',
      data: rows[0],
    });
  } catch (error) {
    console.error('❌ Create project error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

module.exports = router;
