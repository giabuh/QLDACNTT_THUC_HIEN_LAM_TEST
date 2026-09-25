const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const db = require('../../src/config/db');
const { call, callWith, loginUser, claimsFor, closeDb } = require('../helpers/api');
const { createTestUser, deleteTestUsers } = require('../helpers/users');
const { createTestEmployee, deleteTestEmployees } = require('../helpers/employees');
const { employeeSession } = require('../helpers/sessions');

after(async () => {
  await db.query("DELETE FROM audit_logs WHERE table_name IN ('performance_reviews', 'pip_plans')");
  await deleteTestUsers();
  await deleteTestEmployees();
  await db.query("DELETE FROM positions WHERE id LIKE 'POS-TSTR%'");
  await closeDb();
});

const review = (actor, body) => (typeof actor === 'string'
  ? call(actor, 'post', '/api/analytics/reviews', body)
  : callWith(actor.token, 'post', '/api/analytics/reviews', body));
const payload = (employeeId, extra = {}) => ({ employeeId, period: '2027-Q1', performanceScore: 85, potentialScore: 90, comments: 'Xuất sắc', ...extra });

test('create review: the 9-box cell is computed and the reviewer recorded', async () => {
  const emp = await createTestEmployee();
  const res = await review('HR_DIRECTOR', payload(emp.id));
  assert.equal(res.status, 201);
  assert.match(res.body.data.id, /^PR-\d+$/);
  assert.equal(res.body.data.nine_box_cell, 9);
  assert.equal(Number(res.body.data.performance_score), 85);
  assert.equal(res.body.data.reviewer_id, (await claimsFor('HR_DIRECTOR')).employeeId);
  assert.equal(res.body.data.period, '2027-Q1');

  const other = await createTestEmployee();
  assert.equal((await review('CEO', payload(other.id, { performanceScore: 70, potentialScore: 50 }))).body.data.nine_box_cell, 2);
});

test('create review: validation, duplicates, unknown and terminated employees', async () => {
  const emp = await createTestEmployee();
  const bad = [{ period: '2027' }, { period: '2027-Q5' }, { performanceScore: -1 }, { performanceScore: 101 }, { potentialScore: 'high' }, { employeeId: undefined }, { comments: 5 }];
  for (const extra of bad) assert.equal((await review('CEO', payload(emp.id, extra))).status, 400, JSON.stringify(extra));
  assert.equal((await review('CEO', payload(emp.id))).status, 201);
  assert.equal((await review('CEO', payload(emp.id))).status, 409);
  assert.equal((await review('CEO', payload('NV-NOPE'))).status, 404);
  const gone = await createTestEmployee({ status: 'DA_NGHI_VIEC' });
  assert.equal((await review('CEO', payload(gone.id))).status, 409);
});

test('create review: a manager reviews their own department, never another, never themselves', async () => {
  const lm = await employeeSession({ role: 'LINE_MANAGER', departmentId: 'DEPT-ACC' });
  const mate = await createTestEmployee({ departmentId: 'DEPT-ACC' });
  const stranger = await createTestEmployee({ departmentId: 'DEPT-MKT' });
  assert.equal((await review(lm, payload(mate.id))).status, 201);
  assert.equal((await review(lm, payload(stranger.id))).status, 403);
  assert.equal((await review(lm, payload(lm.employeeId))).status, 403);
  assert.equal((await review('CEO', payload(lm.employeeId))).status, 201);
  const emp = await employeeSession();
  assert.equal((await review(emp, payload(mate.id, { period: '2027-Q2' }))).status, 403);
});

test('update and delete: scores recompute the cell; only HR deletes', async () => {
  const emp = await createTestEmployee();
  const id = (await review('HR_DIRECTOR', payload(emp.id))).body.data.id;
  const res = await call('CEO', 'put', `/api/analytics/reviews/${id}`, { performanceScore: 30, potentialScore: 30, comments: 'Sa sút' });
  assert.equal(res.status, 200);
  assert.equal(res.body.data.nine_box_cell, 1);
  assert.equal(res.body.data.comments, 'Sa sút');
  assert.equal((await call('CEO', 'put', `/api/analytics/reviews/${id}`, {})).status, 400);
  assert.equal((await call('CEO', 'put', `/api/analytics/reviews/${id}`, { performanceScore: 200 })).status, 400);
  assert.equal((await call('CEO', 'put', '/api/analytics/reviews/PR-NOPE', { comments: 'x' })).status, 404);

  const lm = await employeeSession({ role: 'LINE_MANAGER', departmentId: 'DEPT-MKT' });
  assert.equal((await callWith(lm.token, 'put', `/api/analytics/reviews/${id}`, { comments: 'x' })).status, 403); // other department
  assert.equal((await callWith(lm.token, 'delete', `/api/analytics/reviews/${id}`)).status, 403);
  assert.equal((await call('HR_DIRECTOR', 'delete', `/api/analytics/reviews/${id}`)).status, 200);
  assert.equal((await call('HR_DIRECTOR', 'delete', `/api/analytics/reviews/${id}`)).status, 404);
});

test('read reviews: employees see only their own, managers their department, HR everyone, others nobody', async () => {
  const a = await employeeSession({ departmentId: 'DEPT-SALES' });
  const b = await employeeSession({ departmentId: 'DEPT-SALES' });
  const c = await employeeSession({ departmentId: 'DEPT-HR' });
  const lm = await employeeSession({ role: 'LINE_MANAGER', departmentId: 'DEPT-SALES' });
  for (const s of [a, b, c]) await review('HR_DIRECTOR', payload(s.employeeId, { period: '2027-Q3' }));

  const own = await callWith(a.token, 'get', '/api/analytics/reviews?period=2027-Q3&limit=200');
  assert.equal(own.status, 200);
  assert.deepEqual(own.body.data.map((r) => r.employee_id), [a.employeeId]);
  assert.deepEqual((await callWith(a.token, 'get', `/api/analytics/reviews?employeeId=${b.employeeId}`)).body.data, []);

  const dept = await callWith(lm.token, 'get', '/api/analytics/reviews?period=2027-Q3&limit=200');
  assert.deepEqual(dept.body.data.map((r) => r.employee_id).sort(), [a.employeeId, b.employeeId].sort());
  const all = await call('CEO', 'get', '/api/analytics/reviews?period=2027-Q3&limit=200');
  assert.ok([a, b, c].every((s) => all.body.data.some((r) => r.employee_id === s.employeeId)));
  assert.equal((await call('CEO', 'get', '/api/analytics/reviews?period=bad')).status, 400);
  assert.equal((await call('CEO', 'get', '/api/analytics/reviews?limit=100000')).body.pagination.limit, 200);

  for (const role of ['ADMIN', 'KIOSK']) {
    const u = await createTestUser({ role });
    const { accessToken } = await loginUser(u);
    assert.equal((await callWith(accessToken, 'get', '/api/analytics/reviews')).status, 403, role);
  }
});

test('nine-box: the distribution of a period with employees per cell, scoped, without leaking to staff', async () => {
  const lm = await employeeSession({ role: 'LINE_MANAGER', departmentId: 'DEPT-ACC' });
  const star = await createTestEmployee({ departmentId: 'DEPT-ACC' });
  const weak = await createTestEmployee({ departmentId: 'DEPT-ACC' });
  const elsewhere = await createTestEmployee({ departmentId: 'DEPT-MKT' });
  await review('CEO', payload(star.id, { period: '2027-H2', performanceScore: 95, potentialScore: 95 }));
  await review('CEO', payload(weak.id, { period: '2027-H2', performanceScore: 20, potentialScore: 20 }));
  await review('CEO', payload(elsewhere.id, { period: '2027-H2', performanceScore: 95, potentialScore: 95 }));

  const res = await call('HR_DIRECTOR', 'get', '/api/analytics/nine-box?period=2027-H2');
  assert.equal(res.status, 200);
  assert.equal(res.body.period, '2027-H2');
  assert.equal(res.body.data.length, 9);
  const cell = (r, n) => r.body.data.find((c) => c.cell === n);
  assert.equal(cell(res, 9).count, 2);
  assert.equal(cell(res, 9).title, 'Ngôi sao xuất sắc');
  assert.equal(cell(res, 1).count, 1);
  assert.ok(cell(res, 9).employees.some((e) => e.employee_id === star.id));
  assert.equal(res.body.data.reduce((s, c) => s + c.count, 0), 3);

  const scoped = await callWith(lm.token, 'get', '/api/analytics/nine-box?period=2027-H2');
  assert.equal(cell(scoped, 9).count, 1);
  assert.equal(scoped.body.data.reduce((s, c) => s + c.count, 0), 2);

  const staff = await employeeSession();
  assert.equal((await callWith(staff.token, 'get', '/api/analytics/nine-box?period=2027-H2')).status, 403);
  assert.equal((await call('CEO', 'get', '/api/analytics/nine-box?period=bad')).status, 400);
  const empty = await call('CEO', 'get', '/api/analytics/nine-box?period=2099-FY');
  assert.equal(empty.body.data.reduce((s, c) => s + c.count, 0), 0);
});

test('nine-box without a period uses the latest period that has reviews', async () => {
  const emp = await createTestEmployee();
  await review('CEO', payload(emp.id, { period: '2098-Q4' }));
  const res = await call('CEO', 'get', '/api/analytics/nine-box');
  assert.equal(res.body.period, '2098-Q4');
});

test('department scores and the summary', async () => {
  const lm = await employeeSession({ role: 'LINE_MANAGER', departmentId: 'DEPT-SALES' });
  const s1 = await createTestEmployee({ departmentId: 'DEPT-SALES' });
  const s2 = await createTestEmployee({ departmentId: 'DEPT-SALES' });
  const m1 = await createTestEmployee({ departmentId: 'DEPT-MKT' });
  await review('CEO', payload(s1.id, { period: '2027-FY', performanceScore: 90, potentialScore: 90 }));
  await review('CEO', payload(s2.id, { period: '2027-FY', performanceScore: 70, potentialScore: 60 }));
  await review('CEO', payload(m1.id, { period: '2027-FY', performanceScore: 50, potentialScore: 50 }));

  const res = await call('CEO', 'get', '/api/analytics/department-scores?period=2027-FY');
  assert.equal(res.status, 200);
  const sales = res.body.data.find((d) => d.department_id === 'DEPT-SALES');
  const mkt = res.body.data.find((d) => d.department_id === 'DEPT-MKT');
  assert.equal(sales.score, 80);
  assert.equal(sales.reviewed, 2);
  assert.equal(mkt.score, 50);
  const scoped = await callWith(lm.token, 'get', '/api/analytics/department-scores?period=2027-FY');
  assert.deepEqual(scoped.body.data.map((d) => d.department_id), ['DEPT-SALES']);
  const staff = await employeeSession();
  assert.equal((await callWith(staff.token, 'get', '/api/analytics/department-scores')).status, 403);

  const summary = await call('HR_DIRECTOR', 'get', '/api/analytics/summary?period=2027-FY');
  assert.equal(summary.status, 200);
  assert.equal(summary.body.data.period, '2027-FY');
  assert.ok(summary.body.data.avgScore > 0);
  assert.ok(summary.body.data.topTalentsCount >= 1);
  assert.ok(Array.isArray(summary.body.data.departmentScores));
  assert.equal(typeof summary.body.data.atRiskCount, 'number');
  assert.equal((await callWith(staff.token, 'get', '/api/analytics/summary')).status, 403);
});

test('turnover risk: signals from pay, overtime, tenure and reviews are combined and explained', async () => {
  const posId = `POS-TSTR${Date.now().toString(36)}`.toUpperCase().slice(0, 20);
  await db.query('INSERT INTO positions (id, name, level) VALUES ($1, $2, 5)', [posId, `Risk position ${posId}`]);
  const make = async (salary) => {
    const e = await createTestEmployee({ departmentId: 'DEPT-ACC', positionId: posId });
    await db.query("UPDATE employees SET base_salary = $2, joined_date = '2020-01-01' WHERE id = $1", [e.id, salary]);
    return e;
  };
  for (let i = 0; i < 3; i += 1) await make(40000000); // peers
  const target = await make(30000000);
  await db.query(
    `INSERT INTO attendance_logs (employee_id, work_date, status, ot_hours)
     SELECT $1, CURRENT_DATE - g, 'DUNG_GIO', 2 FROM generate_series(0, 19) g`, [target.id]); // 40 h in the last 30 days
  await review('HR_DIRECTOR', payload(target.id, { period: '2027-Q4', performanceScore: 55, potentialScore: 55 }));

  const res = await call('HR_DIRECTOR', 'get', `/api/analytics/turnover-risk/${target.id}`);
  assert.equal(res.status, 200);
  assert.equal(res.body.data.score, 70); // pay 30 + overtime 15 + trend 5 + tenure 10 + low performance 10
  assert.equal(res.body.data.level, 'Cao');
  assert.deepEqual(res.body.data.signals.map((s) => s.code).sort(), ['LOW_PERFORMANCE', 'OT_LOAD', 'OT_TREND', 'PAY_GAP', 'STAGNATION']);
  assert.ok(res.body.data.signals.every((s) => s.detail));
  assert.equal(res.body.data.employee_id, target.id);

  const list = await call('HR_DIRECTOR', 'get', '/api/analytics/turnover-risk?limit=200');
  assert.equal(list.status, 200);
  const row = list.body.data.find((r) => r.employee_id === target.id);
  assert.equal(row.score, 70);
  const scores = list.body.data.map((r) => r.score);
  assert.deepEqual(scores, [...scores].sort((a, b) => b - a)); // riskiest first
  const high = await call('HR_DIRECTOR', 'get', '/api/analytics/turnover-risk?level=Cao&limit=200');
  assert.ok(high.body.data.every((r) => r.level === 'Cao') && high.body.data.some((r) => r.employee_id === target.id));
  assert.equal((await call('HR_DIRECTOR', 'get', '/api/analytics/turnover-risk?level=Bogus')).status, 400);
});

test('turnover risk is confidential: staff, ADMIN, KIOSK and other departments never see it', async () => {
  const target = await createTestEmployee({ departmentId: 'DEPT-ACC' });
  const own = await employeeSession({ departmentId: 'DEPT-ACC' });
  const lm = await employeeSession({ role: 'LINE_MANAGER', departmentId: 'DEPT-ACC' });
  const otherLm = await employeeSession({ role: 'LINE_MANAGER', departmentId: 'DEPT-MKT' });
  const url = `/api/analytics/turnover-risk/${target.id}`;

  assert.equal((await callWith(own.token, 'get', `/api/analytics/turnover-risk/${own.employeeId}`)).status, 403); // not even about themselves
  assert.equal((await callWith(own.token, 'get', '/api/analytics/turnover-risk')).status, 403);
  assert.equal((await callWith(lm.token, 'get', url)).status, 200);
  assert.equal((await callWith(otherLm.token, 'get', url)).status, 403);
  const deptList = await callWith(lm.token, 'get', '/api/analytics/turnover-risk?limit=200');
  assert.ok(deptList.body.data.length >= 1 && deptList.body.data.every((r) => r.department_id === 'DEPT-ACC'));
  assert.equal(deptList.body.data.some((r) => r.employee_id === lm.employeeId), false); // managers are not scored by themselves
  for (const role of ['ADMIN', 'KIOSK']) {
    const u = await createTestUser({ role });
    const { accessToken } = await loginUser(u);
    assert.equal((await callWith(accessToken, 'get', url)).status, 403, role);
  }
  assert.equal((await call('CEO', 'get', '/api/analytics/turnover-risk/NV-NOPE')).status, 404);
  const gone = await createTestEmployee({ status: 'DA_NGHI_VIEC' });
  assert.equal((await call('CEO', 'get', `/api/analytics/turnover-risk/${gone.id}`)).status, 409);
});

const pipBody = (employeeId, extra = {}) => ({
  employeeId, startDate: '2027-01-04', endDate: '2027-04-04',
  goals: [{ title: 'Giảm lỗi production', metric: 'Số bug', target: '< 3 / tháng', dueDate: '2027-03-01' }, { title: 'Hoàn thành khóa học' }], ...extra,
});
const pip = (role, body) => call(role, 'post', '/api/analytics/pip', body);

test('PIP: HR creates a plan with goals; only one active plan per employee', async () => {
  const emp = await createTestEmployee();
  const res = await pip('HR_DIRECTOR', pipBody(emp.id));
  assert.equal(res.status, 201);
  assert.match(res.body.data.id, /^PIP-\d+$/);
  assert.equal(res.body.data.status, 'active');
  assert.equal(res.body.data.goals.length, 2);
  assert.equal(res.body.data.start_date, '2027-01-04');
  assert.equal(res.body.data.created_by, (await claimsFor('HR_DIRECTOR')).employeeId);
  assert.equal((await pip('CEO', pipBody(emp.id))).status, 409);
});

test('PIP: validation and permissions', async () => {
  const emp = await createTestEmployee();
  const bad = [
    { endDate: '2026-12-31' }, { goals: [] }, { goals: 'improve' }, { goals: [{ metric: 'x' }] }, { goals: [{ title: '' }] },
    { startDate: 'soon' }, { employeeId: undefined },
  ];
  for (const extra of bad) assert.equal((await pip('CEO', pipBody(emp.id, extra))).status, 400, JSON.stringify(extra));
  assert.equal((await pip('CEO', pipBody('NV-NOPE'))).status, 404);
  const lm = await employeeSession({ role: 'LINE_MANAGER' });
  const staff = await employeeSession();
  assert.equal((await callWith(lm.token, 'post', '/api/analytics/pip', pipBody(emp.id))).status, 403);
  assert.equal((await callWith(staff.token, 'post', '/api/analytics/pip', pipBody(emp.id))).status, 403);
  const gone = await createTestEmployee({ status: 'DA_NGHI_VIEC' });
  assert.equal((await pip('CEO', pipBody(gone.id))).status, 409);
});

test('PIP: read access by scope; the employee sees their own plan only', async () => {
  const s = await employeeSession({ departmentId: 'DEPT-ACC' });
  const other = await employeeSession({ departmentId: 'DEPT-ACC' });
  const lm = await employeeSession({ role: 'LINE_MANAGER', departmentId: 'DEPT-ACC' });
  const outsiderLm = await employeeSession({ role: 'LINE_MANAGER', departmentId: 'DEPT-MKT' });
  const id = (await pip('HR_DIRECTOR', pipBody(s.employeeId))).body.data.id;
  await pip('HR_DIRECTOR', pipBody(other.employeeId));

  assert.equal((await callWith(s.token, 'get', `/api/analytics/pip/${id}`)).status, 200);
  assert.deepEqual((await callWith(s.token, 'get', '/api/analytics/pip')).body.data.map((p) => p.employee_id), [s.employeeId]);
  assert.equal((await callWith(other.token, 'get', `/api/analytics/pip/${id}`)).status, 403);
  assert.equal((await callWith(lm.token, 'get', `/api/analytics/pip/${id}`)).status, 200);
  assert.equal((await callWith(outsiderLm.token, 'get', `/api/analytics/pip/${id}`)).status, 403);
  const list = await callWith(lm.token, 'get', '/api/analytics/pip?limit=200');
  assert.ok(list.body.data.every((p) => p.department_id === 'DEPT-ACC'));
  assert.equal((await call('CEO', 'get', '/api/analytics/pip/PIP-NOPE')).status, 404);
  assert.equal((await call('CEO', 'get', '/api/analytics/pip?status=bogus')).status, 400);
  const admin = await createTestUser({ role: 'ADMIN' });
  assert.equal((await callWith((await loginUser(admin)).accessToken, 'get', `/api/analytics/pip/${id}`)).status, 403);
});

test('PIP: updates, closing needs an outcome, and a new plan is allowed once the old one is closed', async () => {
  const emp = await createTestEmployee();
  const id = (await pip('HR_DIRECTOR', pipBody(emp.id))).body.data.id;
  const edited = await call('CEO', 'put', `/api/analytics/pip/${id}`, { endDate: '2027-05-04', goals: [{ title: 'Mục tiêu mới' }] });
  assert.equal(edited.status, 200);
  assert.equal(edited.body.data.end_date, '2027-05-04');
  assert.equal(edited.body.data.goals.length, 1);
  assert.equal((await call('CEO', 'put', `/api/analytics/pip/${id}`, {})).status, 400);
  assert.equal((await call('CEO', 'put', `/api/analytics/pip/${id}`, { endDate: '2026-01-01' })).status, 400);
  assert.equal((await call('CEO', 'put', `/api/analytics/pip/${id}`, { status: 'completed' })).status, 400); // outcome required
  assert.equal((await call('CEO', 'put', `/api/analytics/pip/${id}`, { status: 'bogus', outcome: 'x' })).status, 400);

  const done = await call('CEO', 'put', `/api/analytics/pip/${id}`, { status: 'completed', outcome: 'Đạt mục tiêu' });
  assert.equal(done.status, 200);
  assert.equal(done.body.data.status, 'completed');
  assert.equal((await call('CEO', 'put', `/api/analytics/pip/${id}`, { outcome: 'late edit' })).status, 409); // closed plans are frozen
  assert.equal((await pip('HR_DIRECTOR', pipBody(emp.id, { startDate: '2027-06-01', endDate: '2027-09-01' }))).status, 201);
  const lm = await employeeSession({ role: 'LINE_MANAGER' });
  assert.equal((await callWith(lm.token, 'put', `/api/analytics/pip/${id}`, { outcome: 'x' })).status, 403);
  assert.equal((await call('CEO', 'put', '/api/analytics/pip/PIP-NOPE', { outcome: 'x' })).status, 404);
});

test('review and PIP writes are audited', async () => {
  const emp = await createTestEmployee();
  const rid = (await review('HR_DIRECTOR', payload(emp.id, { period: '2027-Q2' }))).body.data.id;
  await call('CEO', 'put', `/api/analytics/reviews/${rid}`, { comments: 'x' });
  const pid = (await pip('HR_DIRECTOR', pipBody(emp.id))).body.data.id;
  await call('CEO', 'put', `/api/analytics/pip/${pid}`, { status: 'cancelled', outcome: 'Hủy' });
  const rows = async (table, id) => (await db.query('SELECT action FROM audit_logs WHERE table_name = $1 AND record_id = $2 ORDER BY id', [table, id])).rows.map((r) => r.action);
  assert.deepEqual(await rows('performance_reviews', rid), ['CREATE_REVIEW', 'UPDATE_REVIEW']);
  assert.deepEqual(await rows('pip_plans', pid), ['CREATE_PIP', 'UPDATE_PIP']);
});
