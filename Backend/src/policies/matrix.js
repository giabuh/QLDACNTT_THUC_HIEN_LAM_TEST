// permission -> { ROLE_CODE: scope }.  scope: 'all' | 'department' | 'self'
// Phase 0 mirrors the authorize(...) calls that exist today; later phases add entries here only.
const ALL = 'all';
const DEPT = 'department';
const ADMINS = { CEO: ALL, HR_DIRECTOR: ALL, ADMIN: ALL };

const matrix = {
  'attendance.punch': { CEO: 'self', HR_DIRECTOR: 'self', LINE_MANAGER: 'self', EMPLOYEE: 'self' },
  'attendance.read': { CEO: ALL, HR_DIRECTOR: ALL, LINE_MANAGER: DEPT, EMPLOYEE: 'self' },
  'attendance.report': { CEO: ALL, HR_DIRECTOR: ALL, LINE_MANAGER: DEPT },
  'attendance.kiosk': { KIOSK: ALL, HR_DIRECTOR: ALL, CEO: ALL },
  'attendance.adjust': { CEO: ALL, HR_DIRECTOR: ALL },
  'contract.read': { CEO: ALL, HR_DIRECTOR: ALL, EMPLOYEE: 'self' },
  'contract.manage': { CEO: ALL, HR_DIRECTOR: ALL },
  'employee.list': { CEO: ALL, HR_DIRECTOR: ALL, ADMIN: ALL, LINE_MANAGER: DEPT, EMPLOYEE: ALL },
  'employee.read': { CEO: ALL, HR_DIRECTOR: ALL, ADMIN: ALL, LINE_MANAGER: DEPT, EMPLOYEE: 'self' },
  'employee.create': { CEO: ALL, HR_DIRECTOR: ALL },
  'employee.import': { CEO: ALL, HR_DIRECTOR: ALL },
  'employee.offboard': { CEO: ALL, HR_DIRECTOR: ALL },
  'employee.update': { CEO: ALL, HR_DIRECTOR: ALL },
  'payroll.periods.read': { CEO: ALL, HR_DIRECTOR: ALL },
  'payroll.calculate': { CEO: ALL, HR_DIRECTOR: ALL },
  'leave.create': { CEO: 'self', HR_DIRECTOR: 'self', LINE_MANAGER: 'self', EMPLOYEE: 'self' },
  'leave.read': { CEO: ALL, HR_DIRECTOR: ALL, LINE_MANAGER: DEPT, EMPLOYEE: 'self' },
  'leave.approve': { CEO: ALL, HR_DIRECTOR: ALL, LINE_MANAGER: DEPT },
  'leave.reject': { CEO: ALL, HR_DIRECTOR: ALL, LINE_MANAGER: DEPT },
  'user.read': ADMINS,
  'user.create': ADMINS,
  'user.update': ADMINS,
  'user.resetPassword': ADMINS,
  'department.manage': { CEO: ALL, HR_DIRECTOR: ALL },
  'position.manage': { CEO: ALL, HR_DIRECTOR: ALL },
  'audit.read': { CEO: ALL, ADMIN: ALL },
  'project.create': { CEO: ALL, HR_DIRECTOR: ALL, LINE_MANAGER: DEPT },
};

module.exports = { matrix };
