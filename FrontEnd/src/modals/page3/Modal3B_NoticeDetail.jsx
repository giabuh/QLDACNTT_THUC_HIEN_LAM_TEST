import React, { useState } from 'react';
import AppleModal from '../../components/motion/AppleModal';
import { Calendar, MapPin, Building, CheckCircle2, ShieldCheck, HeartPulse, Clock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Modal3B_NoticeDetail({ isOpen, onClose, payload }) {
  const [confirmed, setConfirmed] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('slot1');

  const handleConfirm = () => {
    setConfirmed(true);
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const title = payload?.title || 'Lịch khám sức khỏe định kỳ năm 2026 toàn công ty';

  return (
    <AppleModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle="Thông báo Doanh nghiệp • Đăng ngày 12/09/2026 bởi Phòng Nhân sự và Đãi ngộ"
      badge={
        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
          <HeartPulse className="w-3.5 h-3.5" />
          Y tế và Sức khỏe
        </span>
      }
      maxWidth="max-w-2xl"
    >
      <div className="p-6 space-y-4 text-xs text-slate-700">
        {/* Hospital Banner */}
        <div className="bg-gradient-to-r from-blue-50 via-blue-50/40 to-indigo-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white border border-blue-200 flex items-center justify-center shrink-0 text-blue-600 shadow-2xs">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Bệnh viện Đa khoa Quốc tế Vinmec Central Park</span>
              <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                Tiêu chuẩn JCI
              </span>
            </div>
            <p className="text-xs text-blue-900 mt-0.5">
              Gói khám sức khỏe <strong className="text-blue-700 font-bold">Platinum toàn diện</strong> do NEXUS HR tài trợ 100% (Trị giá <strong className="text-emerald-700">4.500.000 VNĐ / nhân sự</strong>).
            </p>
          </div>
        </div>

        {/* Schedule & Location */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2.5">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            1. Thời gian và Địa điểm tổ chức
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Thời gian tổ chức</div>
                <div className="font-bold text-slate-900 mt-0.5">18/09/2026 - 20/09/2026</div>
                <div className="text-[11px] text-slate-500">Từ 07:30 đến 11:30 sáng</div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Địa điểm khám</div>
                <div className="font-bold text-slate-900 mt-0.5">Tầng 3 - Khoa Khám bệnh Vinmec</div>
                <div className="text-[11px] text-slate-500">208 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2.5">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            2. Lưu ý chuẩn bị trước khi khám
          </h3>
          <ul className="list-disc list-inside space-y-1 text-slate-600 leading-relaxed">
            <li>Nhịn ăn sáng và không uống nước ngọt/sữa trước giờ lấy máu xét nghiệm ít nhất 8 tiếng.</li>
            <li>Mang theo Căn cước công dân (CCCD) và thẻ Bảo hiểm Y tế (BHYT) bản gốc hoặc VssID.</li>
            <li>Sau khi lấy mẫu xét nghiệm, bệnh viện phục vụ bữa sáng buffet nhẹ miễn phí tại quầy pantry.</li>
          </ul>
        </div>

        {/* Slot Selection */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
          <label className="font-bold text-slate-800 block text-xs">
            Chọn khung giờ khám phù hợp với lịch làm việc của bạn:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <label className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${selectedSlot === 'slot1' ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold' : 'bg-white border-slate-200 text-slate-700'}`}>
              <input type="radio" name="slot" value="slot1" checked={selectedSlot === 'slot1'} onChange={() => setSelectedSlot('slot1')} className="sr-only" />
              <div className="text-xs">Thứ Sáu 18/09</div>
              <div className="text-[10px] opacity-80">07:30 - 09:30</div>
            </label>
            <label className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${selectedSlot === 'slot2' ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold' : 'bg-white border-slate-200 text-slate-700'}`}>
              <input type="radio" name="slot" value="slot2" checked={selectedSlot === 'slot2'} onChange={() => setSelectedSlot('slot2')} className="sr-only" />
              <div className="text-xs">Thứ Bảy 19/09</div>
              <div className="text-[10px] opacity-80">08:00 - 10:00</div>
            </label>
            <label className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${selectedSlot === 'slot3' ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold' : 'bg-white border-slate-200 text-slate-700'}`}>
              <input type="radio" name="slot" value="slot3" checked={selectedSlot === 'slot3'} onChange={() => setSelectedSlot('slot3')} className="sr-only" />
              <div className="text-xs">Chủ Nhật 20/09</div>
              <div className="text-[10px] opacity-80">09:00 - 11:00</div>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <span className="text-slate-400 text-[11px]">Hạn đăng ký chọn ca: 15/09/2026</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              {confirmed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Đã ghi nhận ca khám!</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác nhận tham gia và Đặt lịch</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </AppleModal>
  );
}
