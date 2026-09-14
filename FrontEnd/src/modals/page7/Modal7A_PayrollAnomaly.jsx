import React, { useState } from 'react';
import AppleModal from '../../components/motion/AppleModal';
import { AlertTriangle, CheckCircle2, ShieldAlert, FileText, Check, X, ChevronRight, Sparkles } from 'lucide-react';

export default function Modal7A_PayrollAnomaly({ isOpen, onClose, payload }) {
  const [resolved, setResolved] = useState({
    item1: false,
    item2: false,
    item3: false,
  });

  const toggleResolved = key => {
    setResolved(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allResolved = resolved.item1 && resolved.item2 && resolved.item3;

  return (
    <AppleModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Xử lý và Thẩm định bất thường bảng lương</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Phát hiện 3 cảnh báo
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Kỳ lương Tháng 09/2026 • Cần đối soát tính tuân thủ pháp lý trước khi khóa sổ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Anomaly Cards */}
        <div className="mt-5 space-y-3.5">
          {/* Item 1 */}
          <div className={`p-4 rounded-xl border transition-all ${
            resolved.item1 ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-amber-200 shadow-xs'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">Lê Anh Tuấn (Kỹ sư DevOps)</span>
                    <span className="px-2 py-0.2 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold rounded">
                      OT 44.5 giờ (Vượt trần 40h/tháng)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Theo Điều 107 Bộ luật Lao động 2019, tổng số giờ OT không quá 40h/tháng. Đã có công văn giải trình sự cố sập cụm máy chủ thanh toán trực tuyến ngày 04/09 có chữ ký xác nhận của CTO.
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleResolved('item1')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                  resolved.item1
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                {resolved.item1 ? <Check className="w-3.5 h-3.5" /> : null}
                {resolved.item1 ? 'Đã duyệt ngoại lệ' : 'Phê duyệt ngoại lệ'}
              </button>
            </div>
          </div>

          {/* Item 2 */}
          <div className={`p-4 rounded-xl border transition-all ${
            resolved.item2 ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-blue-200 shadow-xs'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">Phạm Hương Ly (Chuyên viên Kinh doanh)</span>
                    <span className="px-2 py-0.2 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold rounded">
                      Hoa hồng 38.500.000 đ (+145%)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Mức hoa hồng tăng đột biến do chốt thành công gói Hợp đồng triển khai Enterprise khối Bán lẻ (Doanh số 1.2 tỷ). Hợp đồng số HĐ-2026/09-FWB đã có nghiệm thu tài chính giai đoạn 1.
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleResolved('item2')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                  resolved.item2
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200'
                }`}
              >
                {resolved.item2 ? <Check className="w-3.5 h-3.5" /> : null}
                {resolved.item2 ? 'Đã xác nhận hoa hồng' : 'Xác nhận hoa hồng'}
              </button>
            </div>
          </div>

          {/* Item 3 */}
          <div className={`p-4 rounded-xl border transition-all ${
            resolved.item3 ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-purple-200 shadow-xs'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">Trần Văn Nam (Chuyên viên Marketing)</span>
                    <span className="px-2 py-0.2 bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold rounded">
                      Truy thu bảo hiểm: 450.000 đ
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Điều chỉnh khoản truy thu tiền đóng BHYT và BHTN của đợt nghỉ không lương 14 ngày trong chu kỳ Tháng 08/2026 đã được cơ quan BHXH Quận 1 gửi thông báo quyết toán.
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleResolved('item3')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                  resolved.item3
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200'
                }`}
              >
                {resolved.item3 ? <Check className="w-3.5 h-3.5" /> : null}
                {resolved.item3 ? 'Đã xác nhận truy thu' : 'Xác nhận khấu trừ'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Trạng thái xử lý: <strong className="text-slate-800">{Object.values(resolved).filter(Boolean).length} / 3 cảnh báo</strong>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold rounded-xl text-xs transition"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                setResolved({ item1: true, item2: true, item3: true });
                setTimeout(() => onClose(), 1000);
              }}
              className={`px-5 py-2 rounded-xl text-xs font-bold shadow-sm transition active:scale-95 flex items-center gap-1.5 ${
                allResolved
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Chấp thuận toàn bộ và Tiếp tục quy trình
            </button>
          </div>
        </div>
      </div>
    </AppleModal>
  );
}
