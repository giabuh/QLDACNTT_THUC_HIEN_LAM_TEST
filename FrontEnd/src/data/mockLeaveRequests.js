export const mockLeaveRequests = [
  {
    id: "LV-2026-0915",
    employeeId: "NV-0842",
    employeeName: "Lê Minh Tuấn",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    role: "Kỹ sư UI/UX",
    department: "Phòng Sản phẩm",
    type: "Nghỉ phép năm",
    startDate: "18/09/2026",
    endDate: "19/09/2026",
    daysCount: 2,
    reason: "Giải quyết việc gia đình đột xuất ở quê. Đã bàn giao các màn hình Figma và tài nguyên UI.",
    handoverTo: "Hoàng Quốc Bảo (Kỹ sư Phần mềm)",
    attachmentName: "Bien_ban_ban_giao_cong_viec.pdf",
    attachmentSize: "1.4 MB",
    leaveBalance: 7,
    totalAnnualLeave: 12,
    status: "pending",
    submittedAt: "12/09/2026 08:30",
    steps: [
      { step: 1, title: "Nhân viên nộp đơn", person: "Lê Minh Tuấn", time: "12/09 08:30", status: "completed" },
      { step: 2, title: "Trưởng bộ phận duyệt", person: "Vũ Đình Khang (Lead UI/UX)", status: "active" },
      { step: 3, title: "HR rà soát quỹ phép", person: "Trần Mai Hương", status: "waiting" },
      { step: 4, title: "Cập nhật Bảng công", person: "Hệ thống tự động", status: "waiting" }
    ]
  },
  {
    id: "LV-2026-0842",
    employeeId: "NV-0219",
    employeeName: "Nguyễn Thị Hà",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    role: "Kế toán viên",
    department: "Phòng Kế toán và Tài chính",
    type: "Nghỉ ốm BHXH",
    startDate: "12/09/2026",
    endDate: "13/09/2026",
    daysCount: 2,
    reason: "Sốt siêu vi cấp tính, viêm họng hạt cấp theo chỉ định của Bệnh viện Hoàn Mỹ.",
    attachmentName: "Giay_nghi_om_C65_BV_Hoan_My.jpg",
    leaveBalance: 7.5,
    status: "pending",
    medicalDoc: {
      hospital: "BỆNH VIỆN ĐA KHOA HOÀN MỸ SÀI GÒN",
      department: "Khoa Khám bệnh Ngoại trú và Cấp cứu",
      docNumber: "1842/GCN-KKB",
      formNumber: "C65-HD (Thông tư 56/2017/TT-BYT)",
      patientName: "NGUYỄN THỊ HÀ",
      birthYear: 1996,
      gender: "Nữ",
      bhxhNumber: "DN 4 79 79 248901 02",
      companyName: "CÔNG TY CP CÔNG NGHỆ FWB NEXUS",
      diagnosis: "Sốt siêu vi cấp tính, viêm họng hạt cấp (Mã ICD-10: J02.9)",
      leaveDays: 2,
      fromDate: "12/09/2026",
      toDate: "13/09/2026",
      doctorName: "BS.CKI. TRẦN ĐỨC THẮNG",
      salaryBase: 15000000,
      benefitAmount: 937500,
      formulaText: "(15.000.000đ ÷ 24) × 75% × 2 ngày = 937.500 VNĐ"
    }
  }
];

export const mockCalendarEvents = {
  2: [{ name: "Nghỉ Lễ Quốc Khánh 2/9", type: "holiday" }],
  12: [
    { name: "Lê Minh Tuấn • Phép năm", type: "annual" },
    { name: "Nguyễn Thị Hà • Ốm BHXH", type: "sick" },
    { name: "Trần Quốc Bảo • Công tác HN", type: "business" }
  ],
  13: [
    { name: "Nguyễn Thị Hà • Ốm BHXH (Ngày 2)", type: "sick" }
  ],
  18: [
    { name: "Đỗ Hải Long • Phép năm", type: "annual" },
    { name: "Hoàng Văn Nam • Phép năm", type: "annual" },
    { name: "Đặng Thu Thảo • Việc riêng", type: "personal" }
  ],
  19: [
    { name: "Đỗ Hải Long • Phép năm (Ngày 2)", type: "annual" },
    { name: "Hoàng Văn Nam • Phép năm (Ngày 2)", type: "annual" }
  ]
};
