export const mockAiSummary = {
  avgScore: 86.4,
  scoreGrowth: 2.8,
  topTalentsCount: 48,
  atRiskCount: 14,
  anomalyAlertsCount: 3,
  departmentScores: [
    { name: "Kỹ thuật Phần mềm", score: 89.2 },
    { name: "Kinh doanh và Dự án", score: 88.1 },
    { name: "Marketing và Truyền thông", score: 85.6 },
    { name: "Nhân sự và Vận hành", score: 84.5 }
  ]
};

export const mockFlightRisk = {
  id: "NV-0845",
  employeeId: "NV-0845",
  name: "Hoàng Văn Long",
  employeeName: "Hoàng Văn Long",
  role: "Senior Backend Lead",
  department: "Kỹ thuật Phần mềm",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  tenure: "3 năm 2 tháng",
  status: "Chính thức",
  q2Score: 88.0,
  salary: 38000000,
  riskPercent: 84,
  timeframe: "Trong 15 - 30 ngày tới",
  signals: [
    {
      title: "Chênh lệch thu nhập so với thị trường: -18%",
      badge: "Báo cáo thị trường",
      badgeColor: "rose",
      desc: "Mức lương 38.000.000đ hiện thấp hơn 18% so với dải lương trung vị thị trường (45.000.000đ) cho vị trí Golang Tech Lead.",
      source: "Khảo sát thị trường 2026"
    },
    {
      title: "Tần suất làm thêm giờ (OT) tăng vọt: +65%",
      badge: "65% tăng OT",
      badgeColor: "amber",
      desc: "Ghi nhận 28 giờ làm thêm trong tháng gần nhất do phụ trách cụm vi dịch vụ Core Banking.",
      source: "Dữ liệu Chấm công và Điểm danh cổng"
    },
    {
      title: "Thời gian giữ nguyên cấp bậc: 22 tháng",
      badge: "Chưa thăng hạng",
      badgeColor: "amber",
      desc: "Đạt thành tích Xuất sắc liên tục nhưng chưa có quyết định bổ nhiệm lên vị trí Technical Architect.",
      source: "Lịch sử đánh giá nhân sự"
    }
  ]
};

export const mockFlightRiskPerson = mockFlightRisk;

export const mockNineBox = [
  {
    title: "Ngôi sao xuất sắc",
    count: 18,
    desc: "Lãnh đạo tương lai và chuyên gia nòng cốt",
    tag: "Quy hoạch kế cận",
    color: "bg-emerald-50/80 border-emerald-200"
  },
  {
    title: "Tiềm năng phát triển",
    count: 32,
    desc: "Sẵn sàng nhận trách nhiệm lớn hơn",
    tag: "Đào tạo quản lý",
    color: "bg-blue-50/80 border-blue-200"
  },
  {
    title: "Ngôi sao đang lên",
    count: 24,
    desc: "Nhân tố bứt phá cần trao quyền",
    tag: "Cố vấn chuyên môn",
    color: "bg-indigo-50/80 border-indigo-200"
  },
  {
    title: "Nhân lực cốt lõi",
    count: 68,
    desc: "Đóng góp vượt trội và ổn định",
    tag: "Khen thưởng đặc biệt",
    color: "bg-emerald-50/50 border-emerald-200"
  },
  {
    title: "Nhân lực ổn định",
    count: 85,
    desc: "Hoàn thành tốt nhiệm vụ được giao",
    tag: "Duy trì động lực",
    color: "bg-slate-50 border-slate-200"
  },
  {
    title: "Cần hỗ trợ nghiệp vụ",
    count: 42,
    desc: "Cần cải thiện năng lực thực thi",
    tag: "Huấn luyện kèm cặp",
    color: "bg-amber-50/80 border-amber-200"
  },
  {
    title: "Chuyên gia chuyên môn",
    count: 35,
    desc: "Chuyên môn sâu và giàu kinh nghiệm",
    tag: "Đãi ngộ chuyên gia",
    color: "bg-cyan-50/80 border-cyan-200"
  },
  {
    title: "Nhân sự thực thi",
    count: 30,
    desc: "Vận hành quy trình chuẩn xác",
    tag: "Định kỳ đánh giá",
    color: "bg-slate-50 border-slate-200"
  },
  {
    title: "Cần kế hoạch cải thiện",
    count: 14,
    desc: "Chưa đạt chỉ tiêu chất lượng",
    tag: "Kế hoạch cải thiện PIP",
    color: "bg-rose-50/80 border-rose-200"
  }
];

export const mockNineBoxStats = {
  superstars: 18,
  risingStars: 42,
  highPotentials: 25,
  solidPerformers: 45,
  coreEmployees: 29,
  actionRequired: 14,
};

export const mockPipPlan = {
  id: "NV-1003",
  employeeId: "NV-1003",
  name: "Vũ Mai Chi",
  employeeName: "Vũ Mai Chi",
  role: "Senior Designer",
  department: "Phòng Marketing và Truyền thông",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  currentKpi: 72.4,
  deadlineRate: 68,
  mentor: "Lê Minh Tuấn (UI/UX Lead)",
  supervisor: "Trần Mai Hương (HRD)",
  rootCauses: [
    "Áp lực phân bổ tải công việc dồn ứ: Khối lượng công việc thiết kế banner sự kiện dồn dập dẫn đến quá tải thời điểm giữa tháng.",
    "Giao tiếp phối hợp liên phòng ban: Kỹ năng phối hợp với đội Kỹ thuật phần mềm chưa đạt hiệu quả cao."
  ]
};

export const mockPipPerson = mockPipPlan;
