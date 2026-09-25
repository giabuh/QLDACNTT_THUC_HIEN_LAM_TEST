const db = require('../../config/db');
const { AppError, badRequest, forbidden, notFound, conflict } = require('../../utils/AppError');
const { parsePagination, paginationMeta } = require('../../utils/pagination');
const { writeAudit } = require('../../utils/audit');
const { scopeCondition } = require('../../utils/scope');
const { departmentOf } = require('../projects/access');

const SELECT = `SELECT p.*, e.full_name, e.department_id, c.full_name AS created_by_name
                  FROM pip_plans p JOIN employees e ON e.id = p.employee_id LEFT JOIN employees c ON c.id = p.created_by`;

async function findPip(executor, id, { lock = false } = {}) {
  const { rows } = await executor.query(`${SELECT} WHERE p.id = $1 ${lock ? 'FOR UPDATE OF p' : ''}`, [id]);
  return rows[0] || null;
}

async function list(user, query, scope) {
  const { page, limit, offset } = parsePagination(query, { defaultLimit: 50, maxLimit: 200 });
  const params = [];
  const where = [];
  const cond = await scopeCondition(db, user, scope, { employee: 'p.employee_id', department: 'e.department_id' }, params);
  if (cond) where.push(cond);
  if (query.employeeId) { params.push(query.employeeId); where.push(`p.employee_id = $${params.length}`); }
  if (query.status) { params.push(query.status); where.push(`p.status = $${params.length}`); }
  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const total = (await db.query(`SELECT COUNT(*)::int AS n FROM pip_plans p JOIN employees e ON e.id = p.employee_id ${clause}`, params)).rows[0].n;
  const { rows } = await db.query(`${SELECT} ${clause} ORDER BY p.created_at DESC, p.id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`, [...params, limit, offset]);
  return { data: rows, pagination: paginationMeta(total, page, limit) };
}

async function get(user, id, scope) {
  const row = await findPip(db, id);
  if (!row) throw notFound('Không tìm thấy kế hoạch PIP');
  let allowed = scope === 'all' || row.employee_id === user.employeeId;
  if (!allowed && scope === 'department') {
    const dept = await departmentOf(db, user.employeeId);
    allowed = Boolean(dept) && dept === row.department_id;
  }
  if (!allowed) throw forbidden('Bạn không có quyền xem kế hoạch này');
  return row;
}

async function create(actor, body, req) {
  return db.withTransaction(async (client) => {
    const emp = (await client.query('SELECT id, status FROM employees WHERE id = $1', [body.employeeId])).rows[0];
    if (!emp) throw notFound('Không tìm thấy nhân viên');
    if (emp.status === 'DA_NGHI_VIEC') throw conflict('Nhân viên đã nghỉ việc');
    const active = await client.query("SELECT id FROM pip_plans WHERE employee_id = $1 AND status = 'active'", [body.employeeId]);
    if (active.rows.length > 0) throw new AppError(409, 'PIP_ALREADY_ACTIVE', `Nhân viên đang có kế hoạch ${active.rows[0].id}`);

    const { rows } = await client.query(
      'INSERT INTO pip_plans (employee_id, created_by, start_date, end_date, goals) VALUES ($1, $2, $3, $4, $5::jsonb) RETURNING id',
      [body.employeeId, actor.employeeId ?? null, body.startDate, body.endDate, JSON.stringify(body.goals)]
    );
    await writeAudit(client, {
      user: actor, action: 'CREATE_PIP', table: 'pip_plans', recordId: rows[0].id, req,
      newValues: { employee_id: body.employeeId, start_date: body.startDate, end_date: body.endDate, goals: body.goals.length },
    });
    return findPip(client, rows[0].id);
  });
}

async function update(actor, id, body, req) {
  return db.withTransaction(async (client) => {
    const before = await findPip(client, id, { lock: true });
    if (!before) throw notFound('Không tìm thấy kế hoạch PIP');
    if (before.status !== 'active') throw conflict('Kế hoạch đã kết thúc, không thể chỉnh sửa');

    const start = body.startDate ?? before.start_date;
    const end = body.endDate ?? before.end_date;
    if (end < start) throw badRequest('Ngày kết thúc không được trước ngày bắt đầu');
    const closing = body.status && body.status !== 'active';
    if (closing && !body.outcome) throw badRequest('Vui lòng nhập kết quả khi kết thúc kế hoạch');

    await client.query(
      `UPDATE pip_plans SET start_date = $2, end_date = $3, goals = COALESCE($4::jsonb, goals), status = COALESCE($5, status), outcome = COALESCE($6, outcome) WHERE id = $1`,
      [id, start, end, body.goals ? JSON.stringify(body.goals) : null, body.status ?? null, body.outcome ?? null]
    );
    await writeAudit(client, {
      user: actor, action: 'UPDATE_PIP', table: 'pip_plans', recordId: id, req,
      oldValues: { status: before.status, end_date: before.end_date }, newValues: { status: body.status ?? before.status, end_date: end },
    });
    return findPip(client, id);
  });
}

module.exports = { list, get, create, update };
