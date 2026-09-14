import React, { useState } from 'react';
import AppleModal from '../../components/motion/AppleModal';
import Avatar from '../../components/common/Avatar';
import { AlertOctagon, TrendingUp, DollarSign, Clock, Target, CheckCircle2, UserCheck, Calendar, X, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Modal8A_TurnoverRisk({ isOpen, onClose, payload }) {
  const [actions, setActions] = useState({
    salaryRaise: true,
    rolePromotion: true,
    stayInterview: true,
  });
  const [confirmed, setConfirmed] = useState(false);

  const toggleAction = key => {
    setActions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AppleModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Chi tiết Nguy cơ Biến động Nhân sự và Kế hoạch Giữ chân</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 uppercase">
                  Mức báo động đỏ
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Hệ thống phân tích dự báo biến động nhân tài và tỷ lệ lưu giữ
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

        {/* Employee Snapshot & Big Risk Gauge */}
        <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Avatar
              name="Hoàng Văn Long"
              id="NV-0845"
              size="xl"
              shape="rounded"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">Hoàng Văn Long</h4>
                <span className="font-mono text-xs text-slate-400">NV-0845</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">Senior Backend Tech Lead • Phòng Kỹ thuật Phần mềm</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Thâm niên: 3.2 năm • Xếp loại hiệu suất: 9-Box Ngôi sao (Star)</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-rose-200 shadow-xs">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Xác suất rời bỏ (30 ngày)</span>
              <span className="text-2xl font-black text-rose-600 font-mono">84.2%</span>
            </div>
            <div className="w-3 h-10 bg-rose-500 rounded-full animate-pulse" />
          </div>
        </div>

        {/* 3 AI Root Causes */}
        <div className="mt-5 space-y-2.5">
          <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            3 Nguyên nhân gốc rễ ghi nhận từ dữ liệu hiệu suất và thâm niên:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
              <div className="text-slate-500 font-medium flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-rose-500" />
                Mức lương thị trường
              </div>
              <div className="font-bold text-rose-700 text-xs">-18% so với ngành</div>
              <p className="text-[11px] text-slate-500">Mức lương 38tr hiện thấp hơn mức chuẩn 45tr cho vị trí Golang Lead.</p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
              <div className="text-slate-500 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Áp lực giờ làm OT
              </div>
              <div className="font-bold text-amber-700 text-xs">+65% giờ OT Q3</div>
              <p className="text-[11px] text-slate-500">28 giờ làm thêm/tháng, chỉ số mệt mỏi công việc tăng cao.</p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
              <div className="text-slate-500 font-medium flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-blue-500" />
                Lộ trình thăng tiến
              </div>
              <div className="font-bold text-blue-700 text-xs">22 tháng cùng vị trí</div>
              <p className="text-[11px] text-slate-500">Chưa có quyết định bổ nhiệm lên Principal/Architect.</p>
            </div>
          </div>
        </div>

        {/* Action Checklist */}
        <div className="mt-5 space-y-2 text-xs">
          <div className="font-bold text-slate-800">Gói giải pháp can thiệp giữ chân nhân tài (Retention Action Plan):</div>

          <label
            onClick={() => toggleAction('salaryRaise')}
            className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
              actions.salaryRaise ? 'bg-blue-50/60 border-blue-300' : 'bg-white border-slate-200'
            }`}
          >
            <input type="checkbox" checked={actions.salaryRaise} readOnly className="w-4 h-4 text-blue-600 rounded" />
            <div>
              <span className="font-bold text-slate-900">1. Điều chỉnh tăng lương sớm +15% (Lên mức 43.700.000 đ)</span>
              <p className="text-[11px] text-slate-500">Bù đắp chênh lệch thị trường, áp dụng ngay từ chu kỳ Tháng 10/2026.</p>
            </div>
          </label>

          <label
            onClick={() => toggleAction('rolePromotion')}
            className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
              actions.rolePromotion ? 'bg-blue-50/60 border-blue-300' : 'bg-white border-slate-200'
            }`}
          >
            <input type="checkbox" checked={actions.rolePromotion} readOnly className="w-4 h-4 text-blue-600 rounded" />
            <div>
              <span className="font-bold text-slate-900">2. Bổ nhiệm vai trò Kiến trúc sư Kỹ thuật và Giảm tải làm thêm giờ</span>
              <p className="text-[11px] text-slate-500">Chuyển giao việc trực ca đêm cho kỹ sư phụ trách khác, tập trung thiết kế kiến trúc.</p>
            </div>
          </label>

          <label
            onClick={() => toggleAction('stayInterview')}
            className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
              actions.stayInterview ? 'bg-blue-50/60 border-blue-300' : 'bg-white border-slate-200'
            }`}
          >
            <input type="checkbox" checked={actions.stayInterview} readOnly className="w-4 h-4 text-blue-600 rounded" />
            <div>
              <span className="font-bold text-slate-900">3. Lên lịch phỏng vấn giữ chân (Stay Interview 1-on-1) cùng CTO</span>
              <p className="text-[11px] text-slate-500">Thời gian đề xuất: 15:00 Thứ Hai (14/09/2026) tại Phòng họp VIP 2.</p>
            </div>
          </label>
        </div>

        {confirmed && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-center font-bold text-xs">
            ✓ Đã phê duyệt kế hoạch giữ chân nhân sự và gửi thông báo lịch phỏng vấn đến Giám đốc Kỹ thuật và Ban Giám đốc!
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold rounded-xl text-xs transition"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              setConfirmed(true);
              setTimeout(() => onClose(), 1500);
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Phê duyệt và Kích hoạt Kế hoạch Giữ chân
          </button>
        </div>
      </div>
    </AppleModal>
  );
}
