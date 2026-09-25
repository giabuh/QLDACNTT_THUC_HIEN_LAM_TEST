module.exports = {
  name: 'NEXUS HR Management System API',
  version: '1.0.0',
  endpoints: {
    auth: {
      'POST /api/auth/login': 'Đăng nhập',
      'GET  /api/auth/me': 'Thông tin cá nhân',
      'POST /api/auth/change-password': 'Đổi mật khẩu',
    },
    employees: {
      'GET  /api/employees': 'Danh sách NV (search, filter, pagination)',
      'GET  /api/employees/:id': 'Chi tiết NV',
      'POST /api/employees': 'Thêm NV (HRD/CEO)',
      'PUT  /api/employees/:id': 'Sửa NV (HRD/CEO)',
    },
    departments: {
      'GET  /api/departments': 'Danh sách phòng ban',
      'GET  /api/departments/:id/employees': 'NV theo phòng ban',
    },
    attendance: {
      'POST /api/attendance/check-in': 'Check-in',
      'POST /api/attendance/check-out': 'Check-out',
      'GET  /api/attendance': 'Lịch sử chấm công',
      'GET  /api/attendance/me/today': 'Trạng thái hôm nay',
    },
    leaves: {
      'POST  /api/leaves': 'Nộp đơn phép',
      'GET   /api/leaves': 'Danh sách đơn phép',
      'GET   /api/leaves/types': 'Loại phép',
      'GET   /api/leaves/balances/:empId': 'Số dư phép',
      'PATCH /api/leaves/:id/approve': 'Duyệt phép (2 cấp)',
      'PATCH /api/leaves/:id/reject': 'Từ chối phép',
      'PATCH /api/leaves/:id/cancel': 'Hủy đơn phép',
    },
    payroll: {
      'GET  /api/payroll/periods': 'Kỳ lương',
      'GET  /api/payroll/payslips': 'Phiếu lương',
      'GET  /api/payroll/me': 'Lương cá nhân',
      'POST /api/payroll/calculate': 'Tính lương tháng (HRD)',
    },
    projects: {
      'GET   /api/projects': 'Danh sách dự án',
      'GET   /api/projects/:id/tasks': 'Tasks theo dự án',
      'PATCH /api/projects/tasks/:id/stage': 'Chuyển Kanban stage',
      'GET   /api/projects/squads': 'Danh sách squads',
    },
    dashboard: {
      'GET /api/dashboard/stats': 'KPIs Dashboard',
      'GET /api/dashboard/notifications': 'Thông báo',
    },
  },
};
