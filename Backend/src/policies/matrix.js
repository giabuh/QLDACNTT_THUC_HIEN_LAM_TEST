// permission -> { ROLE_CODE: scope }.  scope: 'all' | 'department' | 'self'
// Phase 0 mirrors the authorize(...) calls that exist today; later phases add entries here only.
const ALL = 'all';
const DEPT = 'department';
const ADMINS = { CEO: ALL, HR_DIRECTOR: ALL, ADMIN: ALL };

const matrix = {
  'employee.create': { CEO: ALL, HR_DIRECTOR: ALL },
  'employee.update': { CEO: ALL, HR_DIRECTOR: ALL },
  'payroll.periods.read': { CEO: ALL, HR_DIRECTOR: ALL },
  'payroll.calculate': { CEO: ALL, HR_DIRECTOR: ALL },
  'leave.approve': { CEO: ALL, HR_DIRECTOR: ALL, LINE_MANAGER: DEPT },
  'leave.reject': { CEO: ALL, HR_DIRECTOR: ALL, LINE_MANAGER: DEPT },
  'user.read': ADMINS,
  'user.create': ADMINS,
  'user.update': ADMINS,
  'user.resetPassword': ADMINS,
  'department.manage': { CEO: ALL, HR_DIRECTOR: ALL },
  'position.manage': { CEO: ALL, HR_DIRECTOR: ALL },
  'project.create': { CEO: ALL, HR_DIRECTOR: ALL, LINE_MANAGER: DEPT },
};

module.exports = { matrix };
