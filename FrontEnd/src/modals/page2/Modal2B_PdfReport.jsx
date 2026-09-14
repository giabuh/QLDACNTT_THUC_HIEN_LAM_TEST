import React, { useState } from 'react';
import AppleModal from '../../components/motion/AppleModal';
import { Download, Printer, CheckCircle2, FileText, Calendar, Building, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Modal2B_PdfReport({ isOpen, onClose }) {
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExported(true);
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }, 1200);
  };

  return (
    <AppleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Xuất Báo Cáo Tình Hình Nhân Sự và Chuyên Cần"
      subtitle="Bản xem trước tài liệu chính thức • Định dạng chuẩn PDF A4 Kèm Chữ Ký Số Doanh Nghiệp"
      maxWidth="max-w-4xl"
    >
      <div className="p-6 space-y-6">
        {/* Document Preview Card */}
        <div className="bg-white border border-slate-300 rounded-2xl p-8 shadow-sm font-sans relative overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-5">
            <div>
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                TẬP ĐOÀN CÔNG NGHỆ FWB NEXUS CORP
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Số: 1209/BC-NS/2026 • Ban Giám Đốc Nhân Sự
              </div>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div className="font-bold text-slate-800">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div className="text-[11px] italic">Độc lập - Tự do - Hạnh phúc</div>
              <div className="text-[11px] mt-1">Hà Nội, ngày 12 tháng 09 năm 2026</div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center my-6">
            <h1 className="text-xl font-bold font-display uppercase tracking-tight text-slate-900">
              BÁO CÁO TỔNG QUAN TÌNH HÌNH NHÂN SỰ VÀ CHẤM CÔNG HÔM NAY
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              (Dữ liệu tổng hợp thời gian thực từ các cổng điểm danh nhận diện khuôn mặt và Hệ thống nhân sự)
            </p>
          </div>

          {/* Core Table */}
          <table className="w-full text-xs border border-slate-300 mb-6">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
                <th className="p-2.5 border-r border-slate-300 text-left">Chỉ tiêu tổng hợp</th>
                <th className="p-2.5 border-r border-slate-300 text-center">Số lượng / Tỷ lệ</th>
                <th className="p-2.5 border-r border-slate-300 text-center">So với tháng trước</th>
                <th className="p-2.5 text-left">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-2.5 border-r border-slate-300 font-semibold">1. Tổng số nhân sự chính thức</td>
                <td className="p-2.5 border-r border-slate-300 text-center font-bold">348 nhân viên</td>
                <td className="p-2.5 border-r border-slate-300 text-center text-emerald-600 font-bold">+12 nhân sự</td>
                <td className="p-2.5">Quy mô mở rộng theo kế hoạch Q3</td>
              </tr>
              <tr>
                <td className="p-2.5 border-r border-slate-300 font-semibold">2. Tỷ lệ hiện diện tại trụ sở</td>
                <td className="p-2.5 border-r border-slate-300 text-center font-bold text-blue-600">328 / 348 (94.2%)</td>
                <td className="p-2.5 border-r border-slate-300 text-center text-emerald-600 font-bold">+1.8%</td>
                <td className="p-2.5">Đạt chỉ tiêu chuyên cần &gt; 92%</td>
              </tr>
              <tr>
                <td className="p-2.5 border-r border-slate-300 font-semibold">3. Ghi nhận đi trễ (&gt;15 phút)</td>
                <td className="p-2.5 border-r border-slate-300 text-center font-bold text-amber-600">14 trường hợp</td>
                <td className="p-2.5 border-r border-slate-300 text-center text-rose-600 font-bold">+2 ca</td>
                <td className="p-2.5">Do ùn tắc giao thông tuyến Cầu Giấy</td>
              </tr>
              <tr>
                <td className="p-2.5 border-r border-slate-300 font-semibold">4. Đơn xin nghỉ phép hợp lệ</td>
                <td className="p-2.5 border-r border-slate-300 text-center font-bold">6 nhân viên</td>
                <td className="p-2.5 border-r border-slate-300 text-center">Ổn định</td>
                <td className="p-2.5">2 phép năm, 1 ốm đau BHXH C65</td>
              </tr>
              <tr>
                <td className="p-2.5 border-r border-slate-300 font-semibold">5. Dự toán ngân sách quỹ lương</td>
                <td className="p-2.5 border-r border-slate-300 text-center font-bold text-slate-900">4.28 tỷ VNĐ</td>
                <td className="p-2.5 border-r border-slate-300 text-center text-emerald-600 font-bold">+2.4%</td>
                <td className="p-2.5">Trong định mức kế hoạch được duyệt</td>
              </tr>
            </tbody>
          </table>

          {/* Signatures & Red Seal */}
          <div className="flex justify-between items-end mt-8 pt-4">
            <div className="text-center">
              <div className="text-xs font-bold text-slate-700">NGƯỜI LẬP BÁO CÁO</div>
              <div className="text-[11px] text-slate-400 mt-1">Chuyên viên C&B Tổng hợp</div>
              <div className="h-16 flex items-center justify-center font-display italic text-slate-700 font-bold text-lg">
                Đặng Thu Thảo
              </div>
              <div className="text-xs font-semibold text-slate-800">Đặng Thu Thảo</div>
            </div>

            {/* Official Red Seal */}
            <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-rose-600 flex flex-col items-center justify-center text-rose-600 font-bold text-[10px] uppercase text-center transform -rotate-12 opacity-85 shadow-[0_0_0_2px_rgba(225,29,72,0.15)]">
              <div>FWB NEXUS CORP</div>
              <div className="text-[9px] my-0.5 font-normal">★ CHỨNG THỰC ★</div>
              <div className="text-[10px]">ĐÃ KÝ SỐ</div>
            </div>

            <div className="text-center">
              <div className="text-xs font-bold text-slate-700">GIÁM ĐỐC NHÂN SỰ</div>
              <div className="text-[11px] text-slate-400 mt-1">Phê duyệt chính thức</div>
              <div className="h-16 flex items-center justify-center font-display italic text-blue-800 font-bold text-lg">
                Trần Mai Hương
              </div>
              <div className="text-xs font-semibold text-slate-800">Trần Mai Hương</div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Tài liệu số đã được gắn mã định danh xác thực UUID: <span className="font-mono text-slate-700">NX-REP-2026-0912</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Hủy
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isExporting}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-75"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Đang kết xuất PDF...' : exported ? 'Đã tải xuống PDF!' : 'Tải xuống Báo cáo PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </AppleModal>
  );
}
