import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Settings, 
  Shield, 
  Clock, 
  Bell, 
  Database, 
  Key, 
  Users, 
  Check, 
  Save, 
  Building,
  Lock,
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Page_Settings() {
  const { currentRole } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [autoApproveOT, setAutoApproveOT] = useState(false);
  const [lateGraceMinutes, setLateGraceMinutes] = useState(15);
  const [maxOtPerMonth, setMaxOtPerMonth] = useState(40);
  const [faceConfidenceThreshold, setFaceConfidenceThreshold] = useState(98);

  const canEditSettings = currentRole.key === 'CEO' || currentRole.key === 'HR_DIRECTOR';

  // ==========================================
  // GIỚI HẠN QUYỀN CHO CẤP 2B VÀ CẤP 3
  // ==========================================
  if (!canEditSettings) {
    return (
      <div className="w-full min-h-full p-6 space-y-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-lg text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 inline-block">
              Khu Vực Giới Hạn Quản Trị
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Cài Đặt và Cấu Hình Hệ Thống
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Theo chính sách an ninh phân quyền hệ thống, việc thay đổi quy định tăng ca OT toàn công ty, cài đặt nhận diện khuôn mặt và kết nối máy chấm công chỉ dành riêng cho <strong>Ban Giám Đốc</strong> và <strong>Giám Đốc Khối Nhân Sự</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 text-left">
            Vai trò hiện tại của bạn: <strong className="text-slate-900">{currentRole.title}</strong>.
          </div>

          <button
            type="button"
            onClick={() => navigate(currentRole.isStaff ? '/portal' : '/dashboard')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Quay lại {currentRole.isStaff ? 'Bàn làm việc' : 'Dashboard'}</span>
          </button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    setSaved(true);
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="w-full min-h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">
            Thiết lập và Cấu hình Tham số Nhân sự
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quy định giới hạn OT, ngưỡng điểm danh nhận diện khuôn mặt và chính sách tự động hóa
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Đã lưu cấu hình!' : 'Lưu thay đổi'}</span>
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Attendance & Shift Rules */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-sm font-display">
              Chính sách Ca làm và Điểm danh
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Thời gian ân hạn đi trễ (Grace Period)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={lateGraceMinutes}
                  onChange={(e) => setLateGraceMinutes(Number(e.target.value))}
                  className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs outline-none focus:bg-white focus:border-blue-500"
                />
                <span className="text-slate-500">phút (Sau 08:15 sẽ tính đi trễ)</span>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Giới hạn làm thêm giờ (OT) tối đa mỗi tháng
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={maxOtPerMonth}
                  onChange={(e) => setMaxOtPerMonth(Number(e.target.value))}
                  className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs outline-none focus:bg-white focus:border-blue-500"
                />
                <span className="text-slate-500">giờ / tháng (Theo Điều 107 Bộ luật Lao động 2019)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="inline-flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoApproveOT}
                  onChange={(e) => setAutoApproveOT(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-slate-800 block">Tự động duyệt OT dưới 2 giờ</span>
                  <span className="text-slate-400 block mt-0.5">Áp dụng cho ngày thường trong tuần</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Card 2: Biometrics */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-sm font-display">
              Cấu hình Nhận diện Sinh trắc học và Khuôn mặt
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700">
                  Ngưỡng độ tin cậy nhận diện khuôn mặt (Face Match)
                </label>
                <span className="font-bold text-blue-600">{faceConfidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="90"
                max="99"
                value={faceConfidenceThreshold}
                onChange={(e) => setFaceConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <span className="text-slate-400 text-[11px] block mt-1">
                Khuyến nghị: 98% để tránh nhận diện nhầm lẫn và chống giả mạo hình ảnh tĩnh.
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 space-y-1">
              <span className="font-bold block">Thuật toán chống gian lận (Anti-Spoofing Liveness)</span>
              <p className="text-[11px] text-slate-600">
                Camera cổng kiểm tra chuyển động tự nhiên, vi cử động cơ mặt và chiều sâu trước khi ghi nhận dữ liệu điểm danh.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
