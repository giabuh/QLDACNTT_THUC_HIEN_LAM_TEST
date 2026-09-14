// Mock Notifications tailored per Role & Organizational Level
// Reflects authentic Vietnamese enterprise hierarchy and workflows

export const mockNotificationsData = {
  EMPLOYEE: [
    {
      id: 'NOTIF-EMP-01',
      type: 'approval',
      category: 'Phê duyệt nghỉ phép',
      categoryBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      title: 'Đơn xin nghỉ phép thường niên LP-2026-089 đã được phê duyệt',
      summary: 'Trưởng phòng Vũ Đình Khang đã phê duyệt đơn nghỉ 02 ngày (18/09 - 19/09/2026). Công việc bàn giao cho Nguyễn Văn Tuấn.',
      sender: {
        name: 'Vũ Đình Khang',
        role: 'Trưởng Phòng Kỹ Thuật',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        id: 'NV-1002'
      },
      time: '15 phút trước',
      isRead: false,
      priority: 'normal',
      actionType: 'leave_detail',
      actionPayload: {
        id: 'LP-2026-089',
        employeeName: 'Phạm Minh Quân',
        employeeId: 'NV-0842',
        employeeRole: 'Kỹ sư Phần mềm (Frontend)',
        employeeDept: 'Phòng Phát triển Phần mềm',
        leaveType: 'Nghỉ phép thường niên (Annual Leave)',
        range: '18/09/2026 - 19/09/2026 (02 ngày)',
        daysCount: 2,
        reason: 'Du lịch nghỉ dưỡng cùng gia đình',
        handoverPerson: 'Nguyễn Văn Tuấn (Kỹ sư Backend)',
        attachedFile: 'Bien_ban_ban_giao_cong_viec.docx',
        status: 'approved',
        approvalNote: 'Đồng ý phê duyệt, đề nghị hoàn thành bàn giao trước 17h ngày 17/09.',
        submittedAt: '05/09/2026 14:15'
      },
      actionButtonText: 'Xem chi tiết đơn đã duyệt'
    },
    {
      id: 'NOTIF-EMP-02',
      type: 'company_award',
      category: 'Thông báo Ban Giám Đốc',
      categoryBadge: 'bg-purple-50 text-purple-700 border-purple-200',
      title: 'Quyết định khen thưởng tập thể Dự án xuất sắc Quý 3/2026',
      summary: 'Tổng Giám Đốc Lê Vũ Ngọc Duy ký quyết định vinh danh Squad Kỹ thuật Phần mềm hoàn thành xuất sắc Sprint 42, thưởng nóng 15.000.000 VNĐ.',
      sender: {
        name: 'Lê Vũ Ngọc Duy',
        role: 'Tổng Giám Đốc (CEO)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        id: 'NV-0001'
      },
      time: '08:30 Hôm nay',
      isRead: false,
      priority: 'high',
      actionType: 'notice_popup',
      actionPayload: {
        docNumber: 'Số: 128/2026/QĐ-TGĐ',
        title: 'QUYẾT ĐỊNH KHEN THƯỞNG VÀ VINH DANH TẬP THỂ XUẤT SẮC',
        signer: 'Lê Vũ Ngọc Duy - Tổng Giám Đốc',
        date: '12/09/2026',
        content: `Căn cứ đề xuất của Trưởng phòng Kỹ thuật và Giám đốc Nhân sự, Tổng Giám Đốc quyết định:
1. Tặng Giấy khen và thưởng nóng 15.000.000 VNĐ cho tập thể Kỹ sư Frontend & Backend đã nỗ lực hoàn thành tính năng Microservices v2.3 vượt tiến độ 15%.
2. Ghi nhận thành tích đóng góp của cá nhân Kỹ sư Phạm Minh Quân trong việc tối ưu hóa hiệu năng tải trang giảm 40% latency.
3. Phòng Tài chính - Kế toán chịu trách nhiệm chi trả thưởng vào kỳ thanh toán lương tháng 09/2026.`,
        attachedFile: 'Quyet_dinh_khen_thuong_tap_the_Q3_CEO_signed.pdf'
      },
      actionButtonText: 'Xem văn bản quyết định'
    },
    {
      id: 'NOTIF-EMP-03',
      type: 'payroll',
      category: 'Thông báo Tiền lương',
      categoryBadge: 'bg-blue-50 text-blue-700 border-blue-200',
      title: 'Phiếu lương điện tử Tháng 09/2026 đã sẵn sàng quyết toán',
      summary: 'Thực nhận 31.060.000 VNĐ (đã bao gồm 12.5h OT và thưởng KPI loại A). Đã chuyển khoản qua Vietcombank ngày 28/09/2026.',
      sender: {
        name: 'Trần Mai Hương',
        role: 'Giám Đốc Nhân Sự (HRD)',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
        id: 'NV-1001'
      },
      time: 'Hôm qua 17:00',
      isRead: true,
      priority: 'normal',
      actionType: 'payslip_popup',
      actionPayload: {
        name: 'Phạm Minh Quân',
        id: 'NV-0842',
        role: 'Kỹ sư Phần mềm',
        dept: 'Phòng Phát triển Phần mềm',
        contractSalary: 28000000
      },
      actionButtonText: 'Xem phiếu lương chi tiết'
    },
    {
      id: 'NOTIF-EMP-04',
      type: 'health_check',
      category: 'Y tế & Phúc lợi',
      categoryBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      title: 'Lịch khám sức khỏe định kỳ năm 2026 tại Bệnh viện Vinmec',
      summary: 'Gói khám Platinum toàn diện trị giá 4.500.000 VNĐ do công ty tài trợ 100%. Diễn ra từ ngày 18/09 - 20/09/2026.',
      sender: {
        name: 'Phòng Nhân sự và Đãi ngộ',
        role: 'Bộ phận C&B & Y tế',
        avatar: null,
        id: 'HR-OFFICE'
      },
      time: '2 ngày trước',
      isRead: true,
      priority: 'normal',
      actionType: 'health_popup',
      actionPayload: {
        title: 'Lịch khám sức khỏe định kỳ năm 2026 toàn công ty'
      },
      actionButtonText: 'Đăng ký khung giờ khám'
    }
  ],

  LINE_MANAGER: [
    {
      id: 'NOTIF-MGR-01',
      type: 'subordinate_leave',
      category: 'Đơn từ nhân viên',
      categoryBadge: 'bg-amber-50 text-amber-700 border-amber-200',
      title: 'Đơn xin nghỉ phép mới chờ duyệt: Phạm Minh Quân (LP-2026-104)',
      summary: 'Nghỉ việc riêng hưởng nguyên lương (Hiếu hỷ 01 ngày: 25/09/2026). Đã có biên bản bàn giao task và thiệp mời đính kèm.',
      sender: {
        name: 'Phạm Minh Quân',
        role: 'Kỹ sư Phần mềm (Frontend)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        id: 'NV-0842'
      },
      time: '10 phút trước',
      isRead: false,
      priority: 'high',
      actionType: 'leave_detail',
      actionPayload: {
        id: 'LP-2026-104',
        empName: 'Phạm Minh Quân',
        employeeName: 'Phạm Minh Quân',
        empId: 'NV-0842',
        employeeId: 'NV-0842',
        role: 'Kỹ sư Phần mềm (Frontend)',
        employeeRole: 'Kỹ sư Phần mềm (Frontend)',
        dept: 'Phòng Phát triển Phần mềm',
        employeeDept: 'Phòng Phát triển Phần mềm',
        type: 'Nghỉ việc riêng hưởng nguyên lương (Hiếu hỷ)',
        leaveType: 'Nghỉ việc riêng hưởng nguyên lương (Hiếu hỷ)',
        range: '25/09/2026 (01 ngày)',
        daysCount: 1,
        reason: 'Gia đình có việc hiếu hỷ (Lễ cưới em ruột theo Bộ Luật Lao Động)',
        handoverPerson: 'Vũ Mai Chi (Senior Designer)',
        conflictCheck: 'Không trùng lịch Sprint Demo',
        approvalType: 'one_level',
        attachedFile: 'Thiep_moi_cuoi_va_xac_nhan.jpg',
        status: 'pending',
        submittedAt: '12/09/2026 09:30'
      },
      actionButtonText: 'Thẩm định & Phê duyệt ngay'
    },
    {
      id: 'NOTIF-MGR-02',
      type: 'ceo_directive',
      category: 'Chỉ đạo Ban Giám Đốc',
      categoryBadge: 'bg-rose-50 text-rose-700 border-rose-200',
      title: 'Chỉ đạo khẩn: Đảm bảo tiến độ bàn giao Version 2.3 và bảo mật',
      summary: 'Tổng Giám Đốc yêu cầu Trưởng phòng rà soát phân bổ nhân lực, sẵn sàng phương án backup server và báo cáo trước 16h Thứ Tư.',
      sender: {
        name: 'Lê Vũ Ngọc Duy',
        role: 'Tổng Giám Đốc (CEO)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        id: 'NV-0001'
      },
      time: '08:15 Hôm nay',
      isRead: false,
      priority: 'high',
      actionType: 'notice_popup',
      actionPayload: {
        docNumber: 'Số: 45/2026/CĐ-TGĐ',
        title: 'CÔNG VĂN CHỈ ĐẠO TRIỂN KHAI PHÁT HÀNH HỆ THỐNG PHIÊN BẢN 2.3',
        signer: 'Lê Vũ Ngọc Duy - Tổng Giám Đốc',
        date: '12/09/2026',
        content: `Kính gửi: Trưởng phòng Kỹ thuật Phần mềm (Vũ Đình Khang),
Nhằm đảm bảo cam kết chất lượng dịch vụ SLA với đối tác chiến lược:
1. Yêu cầu Trưởng phòng Kỹ thuật trực tiếp chỉ đạo đội ngũ rà soát toàn bộ code-base, hoàn tất kiểm thử tải (Load Testing) đạt chuẩn 10.000 CCU trước ngày 22/09/2026.
2. Phân công tối thiểu 02 Kỹ sư Backend trực ca đêm bảo trì dữ liệu từ 23h00 ngày 24/09 đến 04h00 ngày 25/09.
3. Báo cáo phương án điều phối nhân sự và danh sách trực ca cho Tổng Giám Đốc trước 16h00 ngày 16/09/2026.`,
        attachedFile: 'Ke_hoach_trien_khai_Release_v2.3.pdf'
      },
      actionButtonText: 'Xem công văn chỉ đạo'
    },
    {
      id: 'NOTIF-MGR-03',
      type: 'late_attendance',
      category: 'Điểm danh bộ phận',
      categoryBadge: 'bg-amber-50 text-amber-700 border-amber-200',
      title: 'Báo cáo điểm danh: 2 nhân sự bộ phận Kỹ thuật đi trễ sáng nay',
      summary: 'Nguyễn Văn Nam (trễ 25 phút - kẹt xe Ngã Tư Sở) và Đặng Văn Hùng (trễ 38 phút - cần giải trình). Đề nghị Trưởng phòng kiểm tra.',
      sender: {
        name: 'Trần Mai Hương',
        role: 'Giám Đốc Nhân Sự (HRD)',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
        id: 'NV-1001'
      },
      time: '08:45 Hôm nay',
      isRead: false,
      priority: 'normal',
      actionType: 'late_absence_popup',
      actionPayload: {},
      actionButtonText: 'Xem danh sách đi trễ & gửi nhắc nhở'
    },
    {
      id: 'NOTIF-MGR-04',
      type: 'ot_request',
      category: 'Đăng ký tăng ca (OT)',
      categoryBadge: 'bg-blue-50 text-blue-700 border-blue-200',
      title: 'Đăng ký làm thêm giờ (OT): Lê Hoàng Nam (Kỹ sư Frontend)',
      summary: 'Đăng ký 8 giờ tăng ca thứ Bảy tuần này để hoàn thiện tích hợp API thanh toán theo yêu cầu đối tác. Đề xuất tính vào quỹ nghỉ bù.',
      sender: {
        name: 'Lê Hoàng Nam',
        role: 'Kỹ sư Frontend (Web)',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        id: 'NV-0843'
      },
      time: 'Hôm qua 16:30',
      isRead: true,
      priority: 'normal',
      actionType: 'ot_popup',
      actionPayload: {},
      actionButtonText: 'Xét duyệt phiếu tăng ca'
    }
  ],

  HR_DIRECTOR: [
    {
      id: 'NOTIF-HRD-01',
      type: 'ceo_approval',
      category: 'Chỉ đạo Ban Giám Đốc',
      categoryBadge: 'bg-purple-50 text-purple-700 border-purple-200',
      title: 'Tổng Giám Đốc đã phê duyệt Kế hoạch Ngân sách Lương Q4/2026',
      summary: 'Định mức quỹ lương 4.2 tỷ/tháng và cơ chế thưởng dự án cuối năm đã được CEO ký phê duyệt. Đề nghị HRD triển khai quy chế.',
      sender: {
        name: 'Lê Vũ Ngọc Duy',
        role: 'Tổng Giám Đốc (CEO)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        id: 'NV-0001'
      },
      time: '30 phút trước',
      isRead: false,
      priority: 'high',
      actionType: 'notice_popup',
      actionPayload: {
        docNumber: 'Số: 132/2026/QĐ-TGĐ',
        title: 'PHÊ DUYỆT HẠN MỨC NGÂN SÁCH QUỸ LƯƠNG & CHẾ ĐỘ ĐÃI NGỘ QUÝ 4/2026',
        signer: 'Lê Vũ Ngọc Duy - Tổng Giám Đốc',
        date: '12/09/2026',
        content: `1. Phê duyệt định mức ngân sách chi lương và phụ cấp toàn doanh nghiệp Quý 4/2026 là 12.600.000.000 VNĐ (tương đương 4.2 tỷ VNĐ/tháng).
2. Đồng ý chủ trương trích lập 15% quỹ thưởng hiệu suất dành cho các phòng ban đạt KPI từ 95% trở lên.
3. Giao Giám đốc Nhân sự Trần Mai Hương chủ trì ban hành bảng quy chế đánh giá xếp hạng A/B/C trước ngày 25/09/2026.`,
        attachedFile: 'Quyet_dinh_phe_duyet_ngan_sach_Q4_CEO_signed.pdf'
      },
      actionButtonText: 'Xem quyết định phê duyệt'
    },
    {
      id: 'NOTIF-HRD-02',
      type: 'c65_claim',
      category: 'Thẩm duyệt BHXH',
      categoryBadge: 'bg-amber-50 text-amber-700 border-amber-200',
      title: 'Hồ sơ C65 đề nghị trợ cấp BHXH chế độ ốm đau: Nguyễn Thị Hà',
      summary: 'Kế toán viên Nguyễn Thị Hà nộp giấy ra viện Bệnh viện Hoàn Mỹ đề nghị thanh toán 75% trợ cấp BHXH (1 ngày). Cần HRD kiểm tra đối soát.',
      sender: {
        name: 'Nguyễn Thị Hà',
        role: 'Kế toán viên (Tài chính Kế toán)',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
        id: 'NV-1004'
      },
      time: '1 giờ trước',
      isRead: false,
      priority: 'high',
      actionType: 'leave_detail',
      actionPayload: {
        id: 'LR-02',
        employeeName: 'Nguyễn Thị Hà',
        employeeId: 'NV-1004',
        employeeRole: 'Kế toán viên',
        employeeDept: 'Phòng Tài chính Kế toán',
        leaveType: 'Nghỉ ốm đau hưởng trợ cấp Bảo hiểm Xã hội (C65-HD)',
        type: 'Nghỉ ốm BHXH (C65-HD)',
        range: '13/09/2026 (01 ngày)',
        daysCount: 1,
        reason: 'Điều trị ngoại trú tại Bệnh viện Quốc tế Hoàn Mỹ. Kèm giấy chứng nhận nghỉ việc hưởng BHXH (Mẫu C65-HD).',
        handoverPerson: 'Trần Thị Mỹ Linh (Phó phòng Kế toán)',
        attachedFile: 'Giay_ra_vien_chung_nhan_C65_BHXH.pdf',
        approvalType: 'hr_c65',
        status: 'pending',
        submittedAt: '12/09/2026 14:20'
      },
      actionButtonText: 'Kiểm tra chứng từ C65'
    },
    {
      id: 'NOTIF-HRD-03',
      type: 'payroll_anomaly',
      category: 'Cảnh báo Bảng lương',
      categoryBadge: 'bg-rose-50 text-rose-700 border-rose-200',
      title: 'Phát hiện 3 trường hợp bất thường cần giải trình trước khi chốt bảng lương',
      summary: '1 nhân sự vượt trần 40h OT luật định, 1 khoản hoa hồng chưa duyệt, 1 trường hợp biến động thu nhập >35%.',
      sender: {
        name: 'Hệ thống C&B Tự động',
        role: 'AI Payroll Engine',
        avatar: null,
        id: 'SYSTEM-PAYROLL'
      },
      time: '07:30 Hôm nay',
      isRead: false,
      priority: 'high',
      actionType: 'payroll_anomaly_popup',
      actionPayload: {},
      actionButtonText: 'Đối soát 3 bất thường'
    },
    {
      id: 'NOTIF-HRD-04',
      type: 'attendance_report',
      category: 'Báo cáo chuyên cần',
      categoryBadge: 'bg-blue-50 text-blue-700 border-blue-200',
      title: 'Báo cáo chuyên cần toàn công ty: 14 trường hợp đi trễ hôm nay',
      summary: 'Tỷ lệ đúng giờ toàn doanh nghiệp đạt 96.0% (334/348 nhân sự). Có 4 trường hợp đi trễ > 30 phút cần gửi yêu cầu giải trình.',
      sender: {
        name: 'Cổng Điểm Danh A1 & A2',
        role: 'Hệ thống FaceID Kiosk',
        avatar: null,
        id: 'KIOSK-GATE'
      },
      time: '08:35 Hôm nay',
      isRead: true,
      priority: 'normal',
      actionType: 'late_absence_popup',
      actionPayload: {},
      actionButtonText: 'Xem danh sách 14 trường hợp'
    }
  ],

  CEO: [
    {
      id: 'NOTIF-CEO-01',
      type: 'manager_leave',
      category: 'Phê duyệt cấp Trưởng',
      categoryBadge: 'bg-amber-50 text-amber-700 border-amber-200',
      title: 'Đơn xin nghỉ phép cấp Trưởng phòng: Vũ Đình Khang',
      summary: 'Trưởng phòng Kỹ thuật xin nghỉ phép 02 ngày (28/09 - 29/09/2026) tham dự Hội thảo AI Singapore. Đã ủy quyền điều hành cho Phạm Minh Quân.',
      sender: {
        name: 'Vũ Đình Khang',
        role: 'Trưởng Phòng Kỹ Thuật',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        id: 'NV-1002'
      },
      time: '20 phút trước',
      isRead: false,
      priority: 'high',
      actionType: 'leave_detail',
      actionPayload: {
        id: 'CEO-APP-1',
        employeeName: 'Vũ Đình Khang',
        employeeId: 'NV-1002',
        employeeRole: 'Trưởng Phòng Kỹ Thuật Phần Mềm',
        employeeDept: 'Phòng Phát triển Phần mềm',
        leaveType: 'Nghỉ phép năm thường niên',
        type: 'Nghỉ phép năm (02 ngày)',
        range: '28/09/2026 - 29/09/2026 (02 ngày)',
        daysCount: 2,
        reason: 'Tham gia hội thảo Quốc tế AI & Cloud Engineer Singapore Summit 2026',
        handoverPerson: 'Phạm Minh Quân (Senior Kỹ sư Phần mềm)',
        approvalType: 'ceo_direct',
        attachedFile: 'Thu_moi_hoi_nghi_AI_Singapore_2026.pdf',
        status: 'pending',
        submittedAt: '12/09/2026 09:15',
        note: 'Đã phân chia task Sprint 24 và ủy quyền điều hành trực tiếp cho Phạm Minh Quân.'
      },
      actionButtonText: 'Xem hồ sơ & Duyệt đơn'
    },
    {
      id: 'NOTIF-CEO-02',
      type: 'payroll_submission',
      category: 'Tờ trình phê duyệt lương',
      categoryBadge: 'bg-purple-50 text-purple-700 border-purple-200',
      title: 'Tờ trình phê duyệt chi trả quỹ lương Tháng 09/2026 toàn công ty',
      summary: 'Kính trình Tổng Giám Đốc phê duyệt bảng lương 3.84 tỷ VNĐ cho 348 nhân sự. Đã hoàn tất đối soát thuế TNCN và trích nộp BHXH.',
      sender: {
        name: 'Trần Mai Hương',
        role: 'Giám Đốc Nhân Sự (HRD)',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
        id: 'NV-1001'
      },
      time: '09:00 Hôm nay',
      isRead: false,
      priority: 'high',
      actionType: 'bank_transfer_popup',
      actionPayload: {},
      actionButtonText: 'Kiểm tra & Phê duyệt chi trả'
    },
    {
      id: 'NOTIF-CEO-03',
      type: 'ai_turnover',
      category: 'Cảnh báo Rủi ro Nhân tài',
      categoryBadge: 'bg-rose-50 text-rose-700 border-rose-200',
      title: 'AI Analytics: Phát hiện 3 nhân sự chủ chốt có nguy cơ rời bỏ doanh nghiệp',
      summary: 'Mô hình AI dự báo Flight Risk cao tại squad Kỹ thuật và Marketing do cạnh tranh thị trường. Đề xuất gói đãi ngộ giữ chân.',
      sender: {
        name: 'NEXUS AI Predictor',
        role: 'Hệ Thống Phân Tích Dữ Liệu Nhân Sự',
        avatar: null,
        id: 'AI-PREDICTOR'
      },
      time: 'Hôm qua 15:20',
      isRead: false,
      priority: 'high',
      actionType: 'turnover_popup',
      actionPayload: {},
      actionButtonText: 'Xem phân tích rủi ro nhân sự'
    },
    {
      id: 'NOTIF-CEO-04',
      type: 'operations_summary',
      category: 'Giám sát điều hành',
      categoryBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      title: 'Báo cáo vận hành ngày: Tỷ lệ hiện diện toàn công ty đạt 98.8%',
      summary: 'Toàn công ty có 344/348 nhân sự đang làm việc. Tỷ lệ vắng mặt 1.2% (rất tốt so với chuẩn ngành < 2.5%).',
      sender: {
        name: 'Ban Kiểm Soát Nội Bộ',
        role: 'Khối Vận Hành Doanh Nghiệp',
        avatar: null,
        id: 'INTERNAL-AUDIT'
      },
      time: '08:30 Hôm nay',
      isRead: true,
      priority: 'normal',
      actionType: 'late_absence_popup',
      actionPayload: {},
      actionButtonText: 'Xem báo cáo chuyên cần'
    }
  ]
};
