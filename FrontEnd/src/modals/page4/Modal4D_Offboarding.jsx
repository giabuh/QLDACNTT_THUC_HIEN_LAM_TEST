import React, { useState } from 'react';
import AppleModal from '../../components/motion/AppleModal';
import { UserX, CheckSquare, Square, Laptop, Key, CreditCard, ShieldAlert, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Modal4D_Offboarding({ isOpen, onClose, payload }) {
  const emp = payload || {
    id: "NV-1003",
    name: "Vũ Mai Chi",
    role: "Senior Designer",
    department: "Marketing và Truyền thông"
  };

  const [checks, setChecks] = useState({
    laptop: false,
    badge: false,
    googleAccount: false,
    bhxh: false,
    finalSalary: false
  });

  const [successor, setSuccessor] = useState('Hoàng Quốc Bảo');
  const [completed, setCompleted] = useState(false);

  const toggleCheck = (key) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecked = Object.values(checks).every(Boolean);

  const handleConfirm = () => {
    setCompleted(true);
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}
    setTimeout(() => {
      setCompleted(false);
      onClose();
    }, 1500);
  };

  return (
    <AppleModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Quy trình Thôi việc và Bàn giao Tài sản: ${emp.name}`}
      subtitle={`Mã NV: ${emp.id} • ${emp.role} (${emp.department})`}
      badge={
        <span className="bg-rose-50 text-rose-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
          <UserX className="w-3.5 h-3.5" />
          Offboarding Checklist
        </span>
      }
      maxWidth="max-w-2xl"
    >
      <div className="p-6 space-y-4 text-xs">
        {/* Warning Callout */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Tuân thủ thủ tục chấm dứt hợp đồng lao động:</span>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Vui lòng tích chọn đầy đủ các hạng mục tài sản và thu hồi quyền truy cập trước khi xuất quyết định thôi việc và chốt sổ BHXH.
            </p>
          </div>
        </div>

        {/* Handover Assignee */}
        <div>
          <label className="font-bold text-slate-700 block mb-1">
            Nhân sự tiếp nhận bàn giao công việc chính *
          </label>
          <select
            value={successor}
            onChange={(e) => setSuccessor(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white"
          >
            <option value="Hoàng Quốc Bảo">Hoàng Quốc Bảo (Kỹ sư UI/UX - NV-1014)</option>
            <option value="Trần Đình Trọng">Trần Đình Trọng (Team Lead - NV-1002)</option>
            <option value="Đỗ Quốc Việt">Đỗ Quốc Việt (HR Officer - NV-1022)</option>
          </select>
        </div>

        {/* Asset & Security Checklist */}
        <div className="space-y-2 border border-slate-200 rounded-2xl p-4 bg-white shadow-2xs">
          <h3 className="font-bold text-slate-900 uppercase text-[11px] mb-2">
            Danh mục bàn giao trang thiết bị và Quyền hạn:
          </h3>

          <div
            onClick={() => toggleCheck('laptop')}
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Laptop className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-800">
                Thu hồi Máy tính MacBook Pro M2 và Thiết bị sạc cáp
              </span>
            </div>
            {checks.laptop ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5 text-slate-300" />}
          </div>

          <div
            onClick={() => toggleCheck('badge')}
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Key className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-800">
                Thu hồi Thẻ nhân viên vật lý và Hủy quyền điểm danh khuôn mặt cổng
              </span>
            </div>
            {checks.badge ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5 text-slate-300" />}
          </div>

          <div
            onClick={() => toggleCheck('googleAccount')}
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-800">
                Khóa tài khoản Google Workspace, Slack và VPN công ty
              </span>
            </div>
            {checks.googleAccount ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5 text-slate-300" />}
          </div>

          <div
            onClick={() => toggleCheck('bhxh')}
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-800">
                Báo giảm lao động và hoàn tất thủ tục chốt sổ BHXH
              </span>
            </div>
            {checks.bhxh ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5 text-slate-300" />}
          </div>

          <div
            onClick={() => toggleCheck('finalSalary')}
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-800">
                Quyết toán lương những ngày làm việc cuối và Phép năm tồn đọng
              </span>
            </div>
            {checks.finalSalary ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5 text-slate-300" />}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-colors cursor-pointer"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={!allChecked || completed}
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {completed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Đã xác nhận hoàn tất thôi việc!</span>
              </>
            ) : (
              <>
                <UserX className="w-4 h-4" />
                <span>Xác nhận hoàn tất bàn giao và Thôi việc</span>
              </>
            )}
          </button>
        </div>
      </div>
    </AppleModal>
  );
}
