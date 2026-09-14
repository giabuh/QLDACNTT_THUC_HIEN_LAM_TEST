import React, { useState } from 'react';
import AppleModal from '../../components/motion/AppleModal';
import { UserPlus, CheckCircle2, ShieldCheck, Mail, Key, User, Camera, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Modal4A_Onboarding({ isOpen, onClose }) {
  const [step, setStep] = useState(2);
  const [fullName, setFullName] = useState('Lê Thị Thu Thủy');
  const [dob, setDob] = useState('12/04/1998');
  const [gender, setGender] = useState('Nữ');
  const [cccd, setCccd] = useState('079198001234');
  const [department, setDepartment] = useState('Kỹ thuật Phần mềm');
  const [role, setRole] = useState('Product Designer / UI-UX');
  const [contractType, setContractType] = useState('Thử việc 02 tháng');
  const [salary, setSalary] = useState('22000000');
  const [assignedRole, setAssignedRole] = useState('employee');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (err) {}
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <AppleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tiếp nhận nhân sự mới và Cấp tài khoản"
      subtitle="Hệ thống tự động đồng bộ mã nhân viên NV-1007 và email doanh nghiệp"
      badge={
        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
          Quy trình Onboarding 2026
        </span>
      }
      maxWidth="max-w-3xl"
    >
      <div className="p-6 space-y-5">
        {/* Step Tracker */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-700 font-bold">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
            <span>1. Hồ sơ và Hợp đồng</span>
          </div>
          <div className="flex-1 mx-3 h-[2px] bg-slate-200" />
          <div className="flex items-center gap-2 text-blue-700 font-bold">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] ring-2 ring-blue-100">2</span>
            <span>2. Cấp tài khoản và Quyền</span>
          </div>
          <div className="flex-1 mx-3 h-[2px] bg-slate-200" />
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <span className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 flex items-center justify-center text-[10px] bg-white">3</span>
            <span>3. Face ID Cổng</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Section 1: Core info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
                I. Thông tin cá nhân và Hợp đồng
              </span>
              <span className="text-slate-400 italic text-[11px]">Tự động trích xuất từ tuyển dụng</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Họ và tên nhân sự *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ngày sinh</label>
                  <input
                    type="text"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-center focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Giới tính</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                  >
                    <option>Nữ</option>
                    <option>Nam</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Số CCCD</label>
                  <input
                    type="text"
                    value={cccd}
                    onChange={(e) => setCccd(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phòng ban trực thuộc *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white"
                >
                  <option value="Kỹ thuật Phần mềm">Kỹ thuật Phần mềm (Engineering)</option>
                  <option value="Marketing và Truyền thông">Marketing và Truyền thông</option>
                  <option value="Tài chính Kế toán">Tài chính Kế toán</option>
                  <option value="Nhân sự và Vận hành">Nhân sự và Vận hành</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Chức danh công việc *</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Loại hợp đồng ký kết</label>
                <select
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                >
                  <option>Hợp đồng thử việc 02 tháng</option>
                  <option>Hợp đồng không xác định thời hạn</option>
                  <option>Hợp đồng có thời hạn 12 tháng</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Lương thỏa thuận (Gross)</label>
                <input
                  type="text"
                  value={Number(salary).toLocaleString('vi-VN') + ' đ'}
                  onChange={(e) => setSalary(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Account Provisioning */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
            <div className="flex items-center gap-2 font-bold text-blue-900 text-xs uppercase tracking-wider">
              <Key className="w-4 h-4 text-blue-600" />
              <span>II. Thông tin tài khoản hệ thống (Tự động khởi tạo)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Mã nhân viên tự sinh:</label>
                <span className="bg-blue-100 text-blue-800 font-mono font-bold px-3 py-1.5 rounded-lg border border-blue-200 block text-center">
                  NV-1007
                </span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Email doanh nghiệp được cấp:</label>
                <input
                  type="email"
                  defaultValue="thuy.lt@nexus.vn"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Phân quyền vai trò:</label>
                <select
                  value={assignedRole}
                  onChange={(e) => setAssignedRole(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                >
                  <option value="employee">👤 Nhân viên ESS</option>
                  <option value="manager">🛡️ Trưởng nhóm / Lead</option>
                  <option value="admin">⚙️ Quản trị viên HR</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <span className="text-slate-400 text-[11px]">Thông tin sẽ được gửi mật khẩu ngẫu nhiên qua email nhân viên</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={submitted}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                {submitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Đã tạo hồ sơ và Cấp tài khoản!</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Hoàn tất và Cấp tài khoản</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppleModal>
  );
}
