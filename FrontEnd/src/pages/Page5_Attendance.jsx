import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';
import attendanceService from '../services/attendanceService';
import { 
  Camera, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  CalendarDays, 
  Check, 
  UserCheck, 
  ShieldCheck, 
  Building 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Page5_Attendance() {
  const { openModal } = useModal();
  const { currentRole } = useAuth();
  const [shiftMode, setShiftMode] = useState('checkin'); // checkin or checkout
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isScanning, setIsScanning] = useState(true);
  const [hasCaptured, setHasCaptured] = useState(false);

  const isStaff = currentRole?.key === 'EMPLOYEE';
  const isManager = currentRole?.key === 'LINE_MANAGER';
  const isHr = currentRole?.key === 'HR_DIRECTOR';
  const isCeo = currentRole?.key === 'CEO';

  // Titles according to user requirement:
  // Cấp 1: "Giám sát chấm công và hiện diện"
  // Cấp 2A, 2B, 3: "Chấm công và ca làm"
  const pageTitle = isCeo ? 'Giám Sát Chấm Công và Hiện Diện' : 'Chấm Công và Ca Làm';

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualCapture = async () => {
    setIsScanning(false);
    setHasCaptured(true);
    try {
      if (shiftMode === 'checkin') {
        await attendanceService.checkIn({ method: 'face_id', gpsLat: 10.762622, gpsLng: 106.660172 });
      } else {
        await attendanceService.checkOut({ method: 'face_id' });
      }
    } catch (err) {
      console.warn('Attendance API notice:', err.message || err);
    }
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const handleRetake = () => {
    setHasCaptured(false);
    setIsScanning(true);
  };

  // Dynamic Shift Info based on logged-in user
  const shiftInfo = isCeo ? {
    title: 'Ca Điều Hành Lãnh Đạo',
    time: '08:30 - 18:00 (Linh hoạt)',
    validWindow: '08:00 - 09:00',
    checkin: '08:15 AM',
    status: 'Đúng giờ',
    checkout: 'Chưa ghi nhận'
  } : isHr ? {
    title: 'Ca Quản Trị Lương và Nhân Sự',
    time: '08:00 - 17:30',
    validWindow: '07:45 - 08:15',
    checkin: '07:55 AM',
    status: 'Đúng giờ',
    checkout: 'Chưa ghi nhận'
  } : isManager ? {
    title: 'Ca Trưởng Phòng Kỹ Thuật (Tech Lead)',
    time: '08:30 - 18:00',
    validWindow: '08:15 - 08:45',
    checkin: '08:20 AM',
    status: 'Đúng giờ',
    checkout: 'Chưa ghi nhận'
  } : {
    title: 'Ca Tiêu Chuẩn (Kỹ Sư Phần Mềm)',
    time: '08:00 - 17:30',
    validWindow: '07:45 - 08:15',
    checkin: '08:02 AM',
    status: 'Đúng giờ',
    checkout: 'Chưa ghi nhận'
  };

  return (
    <div className="w-full min-h-full p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">
            {pageTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isCeo 
              ? 'Giám sát tỷ lệ hiện diện, ca làm và kỷ luật thời gian toàn công ty'
              : isHr
              ? 'Quản lý lịch ca làm việc và dữ liệu chấm công nhân viên'
              : isManager
              ? 'Theo dõi ca làm việc và tình hình đi làm của đội ngũ phòng ban'
              : 'Ghi nhận thời gian làm việc hàng ngày của cá nhân'}
          </p>
        </div>

        {/* Realtime Clock & Actions */}
        <div className="flex items-center gap-3.5 flex-wrap self-start md:self-auto">
          {/* Digital Clock */}
          <div className="text-right pr-2">
            <div className="font-mono text-xl font-bold text-slate-900 leading-tight">
              {currentTime.toLocaleTimeString('vi-VN')}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Thứ Hai, 12/09/2026
            </div>
          </div>

          {/* Mode Switch */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setShiftMode('checkin')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                shiftMode === 'checkin'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vào Ca (Check-In)
            </button>
            <button
              type="button"
              onClick={() => setShiftMode('checkout')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                shiftMode === 'checkout'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hết Ca (Check-Out)
            </button>
          </div>

          {/* Timesheet Matrix Button (Modal 5B) */}
          <button
            type="button"
            onClick={() => openModal('modal5B')}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <CalendarDays className="w-4 h-4 text-blue-600" />
            <span>{isManager ? 'Bảng công tháng bộ phận' : 'Bảng công tháng'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Camera Stage (8 cols) + Right Shift & Logs (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Camera Stage */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          {/* Camera Viewport */}
          <div className="relative w-full aspect-[4/3] max-h-[440px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center">
            {/* Camera feed */}
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
              alt="Live Face Stream"
              className="w-full h-full object-cover transform scale-105"
            />

            {/* Subtle Vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />

            {/* Clean Scanning Focus Box */}
            <div className="absolute top-[16%] left-[41.5%] w-[180px] h-[215px] pointer-events-none">
              <div className="w-full h-full relative rounded-2xl border-2 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                {isScanning && (
                  <motion.div
                    className="absolute inset-x-1 h-0.5 bg-emerald-400 shadow-[0_0_10px_#34D399]"
                    animate={{ top: ['5%', '95%', '5%'] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
                  />
                )}
              </div>

              {/* Verified Identity Card */}
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-64 bg-slate-900/90 backdrop-blur-md border border-emerald-500/40 rounded-xl px-3 py-1.5 text-white shadow-xl text-center">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Xác thực nhận diện thành công</span>
                </div>
                <div className="text-xs font-bold text-slate-50 mt-0.5 truncate">
                  {currentRole?.name} • {currentRole?.title}
                </div>
              </div>
            </div>
          </div>

          {/* Success Banner */}
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3 text-emerald-900 shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
              <Check className="w-5 h-5" />
            </div>
            <div className="flex-1 text-xs">
              <div className="font-bold text-emerald-800 text-sm flex items-center gap-2">
                Điểm danh thành công!
                <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-mono text-[11px] font-bold">
                  {shiftInfo.checkin}
                </span>
              </div>
              <p className="text-emerald-700 mt-0.5">
                Đã ghi nhận giờ vào ca sáng đúng giờ. Dữ liệu đã đồng bộ theo thời gian thực vào bảng công tháng.
              </p>
            </div>
          </div>

          {/* Camera Actions */}
          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              onClick={handleManualCapture}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm text-sm transition-all active:scale-[0.99] cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <span>Xác nhận và Điểm danh ngay</span>
            </button>

            <button
              type="button"
              onClick={handleRetake}
              className="bg-slate-50 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold py-3 px-4 rounded-xl text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
              <span>Chụp lại</span>
            </button>
          </div>
        </div>

        {/* Right Column: Shift Today + Role-tailored Logs */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Ca làm việc hôm nay */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Ca làm việc hôm nay</span>
              </h3>
              <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                Đang diễn ra
              </span>
            </div>

            <div className="mt-3.5 bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Ca làm việc:</span>
                <span className="font-bold text-slate-800">{shiftInfo.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Khung giờ:</span>
                <span className="font-semibold text-slate-700">{shiftInfo.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Cửa sổ điểm danh:</span>
                <span className="font-semibold text-slate-700">{shiftInfo.validWindow}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                <span className="text-slate-500">Giờ Check-in:</span>
                <span className="flex items-center gap-1.5">
                  <strong className="text-emerald-700 font-mono text-xs font-bold">{shiftInfo.checkin}</strong>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {shiftInfo.status}
                  </span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Giờ Check-out:</span>
                <span className="text-slate-400 italic">{shiftInfo.checkout}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Lịch sử điểm danh (Tailored per role) */}
          {isCeo || isHr ? (
            /* Cấp 1 & Cấp 2A: Lịch sử điểm danh cổng toàn công ty */
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Lịch sử điểm danh cổng</span>
                </h3>
                <button
                  type="button"
                  onClick={() => openModal('modal5C')}
                  className="text-blue-600 hover:text-blue-700 text-xs font-bold hover:underline cursor-pointer"
                >
                  Xem ảnh camera →
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div 
                  onClick={() => openModal('modal5C', { name: 'Phạm Minh Quân' })}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-1 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar name="Phạm Minh Quân" id="NV-0842" size="sm" shape="circle" />
                    <div>
                      <div className="font-bold text-slate-800 text-xs">Phạm Minh Quân</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Check-in lúc 08:02 AM • Cổng chính</div>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold text-[11px]">
                    Đúng giờ
                  </span>
                </div>

                <div 
                  onClick={() => openModal('modal5C', { name: 'Trần Đình Trọng' })}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-1 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar name="Trần Đình Trọng" id="NV-1002" size="sm" shape="circle" />
                    <div>
                      <div className="font-bold text-slate-800 text-xs">Trần Đình Trọng</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Check-in lúc 07:58 AM • Cổng chính</div>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold text-[11px]">
                    Đúng giờ
                  </span>
                </div>

                <div 
                  onClick={() => openModal('modal5C', { name: 'Vũ Mai Chi' })}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-1 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar name="Vũ Mai Chi" id="NV-1003" size="sm" shape="circle" />
                    <div>
                      <div className="font-bold text-slate-800 text-xs">Vũ Mai Chi</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Check-in lúc 08:14 AM • Cổng phụ</div>
                    </div>
                  </div>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-bold text-[11px]">
                    Trễ 14p
                  </span>
                </div>
              </div>
            </div>
          ) : isManager ? (
            /* Cấp 2B: Lịch sử điểm danh phòng ban Kỹ thuật Phần mềm */
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-purple-600" />
                    <span>Điểm danh bộ phận hôm nay</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Phòng Kỹ thuật Phần mềm (20 nhân sự)</p>
                </div>
                <button
                  type="button"
                  onClick={() => openModal('modal5B')}
                  className="text-purple-600 hover:text-purple-700 text-xs font-bold hover:underline cursor-pointer"
                >
                  Bảng công tháng →
                </button>
              </div>

              {/* Status summary pills */}
              <div className="grid grid-cols-3 gap-2 mb-3.5 text-center text-[11px]">
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="font-bold text-emerald-800 block text-xs">18</span>
                  <span className="text-emerald-700 font-medium">Đúng giờ</span>
                </div>
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="font-bold text-amber-800 block text-xs">1</span>
                  <span className="text-amber-700 font-medium">Đi muộn</span>
                </div>
                <div className="p-2 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="font-bold text-blue-800 block text-xs">1</span>
                  <span className="text-blue-700 font-medium">Nghỉ phép</span>
                </div>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2 flex items-center justify-between hover:bg-slate-50 px-1 rounded-lg transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Avatar name="Phạm Minh Quân" id="NV-0842" size="sm" shape="circle" />
                    <div>
                      <div className="font-bold text-slate-800 text-xs">Phạm Minh Quân</div>
                      <div className="text-[11px] text-slate-400">08:02 AM • Cổng chính A1</div>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold text-[10px]">
                    Đúng giờ
                  </span>
                </div>

                <div className="py-2 flex items-center justify-between hover:bg-slate-50 px-1 rounded-lg transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Avatar name="Hoàng Quốc Bảo" id="NV-1005" size="sm" shape="circle" />
                    <div>
                      <div className="font-bold text-slate-800 text-xs">Hoàng Quốc Bảo</div>
                      <div className="text-[11px] text-slate-400">08:08 AM • Cổng phụ B2</div>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold text-[10px]">
                    Đúng giờ
                  </span>
                </div>

                <div className="py-2 flex items-center justify-between hover:bg-slate-50 px-1 rounded-lg transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Avatar name="Trần Đình Trọng" id="NV-1002" size="sm" shape="circle" />
                    <div>
                      <div className="font-bold text-slate-800 text-xs">Trần Đình Trọng</div>
                      <div className="text-[11px] text-slate-400">07:58 AM • Cổng chính A1</div>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold text-[10px]">
                    Đúng giờ
                  </span>
                </div>

                <div className="py-2 flex items-center justify-between hover:bg-slate-50 px-1 rounded-lg transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Avatar name="Đỗ Tuấn Kiệt" id="NV-1007" size="sm" shape="circle" />
                    <div>
                      <div className="font-bold text-slate-800 text-xs">Đỗ Tuấn Kiệt</div>
                      <div className="text-[11px] text-amber-600">08:24 AM • Muộn 9 phút (Đã giải trình)</div>
                    </div>
                  </div>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-bold text-[10px]">
                    Trễ 9p
                  </span>
                </div>

                <div className="py-2 flex items-center justify-between hover:bg-slate-50 px-1 rounded-lg transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Avatar name="Ngô Phương Thảo" id="NV-1008" size="sm" shape="circle" />
                    <div>
                      <div className="font-bold text-slate-800 text-xs">Ngô Phương Thảo</div>
                      <div className="text-[11px] text-blue-600 font-medium">Nghỉ phép năm • Đơn đã duyệt</div>
                    </div>
                  </div>
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md font-bold text-[10px]">
                    Nghỉ phép
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Cấp 3: Lịch sử điểm danh cá nhân 5 ngày gần nhất */
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Lịch sử chấm công của tôi</span>
                </h3>
                <span className="text-[11px] font-bold text-emerald-600">Đạt 100% công</span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 text-xs">Hôm nay (Thứ Hai 12/09)</div>
                    <div className="text-[11px] text-slate-400">Vào: 08:02 AM • Ra: --:--</div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold text-[10px]">
                    8.0 giờ
                  </span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 text-xs">Thứ Sáu (09/09)</div>
                    <div className="text-[11px] text-slate-400">Vào: 07:58 AM • Ra: 17:35 PM</div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold text-[10px]">
                    8.0 giờ
                  </span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 text-xs">Thứ Năm (08/09)</div>
                    <div className="text-[11px] text-slate-400">Vào: 08:00 AM • Ra: 19:30 PM (OT 2h)</div>
                  </div>
                  <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md font-bold text-[10px]">
                    10.0 giờ
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
