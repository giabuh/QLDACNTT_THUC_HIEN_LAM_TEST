module.exports = {
  "name": "NEXUS HR Management System API",
  "version": "1.3.0",
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
      "POST /api/attendance/check-in": "Check-in (gps/manual/qr/kiosk)",
      "POST /api/attendance/check-out": "Check-out",
      "GET  /api/attendance/me/today": "Trạng thái chấm công hôm nay",
      "GET  /api/attendance/qr": "Mã QR chấm công cá nhân (60 giây, dùng một lần)",
      "POST /api/attendance/kiosk/punch": "Kiosk quét QR: lần 1 vào, lần 2 ra (KIOSK/HRD/CEO)",
      "POST /api/attendance/adjust": "Điều chỉnh chấm công một ngày (HRD/CEO)",
      "GET  /api/attendance/timesheet": "Bảng công tháng theo nhân viên/ngày",
      "GET  /api/attendance/exceptions": "Đi muộn và vắng mặt trong ngày",
      "GET  /api/attendance/live": "Lượt chấm công mới nhất hôm nay",
      "GET  /api/attendance": "Lịch sử chấm công (phân trang, theo quyền)"
    },
    "leaves": {
      "POST  /api/leaves": "Nộp đơn phép (kiểm tra trùng ngày, số dư)",
      "GET   /api/leaves": "Danh sách đơn phép (phân trang, theo quyền)",
      "GET   /api/leaves/calendar": "Lịch nghỉ phép theo tháng",
      "GET   /api/leaves/types": "Loại phép",
      "GET   /api/leaves/balances/:employeeId": "Số dư phép (me hoặc mã NV)",
      "GET   /api/leaves/:id": "Chi tiết đơn phép",
      "PATCH /api/leaves/:id/approve": "Duyệt (NV → TP → HRD; QL/HRD → CEO)",
      "PATCH /api/leaves/:id/reject": "Từ chối (bắt buộc lý do)",
      "PATCH /api/leaves/:id/cancel": "Hủy đơn (chủ đơn)"
    },
    "otRequests": {
      "POST  /api/ot-requests": "Nộp đăng ký làm thêm giờ",
      "GET   /api/ot-requests": "Danh sách đăng ký làm thêm giờ (phân trang, theo quyền)",
      "GET   /api/ot-requests/:id": "Chi tiết đăng ký làm thêm giờ",
      "PATCH /api/ot-requests/:id/approve": "Duyệt theo chuỗi phê duyệt",
      "PATCH /api/ot-requests/:id/reject": "Từ chối (bắt buộc lý do)",
      "PATCH /api/ot-requests/:id/cancel": "Hủy (chủ đơn)"
    },
    "medicalClaims": {
      "POST  /api/medical-claims": "Nộp đơn bồi thường y tế",
      "GET   /api/medical-claims": "Danh sách đơn bồi thường y tế (phân trang, theo quyền)",
      "GET   /api/medical-claims/:id": "Chi tiết đơn bồi thường y tế",
      "PATCH /api/medical-claims/:id/approve": "Duyệt theo chuỗi phê duyệt",
      "PATCH /api/medical-claims/:id/reject": "Từ chối (bắt buộc lý do)",
      "PATCH /api/medical-claims/:id/cancel": "Hủy (chủ đơn)"
    },
    "payroll": {
      "GET  /api/payroll/periods": "Kỳ lương (HRD/CEO)",
      "GET  /api/payroll/periods/:id": "Chi tiết kỳ lương",
      "POST /api/payroll/periods/:id/lock": "Chốt bảng lương",
      "POST /api/payroll/periods/:id/transfer": "Đánh dấu đã chuyển khoản",
      "GET  /api/payroll/periods/:id/anomalies": "Bất thường trong kỳ lương",
      "GET  /api/payroll/periods/:id/bank-transfer": "Danh sách chuyển khoản ngân hàng",
      "GET  /api/payroll/payslips": "Phiếu lương (HRD/CEO tất cả; NV chỉ của mình sau khi chốt)",
      "GET  /api/payroll/payslips/:id": "Chi tiết phiếu lương",
      "GET  /api/payroll/me": "Phiếu lương của tôi (đã chốt)",
      "POST /api/payroll/calculate": "Tính lương tháng (HRD/CEO)"
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
