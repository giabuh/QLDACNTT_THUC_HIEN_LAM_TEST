import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';
import { 
  Clock, 
  Calendar, 
  FileText, 
  Sparkles, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Download, 
  Bell, 
  BookOpen, 
  CalendarPlus,
  ArrowRight,
  Briefcase,
  CalendarCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Page3_EmployeePortal() {
  const { openModal } = useModal();
  const { currentRole } = useAuth();
  const navigate = useNavigate();
  const [showSalary, setShowSalary] = useState(true);
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [clockInTime, setClockInTime] = useState('08:02:14 AM');

  const empName = currentRole?.name || 'Phạm Minh Quân';
  const empId = currentRole?.id || 'NV-0842';
  const empTitle = currentRole?.title || 'Kỹ sư Phần mềm';
  const empDepartment = currentRole?.department || 'Phòng Kỹ thuật Phần mềm';
  const empAvatar = currentRole?.avatar || null;

  // Tailored personal salary per role
  const getSalaryData = () => {
    switch (currentRole.key) {
      case 'CEO':
        return {
          net: '94,500,000 VNĐ',
          base: '+110,000,000 đ',
          bonus: '+20,000,000 đ (Thưởng Điều hành)',
          allowance: '+5,000,000 đ',
          insurance: '-3,990,000 đ',
          tax: '-36,510,000 đ',
          bank: 'Vietcombank Priority (05/09/2026)'
        };
      case 'HR_DIRECTOR':
        return {
          net: '48,200,000 VNĐ',
          base: '+50,000,000 đ',
          bonus: '+8,000,000 đ (KPI Tuyển dụng)',
          allowance: '+2,500,000 đ',
          insurance: '-3,990,000 đ',
          tax: '-8,310,000 đ',
          bank: 'Techcombank (05/09/2026)'
        };
      case 'LINE_MANAGER':
        return {
          net: '41,310,000 VNĐ',
          base: '+38,000,000 đ',
          bonus: '+4,000,000 đ (Thưởng Sprint 24)',
          allowance: '+5,200,000 đ (OT Kỹ thuật)',
          insurance: '-3,990,000 đ',
          tax: '-1,900,000 đ',
          bank: 'Vietcombank (05/09/2026)'
        };
      case 'EMPLOYEE':
      default:
        return {
          net: '28,450,000 VNĐ',
          base: '+25,000,000 đ',
          bonus: '+5,000,000 đ (Thưởng KPI SE)',
          allowance: '+1,200,000 đ',
          insurance: '-1,550,000 đ',
          tax: '-1,200,000 đ',
          bank: 'Techcombank (05/09/2026)'
        };
    }
  };

  const salaryData = getSalaryData();

  const handleClockToggle = () => {
    if (!isClockedIn) {
      const now = new Date();
      setClockInTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsClockedIn(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    } else {
      setIsClockedIn(false);
    }
  };

  return (
    <div className="w-full min-h-full p-6 space-y-6">
      {/* Employee Greeting & Fast Clock-In Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar
            src={empAvatar}
            name={empName}
            id={empId}
            size="xl"
            shape="rounded"
            statusBadge="online"
          />

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900 font-display">
                Xin chào, {empName}
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono text-xs font-bold border border-blue-200">
                {empId}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {empTitle} • {empDepartment}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Đã chấm công vào ca lúc {clockInTime} • Cổng A1</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Fast Action Shortcuts (Căn bên trái thẳng hàng với khung Số dư phép năm) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: OT Register */}
        <div 
          onClick={() => openModal('modal3A')}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex items-center gap-3.5"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[13px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Đăng ký làm thêm (OT)
            </h3>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">Tạo phiếu tăng ca ngoài giờ</p>
          </div>
        </div>

        {/* Card 2: Handbook & Policies */}
        <div 
          onClick={() => openModal('modal3D')}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex items-center gap-3.5"
        >
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[13px] font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              Quy chế và Đãi ngộ
            </h3>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">Cẩm nang phúc lợi nhân sự</p>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: Leave Balance & Attendance Calendar */}
        <div className="flex flex-col gap-6">
          {/* Card 1: Leave Balance */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-[16px] font-bold text-slate-900 tracking-tight">
                  Số dư ngày phép năm 2026
                </h2>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Chu kỳ tích lũy 01/01/2026 - 31/12/2026
                </p>
              </div>
              <button
                type="button"
                onClick={() => openModal('modal6D')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <span>+ Xin nghỉ phép</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
              {/* Doughnut ring */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-600 transition-all duration-1000 ease-out"
                    strokeDasharray="66.7, 100"
                    strokeLinecap="round"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-slate-900 leading-none">8</span>
                  <span className="text-[10px] font-semibold text-slate-400 mt-0.5">ngày còn</span>
                </div>
              </div>

              {/* Stats 3 columns */}
              <div className="grid grid-cols-3 gap-3 w-full text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-500 font-medium block">Tổng cộng</span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">12 ngày</span>
                  <span className="text-[10px] text-slate-400">Hạn 31/12</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200">
                  <span className="text-[11px] text-slate-500 font-medium block">Đã sử dụng</span>
                  <span className="text-sm font-bold text-amber-600 mt-0.5 block">4 ngày</span>
                  <span className="text-[10px] text-amber-600">33.3%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-200">
                  <span className="text-[11px] text-blue-600 font-bold block">Khả dụng</span>
                  <span className="text-sm font-bold text-blue-700 mt-0.5 block">8 ngày</span>
                  <span className="text-[10px] text-blue-600 font-semibold">Sẵn sàng</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Working Calendar Month (Chuẩn lịch Tháng 9/2026 với màu sắc chuyên cần chi tiết) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-[16px] font-bold text-slate-900 tracking-tight">
                  Lịch làm việc và Chuyên cần Tháng 9/2026
                </h2>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Đồng bộ tự động từ hệ thống chấm công • Hôm nay: Thứ Hai, 14/09/2026
                </p>
              </div>
              <span className="text-xs font-bold text-slate-700 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg">
                T09 / 2026
              </span>
            </div>

            {/* Calendar Table */}
            <div className="w-full">
              {/* Header: HAI, BA, TƯ, NĂM, SÁU, BẢY, C.N */}
              <div className="grid grid-cols-7 text-center text-xs font-bold pb-2.5 border-b border-slate-100">
                <span className="text-slate-600">HAI</span>
                <span className="text-slate-600">BA</span>
                <span className="text-slate-600">TƯ</span>
                <span className="text-slate-600">NĂM</span>
                <span className="text-slate-600">SÁU</span>
                <span className="text-rose-500">BẢY</span>
                <span className="text-rose-500">C.N</span>
              </div>

              {/* 5-Week Grid */}
              <div className="grid grid-cols-7 gap-y-1.5 gap-x-1 pt-2 text-center">
                {/* TUẦN 1: 31/08 (tháng trước mờ) -> 06/09 */}
                <div className="py-1.5 px-1 rounded-xl opacity-40 text-slate-400">
                  <div className="text-sm font-normal">31</div>
                  <div className="text-[10px]">19</div>
                </div>
                {/* 01/09: Đã đi làm đầy đủ -> Màu xanh lá cây */}
                <div className="py-1.5 px-1 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                  <div className="text-sm font-bold text-emerald-900">1</div>
                  <div className="text-[10px] text-emerald-700 font-medium flex items-center justify-center gap-0.5">
                    <span>20/7</span>
                    <span className="w-1 h-1 rounded-full bg-emerald-600"></span>
                  </div>
                </div>
                {/* 02/09: Nghỉ lễ Nhà nước -> Màu đỏ/hồng nổi bật */}
                <div className="py-1.5 px-1 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors">
                  <div className="text-sm font-bold text-rose-900">2</div>
                  <div className="text-[10px] text-rose-700 font-bold">Lễ 2/9</div>
                </div>
                {/* 03/09: Đã đi làm đầy đủ -> Màu xanh lá cây */}
                <div className="py-1.5 px-1 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                  <div className="text-sm font-bold text-emerald-900">3</div>
                  <div className="text-[10px] text-emerald-700 font-medium flex items-center justify-center gap-0.5">
                    <span>22</span>
                    <span className="w-1 h-1 rounded-full bg-emerald-600"></span>
                  </div>
                </div>
                {/* 04/09: Đã đi làm đầy đủ -> Màu xanh lá cây */}
                <div className="py-1.5 px-1 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                  <div className="text-sm font-bold text-emerald-900">4</div>
                  <div className="text-[10px] text-emerald-700 font-medium flex items-center justify-center gap-0.5">
                    <span>23</span>
                    <span className="w-1 h-1 rounded-full bg-emerald-600"></span>
                  </div>
                </div>
                <div className="py-1.5 px-1 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-rose-50/40 transition-colors">
                  <div className="text-sm font-bold text-rose-500">5</div>
                  <div className="text-[10px] text-rose-400">24</div>
                </div>
                <div className="py-1.5 px-1 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-rose-50/40 transition-colors">
                  <div className="text-sm font-bold text-rose-500">6</div>
                  <div className="text-[10px] text-rose-400">25</div>
                </div>

                {/* TUẦN 2: 07/09 -> 13/09 */}
                {/* 07/09: Đã đi làm đầy đủ -> Màu xanh lá cây */}
                <div className="py-1.5 px-1 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                  <div className="text-sm font-bold text-emerald-900">7</div>
                  <div className="text-[10px] text-emerald-700 font-medium flex items-center justify-center gap-0.5">
                    <span>26</span>
                    <span className="w-1 h-1 rounded-full bg-emerald-600"></span>
                  </div>
                </div>
                {/* 08/09: Đã đi làm đầy đủ -> Màu xanh lá cây */}
                <div className="py-1.5 px-1 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                  <div className="text-sm font-bold text-emerald-900">8</div>
                  <div className="text-[10px] text-emerald-700 font-medium flex items-center justify-center gap-0.5">
                    <span>27</span>
                    <span className="w-1 h-1 rounded-full bg-emerald-600"></span>
                  </div>
                </div>
                {/* 09/09: Đã đi làm đầy đủ -> Màu xanh lá cây */}
                <div className="py-1.5 px-1 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                  <div className="text-sm font-bold text-emerald-900">9</div>
                  <div className="text-[10px] text-emerald-700 font-medium flex items-center justify-center gap-0.5">
                    <span>28</span>
                    <span className="w-1 h-1 rounded-full bg-emerald-600"></span>
                  </div>
                </div>
                {/* 10/09: Đã đi làm đầy đủ -> Màu xanh lá cây */}
                <div className="py-1.5 px-1 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                  <div className="text-sm font-bold text-emerald-900">10</div>
                  <div className="text-[10px] text-emerald-700 font-medium flex items-center justify-center gap-0.5">
                    <span>29</span>
                    <span className="w-1 h-1 rounded-full bg-emerald-600"></span>
                  </div>
                </div>
                {/* 11/09: Đã đi làm đầy đủ -> Màu xanh lá cây */}
                <div className="py-1.5 px-1 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                  <div className="text-sm font-bold text-emerald-900">11</div>
                  <div className="text-[10px] text-emerald-700 font-medium flex items-center justify-center gap-0.5">
                    <span>1/8</span>
                    <span className="w-1 h-1 rounded-full bg-emerald-600"></span>
                  </div>
                </div>
                <div className="py-1.5 px-1 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-rose-50/40 transition-colors">
                  <div className="text-sm font-bold text-rose-500">12</div>
                  <div className="text-[10px] text-rose-400">2</div>
                </div>
                <div className="py-1.5 px-1 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-rose-50/40 transition-colors">
                  <div className="text-sm font-bold text-rose-500">13</div>
                  <div className="text-[10px] text-rose-400">3</div>
                </div>

                {/* TUẦN 3: 14/09 (HÔM NAY - Đang trong giờ làm & đã chấm công -> Màu xanh nước biển viền rõ) -> 20/09 */}
                <div className="py-1.5 px-1 rounded-xl border-2 border-blue-600 bg-blue-100/80 shadow-xs relative">
                  <div className="text-sm font-black text-blue-950">14</div>
                  <div className="text-[10px] text-blue-700 font-bold flex items-center justify-center gap-1">
                    <span>4</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                  </div>
                </div>
                <div className="py-1.5 px-1 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="text-sm font-bold text-slate-700">15</div>
                  <div className="text-[10px] text-slate-400">5</div>
                </div>
                <div className="py-1.5 px-1 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="text-sm font-bold text-slate-700">16</div>
                  <div className="text-[10px] text-slate-400">6</div>
                </div>
                <div className="py-1.5 px-1 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="text-sm font-bold text-slate-700">17</div>
                  <div className="text-[10px] text-slate-400">7</div>
                </div>
                {/* 18/09: Nghỉ phép có đơn đã duyệt -> Màu vàng cam */}
                <div className="py-1.5 px-1 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors">
                  <div className="text-sm font-bold text-amber-900">18</div>
                  <div className="text-[10px] text-amber-700 font-bold">Phép</div>
                </div>
                <div className="py-1.5 px-1 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-rose-50/40 transition-colors">
                  <div className="text-sm font-bold text-rose-500">19</div>
                  <div className="text-[10px] text-rose-400">9</div>
                </div>
                <div className="py-1.5 px-1 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-rose-50/40 transition-colors">
                  <div className="text-sm font-bold text-rose-500">20</div>
                  <div className="text-[10px] text-rose-400">10</div>
                </div>

                {/* TUẦN 4: 21/09 -> 27/09 */}
                <div className="py-1.5 px-1 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="text-sm font-bold text-slate-700">21</div>
                  <div className="text-[10px] text-slate-400">11</div>
                </div>
                <div className="py-1.5 px-1 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="text-sm font-bold text-slate-700">22</div>
                  <div className="text-[10px] text-slate-400">12</div>
                </div>
                <div className="py-1.5 px-1 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="text-sm font-bold text-slate-700">23</div>
                  <div className="text-[10px] text-slate-400">13</div>
                </div>
                <div className="py-1.5 px-1 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="text-sm font-bold text-slate-700">24</div>
                  <div className="text-[10px] text-slate-400">14</div>
                </div>
                {/* 25/09: Nghỉ việc riêng có đơn đã nộp -> Màu vàng cam */}
                <div className="py-1.5 px-1 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors">
                  <div className="text-sm font-bold text-amber-900">25</div>
                  <div className="text-[10px] text-amber-700 font-bold">Phép</div>
                </div>
                <div className="py-1.5 px-1 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-rose-50/40 transition-colors">
                  <div className="text-sm font-bold text-rose-500">26</div>
                  <div className="text-[10px] text-rose-400">16</div>
                </div>
                <div className="py-1.5 px-1 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-rose-50/40 transition-colors">
                  <div className="text-sm font-bold text-rose-500">27</div>
                  <div className="text-[10px] text-rose-400">17</div>
                </div>

                {/* TUẦN 5: 28/09 -> 30/09 và 01/10 -> 04/10 */}
                <div className="py-1.5 px-1 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="text-sm font-bold text-slate-700">28</div>
                  <div className="text-[10px] text-slate-400">18</div>
                </div>
                <div className="py-1.5 px-1 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="text-sm font-bold text-slate-700">29</div>
                  <div className="text-[10px] text-slate-400">19</div>
                </div>
                <div className="py-1.5 px-1 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="text-sm font-bold text-slate-700">30</div>
                  <div className="text-[10px] text-slate-400">20</div>
                </div>
                <div className="py-1.5 px-1 rounded-xl opacity-40 text-slate-400">
                  <div className="text-sm font-normal">1</div>
                  <div className="text-[10px]">21/8</div>
                </div>
                <div className="py-1.5 px-1 rounded-xl opacity-40 text-slate-400">
                  <div className="text-sm font-normal">2</div>
                  <div className="text-[10px]">22</div>
                </div>
                <div className="py-1.5 px-1 rounded-xl opacity-40 text-rose-300">
                  <div className="text-sm font-normal">3</div>
                  <div className="text-[10px]">23</div>
                </div>
                <div className="py-1.5 px-1 rounded-xl opacity-40 text-rose-300">
                  <div className="text-sm font-normal">4</div>
                  <div className="text-[10px]">24</div>
                </div>
              </div>
            </div>

            {/* Chú thích màu sắc các ô lịch làm việc */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shrink-0" />
                <span>Đã làm đủ công</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block shrink-0 ring-2 ring-blue-200" />
                <span>Hôm nay (14/09)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shrink-0" />
                <span>Nghỉ phép đã duyệt</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shrink-0" />
                <span>Nghỉ lễ (2/9)</span>
              </div>
            </div>

            {/* Attendance Summary (Đã xóa 2 dấu chấm) */}
            <div className="mt-2.5 pt-2.5 border-t border-dashed border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span>Đã làm: <strong className="text-emerald-700 font-bold">9 ngày</strong></span>
              <span>Đúng giờ: <strong className="text-emerald-700 font-bold">9/9 (100%)</strong></span>
              <span>Giờ công: <strong className="text-slate-900 font-bold">72.5 giờ</strong></span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Daily Tasks & Company News (Bảo mật tuyệt đối, không để lộ tiền lương) */}
        <div className="flex flex-col gap-6">
          {/* Card 3: Kế hoạch & Trọng tâm công việc hôm nay */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-display text-[16px] font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>Kế hoạch và Trọng tâm công việc hôm nay</span>
                </h2>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Thứ Hai, 14/09/2026 • Nhiệm vụ dự án được Trưởng phòng giao
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/tasks')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Xem tất cả task</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div 
                onClick={() => navigate('/tasks')}
                className="p-3.5 rounded-xl bg-blue-50/60 hover:bg-blue-100/60 border border-blue-200 flex items-start gap-3 cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  01
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">Sprint 38: Hoàn thiện Module Quản trị Nhân sự và Chấm công</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-200/80 text-blue-800 font-bold shrink-0">Ưu tiên cao</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Trưởng phòng giao: Tích hợp API camera nhận diện và kiểm thử luồng chấm công. Hạn chót: <strong>16/09/2026</strong>.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 font-mono">85%</span>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => navigate('/tasks')}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 flex items-start gap-3 cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  02
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">14:00 PM - Họp tiến độ kỹ thuật Sprint cùng Trưởng phòng</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold shrink-0">Phòng họp A3</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Báo cáo tiến độ phân hệ Bảng lương và Bảng công tháng với Trưởng phòng Vũ Đình Khang.
                  </p>
                </div>
              </div>

              <div 
                onClick={() => navigate('/tasks')}
                className="p-3.5 rounded-xl bg-amber-50/50 hover:bg-amber-100/50 border border-amber-200 flex items-start gap-3 cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  03
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">Kiểm tra bảo mật và quyền truy cập dữ liệu nhân viên</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold shrink-0">Đang làm</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Đảm bảo Trưởng phòng và đồng nghiệp không xem được thông tin riêng tư (CCCD, Lương). Hạn chót: <strong>18/09</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Bảng tin nội bộ */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-[16px] font-bold text-slate-900 tracking-tight">
                Bảng tin và Thông báo công ty
              </h2>
              <button
                type="button"
                onClick={() => openModal('modal3B')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Xem chi tiết</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <div 
                onClick={() => openModal('modal3B', { title: 'Thông báo Lịch nghỉ Lễ Quốc khánh 02/09' })}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold text-[10px]">
                    HÀNH CHÍNH
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Lịch nghỉ lễ Quốc khánh 02/09/2026
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  Công ty nghỉ lễ từ Thứ Bảy ngày 31/08 đến hết Thứ Ba ngày 03/09. Đi làm lại Thứ Tư 04/09.
                </p>
              </div>

              <div 
                onClick={() => openModal('modal3B', { title: 'Chính sách Thẻ Bảo hiểm Bảo Việt Gold 2026' })}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                    PHÚC LỢI
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Phát hành thẻ Bảo hiểm Sức khỏe 2026
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  Phòng Nhân sự đã kích hoạt thẻ Bảo hiểm Bảo Việt Gold hạn mức 150 triệu/năm cho toàn thể nhân viên.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
