const db = require('../../config/db');
const { badRequest, forbidden, notFound } = require('../../utils/AppError');
const { parsePagination, paginationMeta } = require('../../utils/pagination');
const { writeAudit } = require('../../utils/audit');

const HR_ROLES = ['CEO', 'HR_DIRECTOR'];
const SELECT = 'SELECT n.*, a.full_name AS author_name FROM company_notices n LEFT JOIN employees a ON a.id = n.author_id';

// Visible to staff: active, already published, not expired, and addressed to their role and department.
const audiencePredicate = (roleParam, deptParam) => `(n.is_active AND n.published_at <= NOW() AND (n.expires_at IS NULL OR n.expires_at > NOW())
   AND (n.target_role IS NULL OR n.target_role = ${roleParam}::role_code_enum)
   AND (n.target_department_id IS NULL OR n.target_department_id = ${deptParam}))`;

async function departmentOf(user) {
  if (!user.employeeId) return null;
  return (await db.query('SELECT department_id FROM employees WHERE id = $1', [user.employeeId])).rows[0]?.department_id ?? null;
}

async function list(user, query) {
  const { page, limit, offset } = parsePagination(query, { defaultLimit: 30, maxLimit: 100 });
  const params = [];
  const where = [];
  if (query.all === 'true') {
    if (!HR_ROLES.includes(user.roleCode)) throw forbidden('Chỉ HR và CEO mới xem được toàn bộ thông báo');
  } else {
    params.push(user.roleCode, await departmentOf(user));
    where.push(audiencePredicate('$1', '$2'));
  }
  if (query.category) {
    params.push(query.category);
    where.push(`n.category = $${params.length}::notice_category_enum`);
  }
  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const total = (await db.query(`SELECT COUNT(*)::int AS n FROM company_notices n ${clause}`, params)).rows[0].n;
  const { rows } = await db.query(
    `${SELECT} ${clause} ORDER BY n.is_pinned DESC, n.published_at DESC, n.id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );
  return { data: rows, pagination: paginationMeta(total, page, limit) };
}

async function get(user, id) {
  const params = [id];
  let extra = '';
  if (!HR_ROLES.includes(user.roleCode)) {
    params.push(user.roleCode, await departmentOf(user));
    extra = `AND ${audiencePredicate('$2', '$3')}`;
  }
  const { rows } = await db.query(`${SELECT} WHERE n.id = $1 ${extra}`, params);
  if (!rows[0]) throw notFound('Không tìm thấy thông báo');
  return rows[0];
}

async function assertDepartment(client, id) {
  const { rows } = await client.query('SELECT 1 FROM departments WHERE id = $1', [id]);
  if (rows.length === 0) throw notFound('Không tìm thấy phòng ban');
}

async function create(actor, body, req) {
  return db.withTransaction(async (client) => {
    if (body.targetDepartmentId) await assertDepartment(client, body.targetDepartmentId);
    const { rows } = await client.query(
      `INSERT INTO company_notices (title, content, category, priority, author_id, target_role, target_department_id, is_pinned, published_at, expires_at)
       VALUES ($1, $2, $3::notice_category_enum, $4, $5, $6, $7, $8, COALESCE($9::timestamptz, NOW()), $10) RETURNING id`,
      [body.title, body.content, body.category, body.priority, actor.employeeId ?? null, body.targetRole ?? null,
        body.targetDepartmentId ?? null, body.isPinned, body.publishedAt ?? null, body.expiresAt ?? null]
    );
    await writeAudit(client, {
      user: actor, action: 'CREATE_NOTICE', table: 'company_notices', recordId: rows[0].id, req,
      newValues: { title: body.title, category: body.category, target_role: body.targetRole ?? null, target_department_id: body.targetDepartmentId ?? null },
    });
    return (await client.query(`${SELECT} WHERE n.id = $1`, [rows[0].id])).rows[0];
  });
}

const COLUMNS = {
  title: 'title', content: 'content', category: 'category', priority: 'priority', targetRole: 'target_role',
  targetDepartmentId: 'target_department_id', isPinned: 'is_pinned', isActive: 'is_active', publishedAt: 'published_at', expiresAt: 'expires_at',
};

async function update(actor, id, body, req) {
  return db.withTransaction(async (client) => {
    const before = (await client.query('SELECT * FROM company_notices WHERE id = $1 FOR UPDATE', [id])).rows[0];
    if (!before) throw notFound('Không tìm thấy thông báo');
    if (body.targetDepartmentId) await assertDepartment(client, body.targetDepartmentId);

    const published = new Date(body.publishedAt ?? before.published_at);
    const expires = body.expiresAt === undefined ? before.expires_at : body.expiresAt;
    if (expires && new Date(expires) <= published) throw badRequest('Thời điểm hết hạn phải sau thời điểm đăng');

    const sets = [];
    const params = [id];
    for (const [key, column] of Object.entries(COLUMNS)) {
      if (body[key] !== undefined) {
        params.push(body[key]);
        sets.push(`${column} = $${params.length}${key === 'category' ? '::notice_category_enum' : ''}`);
      }
    }
    await client.query(`UPDATE company_notices SET ${sets.join(', ')} WHERE id = $1`, params);
    await writeAudit(client, {
      user: actor, action: 'UPDATE_NOTICE', table: 'company_notices', recordId: id, req,
      oldValues: { title: before.title, is_pinned: before.is_pinned, is_active: before.is_active }, newValues: body,
    });
    return (await client.query(`${SELECT} WHERE n.id = $1`, [id])).rows[0];
  });
}

async function remove(actor, id, req) {
  return db.withTransaction(async (client) => {
    const res = await client.query('DELETE FROM company_notices WHERE id = $1 RETURNING title', [id]);
    if (res.rowCount === 0) throw notFound('Không tìm thấy thông báo');
    await writeAudit(client, { user: actor, action: 'DELETE_NOTICE', table: 'company_notices', recordId: id, req, oldValues: { title: res.rows[0].title } });
  });
}

module.exports = { list, get, create, update, remove };
