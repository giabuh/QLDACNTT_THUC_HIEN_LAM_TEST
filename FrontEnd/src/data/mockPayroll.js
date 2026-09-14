export const mockPayrollSummary = {
  period: "Tháng 09/2026",
  status: "Đang tính toán (Dự thảo)",
  totalNet: 3842500000,
  totalOtHours: 420.5,
  totalOtEmployees: 48,
  avgOtHours: 8.7,
  totalBhxh: 412000000,
  totalTax: 185200000,
  totalHeadcount: 348,
  netGrowth: 2.4,
  companyBankAccount: "0071 0008 89988",
  companyBankName: "VCB Chi nhánh TP.HCM • FWB NEXUS CORP",
  availableBalance: 12850000000
};

export const mockPayrollAnomalies = [
  {
    id: "ANO-01",
    type: "violation",
    severity: "Cao",
    badgeText: "🔴 VI PHẠM LUẬT LAO ĐỘNG: VƯỢT TRẦN LÀM THÊM GIỜ",
    employeeId: "NV-1042",
    employeeName: "Lê Anh Tuấn",
    role: "Kỹ sư DevOps",
    department: "Khối Kỹ thuật và Hạ tầng",
    metricValue: "44.5 giờ OT / tháng",
    metricLimit: "Giới hạn luật định: Tối đa 40h/tháng",
    description: "Nhân viên phát sinh thêm 4.5 giờ làm thêm ngoài định mức tối đa 40h/tháng theo Điều 107 Bộ luật Lao động 2019 do tham gia ứng cứu 2 sự cố sập server DC ngày 05/09 (trực ca đêm khẩn cấp 12h) và sự cố bảo mật ngày 19/09.",
    financialImpact: "1.850.000 VNĐ (Tính theo hệ số 200% ca đêm ngoài giờ)",
    options: [
      { id: "opt1", text: "Đính kèm văn bản phê duyệt ngoại lệ của Ban Giám đốc (Có tờ trình khẩn)", selected: true },
      { id: "opt2", text: "Điều chuyển 4.5h sang Nghỉ bù hưởng lương tháng 10/2026", selected: false }
    ]
  },
  {
    id: "ANO-02",
    type: "unapproved",
    severity: "Trung bình",
    badgeText: "🟡 KHOẢN CHI CHƯA ĐƯỢC DUYỆT BỞI TRƯỞNG PHÒNG",
    employeeId: "NV-1089",
    employeeName: "Phạm Hương Ly",
    role: "Chuyên viên Kinh doanh",
    department: "Khối Sales B2B",
    metricValue: "Thưởng hoa hồng: 15.000.000 đ",
    metricLimit: "Hoa hồng dự án Vinatex ERP",
    description: "Khoản hoa hồng hợp đồng bản quyền phần mềm Vinatex (15.000.000 VNĐ) do nhân viên đề xuất ngày 09/09 hiện chưa có chữ ký điện tử xác nhận số liệu từ Trưởng phòng Kinh doanh (ông Vũ Trọng Phụng).",
    deadline: "17:00 hôm nay (12/09)"
  },
  {
    id: "ANO-03",
    type: "surge",
    severity: "Thông báo",
    badgeText: "🔵 BIẾN ĐỘNG THU NHẬP TĂNG ĐỘT BIẾN (+35.2%)",
    employeeId: "NV-1002",
    employeeName: "Trần Đình Trọng",
    role: "Team Lead DevOps",
    department: "Kỹ thuật Phần mềm",
    metricValue: "Lương Net: 41.850.000 đ",
    metricLimit: "T8: 31.000.000 đ ➔ T9: 41.850.000 đ",
    description: "AI Kiểm tra đối soát: Thu nhập tăng vọt do ghi nhận +3.850.000đ tiền làm thêm giờ (22h OT dự án Golive) + Phụ cấp trực lễ 2/9. Dữ liệu đã khớp 100% với nhật ký Face ID cổng chính, không có gian lận chấm công."
  }
];

export const mockBankBatchPreview = [
  { stt: "01", stk: "1018 2948 29", name: "DANG THU THAO", bank: "Vietcombank", amount: 24950000, note: "FWB NEXUS TRA LUONG THANG 09/2026" },
  { stt: "02", stk: "0071 9384 11", name: "TRAN DINH TRONG", bank: "Vietcombank", amount: 35850000, note: "FWB NEXUS TRA LUONG THANG 09/2026" },
  { stt: "03", stk: "1029 3847 55", name: "VU MAI CHI", bank: "Vietcombank", amount: 16290000, note: "FWB NEXUS TRA LUONG THANG 09/2026" },
  { stt: "04", stk: "1903 8472 90", name: "HOANG QUOC BAO", bank: "Techcombank", amount: 26750000, note: "FWB NEXUS TRA LUONG THANG 09/2026" }
];
