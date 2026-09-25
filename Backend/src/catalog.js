module.exports = {
  "name": "NEXUS HR Management System API",
  "version": "1.2.0",
  "endpoints": {
    "auth": {
      "POST /api/auth/login": "Đăng nhập (trả accessToken, refreshToken)",
      "POST /api/auth/refresh": "Đổi refresh token lấy cặp token mới",
      "POST /api/auth/logout": "Đăng xuất (thu hồi refresh token)",
      "GET  /api/auth/me": "Thông tin cá nhân",
      "POST /api/auth/change-password": "Đổi mật khẩu"
    },
    "users": {
      "GET   /api/users": "Danh sách tài khoản (search, role, active, phân trang)",
      "GET   /api/users/:id": "Chi tiết tài khoản",
      "POST  /api/users": "Tạo tài khoản (CEO/HRD/ADMIN)",
      "PATCH /api/users/:id": "Đổi vai trò / khóa tài khoản",
      "POST  /api/users/:id/reset-password": "Đặt lại mật khẩu tạm",
      "POST  /api/users/:id/unlock": "Mở khóa tài khoản"
    },
    "employees": {
      "GET  /api/employees": "Danh sách NV (search, filter, phân trang; ẩn dữ liệu nhạy cảm theo vai trò)",
      "GET  /api/employees/:id": "Chi tiết NV (Profile 360)",
      "POST /api/employees": "Thêm NV + hợp đồng ban đầu (HRD/CEO)",
      "PUT  /api/employees/:id": "Sửa NV (HRD/CEO)",
      "POST /api/employees/:id/offboard": "Cho NV nghỉ việc (HRD/CEO)",
      "POST /api/employees/import": "Nhập hàng loạt NV, tối đa 500 dòng (HRD/CEO)"
    },
    "contracts": {
      "GET  /api/employees/:id/contracts": "Hợp đồng của NV (HRD/CEO, hoặc chính NV)",
      "POST /api/employees/:id/contracts": "Tạo hợp đồng (HRD/CEO)",
      "GET  /api/contracts/:id": "Chi tiết hợp đồng",
      "PUT  /api/contracts/:id": "Sửa hợp đồng còn hiệu lực/chờ ký",
      "POST /api/contracts/:id/activate": "Kích hoạt hợp đồng chờ ký",
      "POST /api/contracts/:id/terminate": "Chấm dứt hợp đồng"
    },
    "departments": {
      "GET    /api/departments": "Danh sách phòng ban",
      "GET    /api/departments/:id": "Chi tiết phòng ban",
      "GET    /api/departments/:id/employees": "NV theo phòng ban",
      "POST   /api/departments": "Tạo phòng ban (HRD/CEO)",
      "PUT    /api/departments/:id": "Sửa phòng ban (HRD/CEO)",
      "DELETE /api/departments/:id": "Ngừng hoạt động phòng ban"
    },
    "positions": {
      "GET    /api/positions": "Danh sách chức danh",
      "GET    /api/positions/:id": "Chi tiết chức danh",
      "POST   /api/positions": "Tạo chức danh (HRD/CEO)",
      "PUT    /api/positions/:id": "Sửa chức danh (HRD/CEO)",
      "DELETE /api/positions/:id": "Ngừng sử dụng chức danh"
    },
    "attendance": {
      "POST /api/attendance/check-in": "Check-in",
      "POST /api/attendance/check-out": "Check-out",
      "GET  /api/attendance": "Lịch sử chấm công",
      "GET  /api/attendance/me/today": "Trạng thái hôm nay"
    },
    "leaves": {
      "POST  /api/leaves": "Nộp đơn phép",
      "GET   /api/leaves": "Danh sách đơn phép",
      "GET   /api/leaves/types": "Loại phép",
      "GET   /api/leaves/balances/:empId": "Số dư phép",
      "PATCH /api/leaves/:id/approve": "Duyệt phép (2 cấp)",
      "PATCH /api/leaves/:id/reject": "Từ chối phép",
      "PATCH /api/leaves/:id/cancel": "Hủy đơn phép"
    },
    "payroll": {
      "GET  /api/payroll/periods": "Kỳ lương",
      "GET  /api/payroll/payslips": "Phiếu lương",
      "GET  /api/payroll/me": "Lương cá nhân",
      "POST /api/payroll/calculate": "Tính lương tháng (HRD)"
    },
    "projects": {
      "GET   /api/projects": "Danh sách dự án",
      "GET   /api/projects/:id/tasks": "Tasks theo dự án",
      "PATCH /api/projects/tasks/:id/stage": "Chuyển Kanban stage",
      "GET   /api/projects/squads": "Danh sách squads"
    },
    "dashboard": {
      "GET /api/dashboard/stats": "KPIs Dashboard",
      "GET /api/dashboard/notifications": "Thông báo"
    },
    "auditLogs": {
      "GET /api/audit-logs": "Nhật ký hệ thống (CEO/ADMIN)"
    }
  }
};
