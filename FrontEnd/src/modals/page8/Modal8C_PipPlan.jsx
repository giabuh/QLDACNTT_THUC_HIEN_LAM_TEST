import React, { useState } from 'react';
import AppleModal from '../../components/motion/AppleModal';
import Avatar from '../../components/common/Avatar';
import { Target, TrendingUp, CheckCircle2, Clock, BookOpen, UserCheck, FileText, X, Sparkles, AlertCircle } from 'lucide-react';

export default function Modal8C_PipPlan({ isOpen, onClose, payload }) {
  const [activated, setActivated] = useState(false);

  const weeks = [
    {
      week: 'Tuần 1 (15/09 - 21/09)',
      title: 'Chuẩn hóa quy trình bàn giao và Design System tokens',
      desc: 'Tái cấu trúc thư viện component Figma, thống nhất các biến màu sắc và khoảng cách typography theo hướng dẫn Apple Human Interface Guidelines.',
      kpi: 'Hoàn thiện 100% token thư viện và không để phát sinh lỗi lệch chuẩn CSS.',
      status: 'upcoming',
    },
    {
      week: 'Tuần 2 (22/09 - 28/09)',
      title: 'Nâng cao tốc độ xuất bản ấn phẩm Marketing Ads',
      desc: 'Áp dụng bộ mẫu template tự động hóa nhằm rút ngắn thời gian bàn giao banner quảng cáo từ 6 giờ xuống 2.5 giờ/bộ ấn phẩm.',
      kpi: 'Đạt đúng hạn (On-time Delivery) 95% các yêu cầu từ bộ phận Media.',
      status: 'upcoming',
    },
    {
      week: 'Tuần 3 (29/09 - 05/10)',
      title: 'Đào tạo chuyên sâu: Tương tác người dùng và Chuyển động giao diện',
      desc: 'Tham gia khóa học nội bộ cùng Senior Product Designer về kỹ thuật animation CSS/Framer Motion cho ứng dụng web.',
      kpi: 'Hoàn thành bài kiểm tra thực hành xây dựng 3 tương tác vi mô đạt chuẩn thẩm mỹ.',
      status: 'upcoming',
    },
    {
      week: 'Tuần 4 (06/10 - 12/10)',
      title: 'Nghiệm thu dự án thực tế và Đánh giá tổng kết PIP',
      desc: 'Trình bày sản phẩm thiết kế trang chiến dịch ra mắt sản phẩm mới trước Hội đồng đánh giá (Giám đốc Nhân sự và Trưởng nhóm Thiết kế).',
      kpi: 'Điểm đánh giá hội đồng đạt tối thiểu 8.0/10 để kết thúc lộ trình PIP thành công.',
      status: 'upcoming',
    },
  ];

  return (
    <AppleModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Kế hoạch Cải thiện Hiệu suất (PIP 30 ngày)</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Lộ trình 4 tuần
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Đồng hành phát triển năng lực cá nhân hóa theo định hướng chuẩn hóa hiệu suất tổ chức
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

        {/* Employee Info Strip */}
        <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Avatar
              name="Vũ Mai Chi"
              id="NV-1003"
              size="md"
              shape="rounded"
            />
            <div>
              <div className="font-bold text-slate-900 text-sm">Vũ Mai Chi (NV-1003)</div>
              <p className="text-slate-500">Senior Designer • Phòng Marketing và Truyền thông</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-4">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Người hướng dẫn (Mentor):</span>
              <span className="font-semibold text-slate-800">Lê Minh Tuấn (UI/UX Lead)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Người giám sát (HRD):</span>
              <span className="font-semibold text-slate-800">Trần Mai Hương (HR Director)</span>
            </div>
          </div>
        </div>

        {/* 4-Week Milestone Timeline */}
        <div className="mt-5 space-y-3">
          <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Lộ trình chi tiết từng tuần và Tiêu chí nghiệm thu cốt lõi:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {weeks.map((w, idx) => (
              <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2 hover:border-blue-300 transition shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {w.week}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">Giai đoạn {idx + 1}/4</span>
                </div>
                <h5 className="font-bold text-xs text-slate-900 leading-snug">{w.title}</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed">{w.desc}</p>
                <div className="pt-2 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{w.kpi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {activated && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-center font-bold text-xs">
            ✓ Kế hoạch PIP 30 ngày đã được kích hoạt thành công! Bản thỏa thuận mục tiêu đã gửi tới email nhân viên và người hướng dẫn.
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold rounded-xl text-xs transition"
          >
            Đóng
          </button>
          <div className="flex items-center gap-2.5">
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition">
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              In Bản cam kết (PDF)
            </button>
            <button
              onClick={() => {
                setActivated(true);
                setTimeout(() => onClose(), 1500);
              }}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Kích hoạt Kế hoạch PIP 30 ngày
            </button>
          </div>
        </div>
      </div>
    </AppleModal>
  );
}
