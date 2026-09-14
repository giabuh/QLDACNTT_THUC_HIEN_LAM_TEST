import React, { useState } from 'react';
import AppleModal from '../../components/motion/AppleModal';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Building, 
  Calendar, 
  Check, 
  Sparkles,
  Paperclip
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Modal_NotificationDetailPopup({ isOpen, onClose, payload }) {
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  if (!payload) return null;

  const docNumber = payload.docNumber || 'Số: 128/2026/QĐ-TGĐ';
  const title = payload.title || 'QUYẾT ĐỊNH DOANH NGHIỆP';
  const signer = payload.signer || 'Lê Vũ Ngọc Duy - Tổng Giám Đốc';
  const date = payload.date || '12/09/2026';
  const content = payload.content || '';
  const attachedFile = payload.attachedFile || null;

  const handleAcknowledge = () => {
    setIsAcknowledged(true);
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}
  };

  const handleDownload = () => {
    alert(`Đang tải tệp đính kèm chính thức: ${attachedFile || 'Van_ban_quyet_dinh.pdf'}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi Tiết Văn Bản Thông Báo & Quyết Định"
      subtitle={`${docNumber} • Ban hành ngày ${date}`}
      badge={
        <span className="bg-purple-50 text-purple-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          Văn bản chính thức
        </span>
      }
      maxWidth="max-w-3xl"
    >
      <div className="p-6 space-y-6 text-xs text-slate-700 font-sans">
        {/* Official Document Paper Container */}
        <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 relative">
          {/* Header Quốc hiệu / Tiêu ngữ Doanh Nghiệp */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-200 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-extrabold flex items-center justify-center text-base shadow-xs">
                  N
                </div>
                <div className="font-bold text-slate-900 text-xs tracking-wide">
                  CÔNG TY CỔ PHẦN CÔNG NGHỆ FWB NEXUS
                </div>
              </div>
              <div className="text-[11px] font-mono text-slate-500 font-bold">{docNumber}</div>
            </div>

            <div className="text-left sm:text-right space-y-0.5">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </div>
              <div className="text-[11px] text-slate-500 italic">Độc lập - Tự do - Hạnh phúc</div>
              <div className="text-[11px] text-slate-400 font-mono mt-1">Hà Nội, ngày {date}</div>
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center py-2 space-y-1">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 uppercase font-display tracking-tight">
              {title}
            </h2>
            <p className="text-[11px] text-slate-500 italic">
              V/v triển khai kế hoạch và thực hiện nhiệm vụ trọng tâm doanh nghiệp
            </p>
          </div>

          {/* Main Body Content */}
          <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-3 leading-relaxed text-slate-800 text-xs whitespace-pre-line">
            {content}
          </div>

          {/* Attachments (if any) */}
          {attachedFile && (
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Paperclip className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="font-bold text-slate-900 text-xs">{attachedFile}</div>
                  <div className="text-[10px] text-slate-500">Tệp văn bản đính kèm có chữ ký số xác thực</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDownload}
                className="px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs rounded-lg border border-blue-300 shadow-2xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải văn bản</span>
              </button>
            </div>
          )}

          {/* Signer & Seal Section */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <div className="text-center space-y-2 min-w-[200px]">
              <div className="font-bold text-slate-900 uppercase text-xs">NGƯỜI KÝ DUYỆT BAN HÀNH</div>
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 inline-flex items-center gap-1.5 text-emerald-800 text-[11px] font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Đã ký số điện tử CA hợp lệ</span>
              </div>
              <div className="font-bold text-slate-900 text-sm pt-1">{signer}</div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Xác thực bởi Cổng thông tin điều hành NEXUS Enterprise</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>In văn bản</span>
            </button>

            {isAcknowledged ? (
              <span className="px-4 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-xs border border-emerald-200 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Đã tiếp thu & Xác nhận</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleAcknowledge}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Xác nhận đã tiếp nhận thông báo</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </AppleModal>
  );
}
