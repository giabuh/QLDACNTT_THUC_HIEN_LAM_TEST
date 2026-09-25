import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';
import dashboardService from '../services/dashboardService';
import { 
  Users, 
  CheckCircle2, 
  CalendarDays, 
  Wallet, 
  TrendingUp, 
  AlertTriangle, 
  Download, 
  UserPlus, 
  ArrowRight, 
  Check, 
  Sparkles,
  Camera,
  Activity,
  Clock,
  UserSquare2,
  Crown,
  Briefcase,
  ShieldCheck,
  Building,
  Target,
  FileSpreadsheet,
  Award,
  Layers,
  CheckCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Page2_Dashboard() {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { currentRole } = useAuth();
  const [chartTab, setChartTab] = useState('6m');
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchStats() {
      try {
        const res = await dashboardService.getStats();
        if (res && res.success && res.data && isMounted) {
          setStats(res.data);
        }
      } catch (e) {
        console.warn('Dashboard stats fallback to local mock:', e);
      }
    }
    fetchStats();
    return () => { isMounted = false; };
  }, [currentRole.key]);

  const handleApproveLeave = (name) => {
    setApprovedLeaves((prev) => [...prev, name]);
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch (e) {}
  };

  const isStaff = currentRole.key === 'EMPLOYEE';
  const isManager = currentRole.key === 'LINE_MANAGER';
  const isHr = currentRole.key === 'HR_DIRECTOR';
  const isCeo = currentRole.key === 'CEO';

  // ==========================================
  // VIEW A: CẤP 1 - TỔNG GIÁM ĐỐC (EXECUTIVE COCKPIT CHIẾN LƯỢC)
  // ==========================================
  if (isCeo) {
    return (
      <div className="w-full min-h-full p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
                Tổng Quan Điều Hành Doanh Nghiệp
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Chỉ số vĩ mô: Chi phí nhân sự, hiệu suất bình quân đầu người, cơ cấu tổ chức và an ninh nguồn nhân lực
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => openModal('modal2B')}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Báo cáo Chiến lược PDF</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/payroll')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Crown className="w-4 h-4" />
              <span>Phê duyệt quỹ lương tháng</span>
            </button>
          </div>
        </div>

        {/* 4 Macro Strategic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Quy mô nhân sự toàn công ty</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold font-display text-slate-900">348</div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  +3.5% hàng tháng
                </span>
                <span className="text-slate-400">12 tuyển mới, 2 thôi việc</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Tổng ngân sách lương và phúc lợi</span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold font-display text-purple-600">4.28 <span className="text-sm font-sans text-slate-500">tỷ VNĐ</span></div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  98.4% ngân sách
                </span>
                <span className="text-slate-400">Kiểm soát chi phí tốt</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Năng suất bình quân đầu người</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold font-display text-emerald-600">185 <span className="text-sm font-sans text-slate-500">triệu/người</span></div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  +8.2% so với cùng kỳ
                </span>
                <span className="text-slate-400">Doanh thu trên mỗi nhân sự</span>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Chỉ số giữ chân nhân tài</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold font-display text-slate-900">96.2%</div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  3 trường hợp cần lưu ý
                </span>
                <span className="text-slate-400">Cần chính sách đãi ngộ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Phân bổ nhân sự và Hiệu quả chi phí (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base font-display">
                  Cơ Cấu Chi Phí Nhân Sự và Doanh Thu Tích Lũy (6 Tháng)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tỷ lệ chi phí nhân sự trên tổng doanh thu duy trì ở mức tối ưu 28.5%
                </p>
              </div>
              <span className="text-xs px-3 py-1 bg-slate-100 rounded-lg font-semibold text-slate-600">
                Đơn vị: Tỷ VNĐ
              </span>
            </div>

            {/* Visual Bar chart comparing Revenue vs Payroll */}
            <div className="space-y-4 pt-2">
              {[
                { month: 'Tháng 04/2026', rev: 14.2, pay: 3.9, ratio: '27.4%' },
                { month: 'Tháng 05/2026', rev: 14.8, pay: 4.0, ratio: '27.0%' },
                { month: 'Tháng 06/2026', rev: 15.5, pay: 4.1, ratio: '26.4%' },
                { month: 'Tháng 07/2026', rev: 15.1, pay: 4.1, ratio: '27.1%' },
                { month: 'Tháng 08/2026', rev: 16.2, pay: 4.2, ratio: '25.9%' },
                { month: 'Tháng 09/2026 (Hiện tại)', rev: 16.8, pay: 4.28, ratio: '25.4%' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-800">{item.month}</span>
                    <span className="text-slate-600">
                      Doanh thu: <strong className="text-blue-600">{item.rev} tỷ</strong> | Quỹ lương: <strong className="text-purple-600">{item.pay} tỷ</strong> ({item.ratio})
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div style={{ width: `${(item.pay / item.rev) * 100}%` }} className="bg-purple-600 h-full rounded-full" />
                    <div style={{ width: `${100 - (item.pay / item.rev) * 100}%` }} className="bg-blue-200 h-full" />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <strong>Nhận định điều hành:</strong> Hiệu suất tài chính vượt 4.2% so với mục tiêu quý III/2026.
              </span>
              <button 
                onClick={() => navigate('/ai-analytics')}
                className="font-bold text-blue-700 hover:underline cursor-pointer"
              >
                Xem phân tích hiệu suất →
              </button>
            </div>
          </div>

          {/* Right: Phân bổ khối và Quyết sách (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Phân bổ nhân sự các khối */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" /> Phân Bổ Nhân Lực Các Khối
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-700">Khối Sản Phẩm và Công Nghệ</span>
                    <strong className="text-slate-900">142 người (40.8%)</strong>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[41%] h-full bg-blue-600 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-700">Khối Kinh Doanh và Tiếp Thị</span>
                    <strong className="text-slate-900">86 người (24.7%)</strong>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[25%] h-full bg-emerald-600 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-700">Khối Vận Hành (Nhân sự và Kế toán)</span>
                    <strong className="text-slate-900">30 người (8.6%)</strong>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[9%] h-full bg-amber-600 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-700">Khối Nghiên Cứu và Phát Triển (R&D)</span>
                    <strong className="text-slate-900">90 người (25.9%)</strong>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[26%] h-full bg-purple-600 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quyết sách cần phê duyệt - Clean Light Theme */}
            <div className="bg-blue-50/70 border border-blue-200 text-slate-800 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-sm text-slate-900">Nhiệm Vụ Điều Hành Trọng Tâm</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kỳ lương Tháng 09/2026 đã sẵn sàng phê duyệt. Cần đối soát 3 trường hợp bất thường trước khi ủy nhiệm chi qua ngân hàng.
              </p>
              <button
                onClick={() => navigate('/payroll')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition cursor-pointer shadow-2xs"
              >
                Xem chi tiết bảng lương 3.84 tỷ VNĐ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW B: CẤP 2B - TRƯỞNG PHÒNG (TEAM DELIVERY COCKPIT)
  // ==========================================
  if (isManager) {
    return (
      <div className="w-full min-h-full p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
                Tổng Quan Vận Hành Phòng Kỹ Thuật
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Theo dõi nhịp độ làm việc, tiến độ dự án, giờ làm thêm và tình trạng nhân sự của 20 kỹ sư phần mềm
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/leaves')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Duyệt nghỉ phép bộ phận (2 đơn)</span>
            </button>
          </div>
        </div>

        {/* 4 Team Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Nhân sự phòng ban</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold font-display text-slate-900">20 <span className="text-xs font-sans text-slate-500">kỹ sư</span></div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">18 chính thức</span>
                <span className="text-slate-400">2 thử việc</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Hiện diện hôm nay</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold font-display text-emerald-600">18 / 20</div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">90% có mặt</span>
                <span className="text-slate-400">2 nghỉ phép năm</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Tiến độ đợt phát hành</span>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold font-display text-indigo-600">84%</div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">4 Đội dự án</span>
                <span className="text-slate-400">12 nhiệm vụ hoàn tất</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Tổng giờ làm thêm</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold font-display text-amber-600">42.5 <span className="text-xs font-sans text-slate-500">giờ</span></div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Trung bình 2.1 giờ/người</span>
                <span className="text-slate-400">Trong định mức</span>
              </div>
            </div>
          </div>
        </div>

        {/* Manager 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Squad Status và Team Workload */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" /> Tình Trạng Phân Bổ Nhân Lực 4 Đội Dự Án
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900">Đội Dự Án Alpha (Hệ thống cốt lõi)</span>
                  <span className="text-emerald-600">6 Kỹ sư</span>
                </div>
                <p className="text-slate-500">Phụ trách: Phạm Minh Quân • Phân hệ: Chấm công và Bảng lương</p>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-[90%] h-full bg-emerald-500" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900">Đội Dự Án Beta (Ứng dụng di động)</span>
                  <span className="text-blue-600">5 Kỹ sư</span>
                </div>
                <p className="text-slate-500">Phụ trách: Hoàng Quốc Bảo • Nền tảng: iOS và Android</p>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-[75%] h-full bg-blue-500" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900">Đội Dự Án Gamma (Xử lý ảnh và nhận diện)</span>
                  <span className="text-purple-600">5 Kỹ sư</span>
                </div>
                <p className="text-slate-500">Phụ trách: Vũ Mai Chi • Phân hệ: Nhận diện cổng chính</p>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-[95%] h-full bg-purple-500" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900">Đội Vận Hành và An Ninh Hệ Thống</span>
                  <span className="text-amber-600">4 Kỹ sư</span>
                </div>
                <p className="text-slate-500">Phụ trách: Trần Đình Trọng • Hạ tầng máy chủ và bảo mật</p>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-amber-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Pending Leave Requests for Manager */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Đơn Cần Bạn Duyệt</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                2 đơn
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2">
                  <Avatar name="Phạm Minh Quân" id="NV-0842" size="sm" shape="circle" />
                  <div>
                    <div className="font-bold text-slate-900">Phạm Minh Quân</div>
                    <div className="text-[11px] text-slate-400">Nghỉ 1 ngày (25/09) • Việc riêng</div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/leaves')}
                  className="w-full py-1.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition cursor-pointer"
                >
                  Xem và Duyệt đơn
                </button>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2">
                  <Avatar name="Lê Hoàng Nam" id="NV-0845" size="sm" shape="circle" />
                  <div>
                    <div className="font-bold text-slate-900">Lê Hoàng Nam</div>
                    <div className="text-[11px] text-slate-400">Nghỉ 3 ngày (02/10) • Kết hôn</div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/leaves')}
                  className="w-full py-1.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition cursor-pointer"
                >
                  Xem và Duyệt đơn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW C: CẤP 2A - GIÁM ĐỐC NHÂN SỰ (HR OPERATIONS & COMPLIANCE)
  // ==========================================
  return (
    <div className="w-full min-h-full p-6 space-y-6">
      {/* Friendly banner for Employee on Dashboard */}
      {isStaff && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-4 border border-blue-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <UserSquare2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Bạn đang truy cập dưới góc nhìn Nhân viên
              </h4>
              <p className="text-[11px] text-slate-600">
                Khu vực tự chấm công, xem phiếu lương và nộp đơn nghỉ phép được tối ưu hóa tại Bàn làm việc của tôi.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/portal')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            <span>Đi đến Bàn làm việc (/portal)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
              Tổng Quan Quản Trị Khối Nhân Sự
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Trực tiếp
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md border bg-blue-50 text-blue-800 border-blue-200">
              Quản trị tiền lương và chế độ
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Dữ liệu đồng bộ thời gian thực từ camera nhận diện cổng chính, giám sát chuyên cần và tuân thủ chính sách lao động
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => openModal('modal2B')}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Xuất báo cáo PDF</span>
          </button>

          <button
            type="button"
            onClick={() => openModal('modal4A')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tiếp nhận nhân sự mới</span>
          </button>
        </div>
      </div>

      {/* Row 1: 4 Key Metric Cards for HR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Tổng số nhân sự */}
        <motion.div 
          whileHover={{ y: -2 }}
          onClick={() => navigate('/directory')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Tổng số nhân sự</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-display text-[30px] font-bold text-slate-900 leading-none">348</div>
            <div className="flex items-center gap-2 mt-3 flex-wrap text-xs">
              <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                +12 tháng này
              </span>
              <span className="text-slate-400">so với tháng trước</span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Có mặt hôm nay */}
        <motion.div 
          whileHover={{ y: -2 }}
          onClick={() => openModal('modal2A')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-4 cursor-pointer group hover:border-amber-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Có mặt hôm nay</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-display text-[30px] font-bold text-slate-900 leading-none">
              328<span className="text-slate-400 text-lg font-medium font-sans">/348</span>
            </div>
            <div className="flex items-center gap-2 mt-3 flex-wrap text-xs">
              <span className="text-blue-700 font-semibold bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                94.2% tỷ lệ đi làm
              </span>
              <span className="text-amber-600 font-semibold underline decoration-dotted">
                14 trễ • 6 vắng (Xem)
              </span>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Đơn nghỉ phép chờ duyệt */}
        <motion.div 
          whileHover={{ y: -2 }}
          onClick={() => navigate('/leaves')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-4 cursor-pointer group hover:border-amber-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Hồ sơ viện phí C65 và phúc lợi chờ duyệt</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-display text-[30px] font-bold text-slate-900 leading-none">
              1 <span className="text-sm font-semibold text-slate-400 font-sans">hồ sơ</span>
            </div>
            <div className="flex items-center gap-2 mt-3 flex-wrap text-xs">
              <span className="text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                Chế độ BHXH
              </span>
              <span className="text-slate-500">Giấy ra viện và chứng từ</span>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Quỹ lương dự toán T9 */}
        <motion.div 
          whileHover={{ y: -2 }}
          onClick={() => navigate('/payroll')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-4 cursor-pointer group hover:border-indigo-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Bảng lương và trích nộp bảo hiểm xã hội</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-display text-[30px] font-bold text-slate-900 leading-none">
              3.84 <span className="text-sm font-semibold text-slate-500 font-sans">tỷ VNĐ</span>
            </div>
            <div className="flex items-center gap-2 mt-3 flex-wrap text-xs">
              <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                Đã khóa dự thảo
              </span>
              <span className="text-slate-400">412 triệu nộp BHXH</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Row 2: 60% / 40% Two-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column (xl:col-span-7) */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          {/* Chart: Biến động nhân sự và Chuyên cần */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-base font-bold text-slate-900 tracking-tight">
                  Biến động nhân sự và tỷ lệ chuyên cần (6 tháng)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Theo dõi tỷ lệ chuyên cần cổng chính và số lượng tuyển mới qua các tháng
                </p>
              </div>

              {/* Time Tabs */}
              <div className="inline-flex p-1 bg-slate-100 rounded-xl shrink-0">
                <button
                  type="button"
                  onClick={() => setChartTab('6m')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    chartTab === '6m' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  6 tháng
                </button>
                <button
                  type="button"
                  onClick={() => setChartTab('1y')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    chartTab === '1y' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  1 năm
                </button>
              </div>
            </div>

            {/* High-Resolution SVG Analytics Composite */}
            <div className="relative w-full overflow-hidden pt-2">
              <svg className="w-full h-72 overflow-visible" fill="none" viewBox="0 0 680 270" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="primaryBarGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                  <linearGradient id="newHiresGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#93C5FD" />
                    <stop offset="100%" stopColor="#BFDBFE" />
                  </linearGradient>
                  <filter id="pointShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.12" />
                  </filter>
                </defs>

                <line x1="45" y1="215" x2="635" y2="215" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="45" y1="165" x2="635" y2="165" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="45" y1="115" x2="635" y2="115" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="45" y1="65" x2="635" y2="65" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />

                <text x="35" y="219" fill="#94A3B8" fontSize="10" fontFamily="Inter" textAnchor="end">0</text>
                <text x="35" y="169" fill="#94A3B8" fontSize="10" fontFamily="Inter" textAnchor="end">100</text>
                <text x="35" y="119" fill="#94A3B8" fontSize="10" fontFamily="Inter" textAnchor="end">200</text>
                <text x="35" y="69" fill="#94A3B8" fontSize="10" fontFamily="Inter" textAnchor="end">350</text>

                <text x="645" y="219" fill="#94A3B8" fontSize="10" fontFamily="Inter" textAnchor="start">88%</text>
                <text x="645" y="169" fill="#94A3B8" fontSize="10" fontFamily="Inter" textAnchor="start">90%</text>
                <text x="645" y="119" fill="#94A3B8" fontSize="10" fontFamily="Inter" textAnchor="start">93%</text>
                <text x="645" y="69" fill="#94A3B8" fontSize="10" fontFamily="Inter" textAnchor="start">96%</text>

                {[
                  { month: 'Tháng 4', h1: 110, y1: 105, h2: 28, y2: 187, x1: 75, x2: 101, xm: 96, pct: '92.4%', py: 130, by: 145 },
                  { month: 'Tháng 5', h1: 119, y1: 96, h2: 34, y2: 181, x1: 168, x2: 194, xm: 189, pct: '93.1%', py: 112, by: 86 },
                  { month: 'Tháng 6', h1: 125, y1: 90, h2: 30, y2: 185, x1: 261, x2: 287, xm: 282, pct: '91.8%', py: 136, by: 150 },
                  { month: 'Tháng 7', h1: 133, y1: 82, h2: 38, y2: 177, x1: 354, x2: 380, xm: 375, pct: '94.5%', py: 74, by: 47 },
                  { month: 'Tháng 8', h1: 141, y1: 74, h2: 36, y2: 179, x1: 447, x2: 473, xm: 468, pct: '93.8%', py: 90, by: 63 },
                  { month: 'Tháng 9', h1: 149, y1: 66, h2: 42, y2: 173, x1: 540, x2: 566, xm: 561, pct: '94.2%', py: 76, by: 49 },
                ].map((item) => (
                  <g key={item.month} className="transition-transform duration-200 hover:opacity-90">
                    <rect x={item.x1} y={item.y1} width="22" height={item.h1} rx="4" fill="url(#primaryBarGrad)" />
                    <rect x={item.x2} y={item.y2} width="12" height={item.h2} rx="3" fill="url(#newHiresGrad)" />
                    <text x={item.xm} y="235" fill="#64748B" fontSize="12" fontWeight="600" fontFamily="Inter" textAnchor="middle">
                      {item.month}
                    </text>
                  </g>
                ))}

                <path
                  d="M 96 130 C 140 120, 150 115, 189 112 C 235 109, 245 138, 282 136 C 325 133, 340 76, 375 74 C 420 72, 435 94, 468 90 C 510 86, 530 78, 561 76"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {[
                  { xm: 96, py: 130, by: 145, pct: '92.4%' },
                  { xm: 189, py: 112, by: 86, pct: '93.1%' },
                  { xm: 282, py: 136, by: 150, pct: '91.8%' },
                  { xm: 375, py: 74, by: 47, pct: '94.5%' },
                  { xm: 468, py: 90, by: 63, pct: '93.8%' },
                  { xm: 561, py: 76, by: 49, pct: '94.2%' },
                ].map((p, idx) => (
                  <g key={idx} filter="url(#pointShadow)">
                    <rect x={p.xm - 21} y={p.by} width="42" height="18" rx="4" fill="#0F172A" />
                    <text x={p.xm} y={p.by + 13} fill="#FFFFFF" fontSize="10" fontWeight="600" fontFamily="Inter" textAnchor="middle">
                      {p.pct}
                    </text>
                    <circle cx={p.xm} cy={p.py} r="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Live logs from gate (xl:col-span-5) */}
        <div className="xl:col-span-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-display text-base font-bold text-slate-900 tracking-tight">
                  Nhật ký chấm công trực tiếp
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cập nhật thời gian thực từ camera nhận diện cổng chính
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                TRỰC TIẾP
              </span>
            </div>

            {/* Live Log Items */}
            <div className="divide-y divide-slate-100 my-1 text-xs">
              <div 
                onClick={() => openModal('modal5C', { name: 'Nguyễn Văn Tuấn' })}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 rounded-xl px-2 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Avatar name="Nguyễn Văn Tuấn" id="NV-1007" size="md" shape="circle" />
                  <div>
                    <span className="font-bold text-slate-900 block">Nguyễn Văn Tuấn</span>
                    <span className="text-slate-400">Phòng Kỹ thuật • Cổng A1 • 08:01</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Đúng giờ
                </span>
              </div>

              <div 
                onClick={() => openModal('modal5C', { name: 'Trần Bích Thảo' })}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 rounded-xl px-2 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Avatar name="Trần Bích Thảo" id="NV-1008" size="md" shape="circle" />
                  <div>
                    <span className="font-bold text-slate-900 block">Trần Bích Thảo</span>
                    <span className="text-slate-400">Phòng Tiếp thị • Cổng A2 • 08:14</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Trễ 14 phút
                </span>
              </div>

              <div 
                onClick={() => openModal('modal5C', { name: 'Lê Hoàng Nam' })}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 rounded-xl px-2 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Avatar name="Lê Hoàng Nam" id="NV-1042" size="md" shape="circle" />
                  <div>
                    <span className="font-bold text-slate-900 block">Lê Hoàng Nam</span>
                    <span className="text-slate-400">Phòng Kế toán • Cổng A1 • 08:00</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Đúng giờ
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-center">
              <button
                type="button"
                onClick={() => openModal('modal2C')}
                className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Xem tất cả 328 lượt ghi nhận hôm nay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
