// ============================================
// routes/projects.js — Projects (+ legacy task/squad paths)
// ============================================
const express = require('express');
const db = require('../../config/db');
const { authenticate } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { requirePermission } = require('../../policies');
const controller = require('./controller');
const tasks = require('../tasks/controller');
const { createBody, updateBody, idParam } = require('./schema');
const { createBody: taskCreateBody, stageBody } = require('../tasks/schema');

const router = express.Router();

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


router.get('/', authenticate, requirePermission('project.read'), controller.list);
router.post('/', authenticate, requirePermission('project.create'), validate({ body: createBody }), controller.create);

// Legacy paths kept for the current frontend.
router.patch('/tasks/:id/stage', authenticate, requirePermission('project.read'), validate({ body: stageBody }), tasks.stage);

router.get('/:id', authenticate, requirePermission('project.read'), validate({ params: idParam }), controller.get);
router.put('/:id', authenticate, requirePermission('project.read'), validate({ params: idParam, body: updateBody }), controller.update);
router.delete('/:id', authenticate, requirePermission('project.read'), validate({ params: idParam }), controller.remove);
router.get('/:id/tasks', authenticate, requirePermission('project.read'), validate({ params: idParam }), tasks.listForProject);
router.post('/:id/tasks', authenticate, requirePermission('project.read'), validate({ params: idParam, body: taskCreateBody }), tasks.create);

module.exports = router;
