import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';
import { mockFlightRisk, mockNineBox, mockPipPlan } from '../data/mockAiAnalytics';
import { 
  Sparkles, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Award, 
  ShieldAlert, 
  Bot, 
  Users, 
  Lock,
  UserSquare2,
  Crown,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldCheck,
  Target
} from 'lucide-react';

export default function Page8_AiAnalytics() {
  const { openModal } = useModal();
  const { currentRole } = useAuth();
  const navigate = useNavigate();

  const isStaff = currentRole.key === 'EMPLOYEE';
  const isManager = currentRole.key === 'LINE_MANAGER';
  const isHr = currentRole.key === 'HR_DIRECTOR';
  const isCeo = currentRole.key === 'CEO';

  const [matrixView, setMatrixView] = useState(isManager ? 'dept' : 'company');

  // ==========================================
  // CẤP 3 (NHÂN VIÊN - ESS): BẢO MẬT DỮ LIỆU ĐÁNH GIÁ 9-BOX NỘI BỘ
  // ==========================================
  if (isStaff) {
    return (
      <div className="w-full min-h-full p-6 space-y-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-lg text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto border border-purple-200 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full border border-purple-200 inline-block">
              Giới hạn quyền truy cập
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Khu Vực Phân Tích Hiệu Suất Quản Lý
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dữ liệu ma trận 9-Box đánh giá tiềm năng và Dự báo nguy cơ thôi việc là thông tin mật cấp quản lý, chỉ dành cho <strong>Ban Giám Đốc</strong> và <strong>Cấp Quản lý</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 text-left flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <span>Để xem đánh giá KPI và kết quả công việc cá nhân của bạn, vui lòng truy cập Bàn làm việc của tôi.</span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/portal')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <UserSquare2 className="w-4 h-4" />
            <span>Đi đến Bàn làm việc của tôi (/portal)</span>
          </button>
        </div>
      </div>
    );
  }

  // Determine Titles per role
  const pageTitle = isCeo 
    ? 'Trung Tâm Dự Báo Nhân Lực và Rủi Ro Biến Động'
    : isHr
    ? 'Phân Tích Năng Lực và Kế Hoạch Cải Thiện'
    : 'Đánh Giá Hiệu Suất Phòng Kỹ Thuật';

  const pageSubtitle = isCeo
    ? 'Dự báo rủi ro biến động nhân sự, tỷ lệ kế thừa lãnh đạo và tối ưu năng suất toàn công ty'
    : isHr
    ? 'Giám sát ma trận đánh giá năng lực, thiết lập lộ trình cải thiện 30 ngày và tối ưu chính sách'
    : 'Phân tích năng lực 20 kỹ sư thuộc Phòng Kỹ thuật Phần mềm, đề xuất khen thưởng và phân công dự án';

  return (
    <div className="w-full min-h-full p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
              {pageTitle}
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                Phân tích dữ liệu chuyên sâu
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{pageSubtitle}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => openModal('modal8B')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Trợ lý tư vấn nhân sự</span>
          </button>

          {(isCeo || isHr) && (
            <button
              type="button"
              onClick={() => openModal('modal8A')}
              className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold px-4 py-2 rounded-xl shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Cảnh báo nguy cơ biến động 84%</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Metric Cards Tailored Per Level */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500">
                {isManager ? 'Điểm KPI TB Bộ Phận' : 'Điểm KPI trung bình toàn viện'}
              </span>
              <div className="text-2xl font-bold font-display text-blue-600 mt-1">
                {isManager ? '88.5 / 100' : '87.4 / 100'}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{isManager ? '20 Kỹ sư phần mềm' : 'Toàn bộ 348 nhân sự'}</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {isManager ? '+3.4% vs Sprint 23' : '+2.8% vs Q2'}
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500">
                {isManager ? 'Top Performers (Stars)' : 'Nhân sự xuất sắc (Top Talent)'}
              </span>
              <div className="text-2xl font-bold font-display text-emerald-600 mt-1">
                {isManager ? '5 kỹ sư' : '48 nhân viên'}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Đủ điều kiện thưởng / thăng bậc</span>
            <span className="text-emerald-700 font-bold">{isManager ? '25.0%' : '13.8%'}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500">
                {isManager ? 'Kỹ sư cần hỗ trợ mentor' : 'Cần cải thiện (At-Risk PIP)'}
              </span>
              <div className="text-2xl font-bold font-display text-amber-600 mt-1">
                {isManager ? '1 kỹ sư' : '14 nhân viên'}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{isManager ? 'Nhân sự mới thử việc' : 'Hiệu suất giảm liên tục'}</span>
            <button
              onClick={() => openModal('modal8C')}
              className="text-amber-700 font-bold hover:underline cursor-pointer"
            >
              Lập PIP 30 ngày →
            </button>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500">
                {isCeo ? 'Dự báo nguy cơ biến động' : 'Cảnh báo biến động nhân sự'}
              </span>
              <div className="text-2xl font-bold font-display text-rose-600 mt-1">
                {isManager ? '0 rủi ro' : '3 trường hợp'}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{isManager ? 'Đội ngũ ổn định 100%' : 'Nguy cơ thôi việc > 80%'}</span>
            {!isManager && (
              <button
                onClick={() => openModal('modal8A')}
                className="text-rose-600 font-bold hover:underline cursor-pointer"
              >
                Xem chi tiết →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Two-Column Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 9-Box Matrix (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="font-display text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Ma trận Phân loại Năng lực Nhân sự (9-Box Talent Matrix)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Phân tích giao thoa giữa Hiệu suất thực tế (Performance) và Tiềm năng phát triển (Potential)
                </p>
              </div>

              {/* View switch */}
              <div className="inline-flex p-1 bg-slate-100 rounded-xl shrink-0 text-xs">
                {(isCeo || isHr) && (
                  <button
                    onClick={() => setMatrixView('company')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      matrixView === 'company' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Toàn công ty (348)
                  </button>
                )}
                <button
                  onClick={() => setMatrixView('dept')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    matrixView === 'dept' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Phòng Phần mềm (20)
                </button>
              </div>
            </div>

            {/* 9-Box Grid Container */}
            <div className="grid grid-cols-3 gap-3">
              {mockNineBox.map((box, idx) => (
                <div 
                  key={idx}
                  onClick={() => openModal('modal8D', box)}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between min-h-[110px] transition-all hover:shadow-sm cursor-pointer group ${box.color}`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                        {box.title}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/80 border border-slate-200">
                        {matrixView === 'dept' ? Math.ceil(box.count / 18) : box.count}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {box.desc}
                    </p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-slate-600">
                    <span className="font-semibold">{box.tag}</span>
                    <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Chi tiết →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Actionable Recommendations (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Khuyến Nghị Đề Xuất Quản Trị
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 space-y-1.5">
                <span className="font-bold text-purple-900 block">Khen thưởng Top Talent:</span>
                <p className="text-purple-800 leading-relaxed">
                  Đề xuất tăng lương +15% hoặc bổ sung gói thưởng giữ chân cho 3 Senior Engineers thuộc top 5% hiệu suất liên tục 3 quý.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                <span className="font-bold text-amber-900 block">Kế hoạch Cải thiện PIP:</span>
                <p className="text-amber-800 leading-relaxed">
                  Lập cam kết mục tiêu 30 ngày cho nhân sự có hiệu suất giảm sút, cử Tech Lead kèm cặp 1-on-1 hàng tuần.
                </p>
                <button
                  onClick={() => openModal('modal8C')}
                  className="mt-1 text-amber-900 font-bold hover:underline block cursor-pointer"
                >
                  Xem quy trình PIP →
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1.5">
                <span className="font-bold text-blue-900 block">Dự báo Tuyển dụng Q4:</span>
                <p className="text-blue-800 leading-relaxed">
                  Khối Kỹ thuật dự kiến cần bổ sung thêm 8 nhân sự vị trí DevOps và Kỹ sư Trí tuệ nhân tạo để đáp ứng khối lượng dự án mới.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
