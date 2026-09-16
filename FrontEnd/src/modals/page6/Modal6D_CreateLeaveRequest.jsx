import React, { useState } from 'react';
import AppleModal from '../../components/motion/AppleModal';
import { useAuth } from '../../context/AuthContext';
import { 
  CalendarDays, 
  Clock, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  X, 
  Send, 
  UserCheck, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Modal6D_CreateLeaveRequest({ isOpen, onClose }) {
  const { currentRole } = useAuth();
  const isLineManager = currentRole?.key === 'LINE_MANAGER';
  const isHrd = currentRole?.key === 'HR_DIRECTOR';

  const [leaveType, setLeaveType] = useState('annual');
  const [startDate, setStartDate] = useState('2026-09-18');
  const [endDate, setEndDate] = useState('2026-09-19');
  const [shiftType, setShiftType] = useState('full');
  const [handoverPerson, setHandoverPerson] = useState('NV-0842');
  const [reason, setReason] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // fallback
      }
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1600);
    }, 600);
  };

  return (
    <AppleModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Tạo Đơn Xin Nghỉ Phép Mới
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Đơn được gửi trực tiếp đến cấp có thẩm quyền để thẩm định và phê duyệt
              </p>
            </div>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Gửi Đơn Thành Công!</h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Đơn nghỉ phép của bạn đã được chuyển tới cấp có thẩm quyền phê duyệt và đồng bộ vào lịch trình bộ phận.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            {/* Loại nghỉ phép chuẩn 7 trường hợp */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Loại hình nghỉ phép <span className="text-rose-500">*</span>
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              >
                <option value="annual">Nghỉ phép thường niên (Còn 9 ngày khả dụng)</option>
                <option value="personal">Nghỉ việc riêng hưởng 100% lương (Kết hôn, việc hiếu hỷ theo Luật)</option>
                <option value="medical">Nghỉ ốm đau / Thai sản hưởng chế độ BHXH (Mẫu y tế C65-HD)</option>
                <option value="unpaid">Nghỉ việc riêng không hưởng lương (Cần Ban Giám Đốc phê duyệt)</option>
                <option value="compensatory">Nghỉ bù ngày công làm thêm giờ / trực đêm (TOIL)</option>
                <option value="paternity">Chế độ Nam nhân viên khi vợ sinh con (5 - 14 ngày BHXH)</option>
              </select>
            </div>

            {/* Thời gian */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Từ ngày <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Đến ngày <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  required
                />
              </div>
            </div>

            {/* Ca nghỉ & Người bàn giao */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Khung ca nghỉ
                </label>
                <select
                  value={shiftType}
                  onChange={(e) => setShiftType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                >
                  <option value="full">Cả ngày (1.0 ngày công)</option>
                  <option value="morning">Buổi sáng (08:00 - 12:00)</option>
                  <option value="afternoon">Buổi chiều (13:30 - 17:30)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Người nhận bàn giao công việc <span className="text-rose-500">*</span>
                </label>
                <select
                  value={handoverPerson}
                  onChange={(e) => setHandoverPerson(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                >
                  <option value="NV-0842">Phạm Minh Quân (Kỹ sư Phần mềm)</option>
                  <option value="NV-1003">Vũ Mai Chi (Senior Designer)</option>
                  <option value="NV-1007">Nguyễn Văn Tuấn (Kỹ sư Backend)</option>
                </select>
              </div>
            </div>

            {/* Lý do */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Lý do nghỉ phép cụ thể <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do chi tiết để cấp trên xem xét phê duyệt..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition resize-none"
                required
              />
            </div>

            {/* File đính kèm */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Chứng từ đính kèm (Chứng nhận C65, Giấy ra viện hoặc Thiệp cưới/Giấy tờ)
              </label>
              <div 
                onClick={() => setAttachedFile(attachedFile ? null : 'Chung_nhan_y_te_C65_2026.pdf')}
                className="border-2 border-dashed border-slate-200 hover:border-blue-400 p-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition-colors"
              >
                <UploadCloud className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 font-medium">
                  {attachedFile ? (
                    <strong className="text-blue-600">{attachedFile} (Đã đính kèm)</strong>
                  ) : (
                    'Bấm để tải tệp lên (PDF, JPG, PNG tối đa 10MB)'
                  )}
                </span>
              </div>
            </div>

            {/* Cấp phê duyệt trực tiếp - Dynamic Thẩm quyền */}
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-950 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Người phê duyệt tiếp nhận: <strong>
                    {isLineManager
                      ? 'Lê Vũ Ngọc Duy (Tổng Giám Đốc / CEO trực tiếp phê duyệt)'
                      : isHrd
                      ? 'Lê Vũ Ngọc Duy (Tổng Giám Đốc / CEO trực tiếp phê duyệt)'
                      : leaveType === 'unpaid'
                      ? 'Lê Vũ Ngọc Duy (CEO) và Trần Mai Hương (HRD)'
                      : leaveType === 'medical'
                      ? 'Trần Mai Hương (HRD thẩm định C65)'
                      : leaveType === 'annual' && (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) >= 3
                      ? 'Vũ Đình Khang (Xác nhận) -> Lê Vũ Ngọc Duy (CEO phê duyệt)'
                      : 'Vũ Đình Khang (Trưởng Phòng Kỹ Thuật)'}
                  </strong>
                </span>
              </div>
              <span className="text-[11px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200 shadow-2xs">
                {isLineManager || isHrd
                  ? 'Trình Tổng Giám Đốc phê duyệt'
                  : leaveType === 'unpaid'
                  ? 'Phê duyệt cấp cao (Nghỉ không lương)'
                  : leaveType === 'medical'
                  ? 'Thẩm định hồ sơ BHXH'
                  : leaveType === 'annual' && (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) >= 3
                  ? 'Quy trình 2 cấp (> 3 ngày)'
                  : leaveType === 'personal'
                  ? 'Hưởng 100% lương (Hiếu hỷ)'
                  : leaveType === 'compensatory'
                  ? 'Nghỉ bù OT'
                  : 'Duyệt 1 cấp (Trưởng phòng)'}
              </span>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Đang gửi đơn...' : 'Gửi đơn phê duyệt'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </AppleModal>
  );
}
