import React, { useState } from 'react';
import AppleModal from '../../components/motion/AppleModal';
import Avatar from '../../components/common/Avatar';
import { AVATAR_SEEDS } from '../../utils/avatarUtils';
import { Search, Clock, Send, CheckCircle2, AlertTriangle, User } from 'lucide-react';
import confetti from 'canvas-confetti';

const mockLateEmployees = [
  {
    id: "NV-1003",
    name: "Trần Bích Thảo",
    department: "Phòng Marketing và Truyền thông",
    gate: "Cổng A2",
    time: "08:14 AM",
    lateMinutes: 14,
    reason: "Quẹt thẻ cổng A2 ghi nhận",
    avatar: AVATAR_SEEDS.FEMALE_3
  },
  {
    id: "NV-1028",
    name: "Nguyễn Văn Nam",
    department: "Phòng Kỹ thuật Phần mềm",
    gate: "Cổng A1",
    time: "08:25 AM",
    lateMinutes: 25,
    reason: "Kẹt xe cầu vượt Ngã Tư Sở",
    avatar: AVATAR_SEEDS.MALE_3
  },
  {
    id: "NV-1042",
    name: "Đặng Văn Hùng",
    department: "Phòng Kỹ thuật Hạ tầng",
    gate: "Cổng B1",
    time: "08:38 AM",
    lateMinutes: 38,
    reason: "Cần giải trình: Trễ > 30 phút",
    avatar: AVATAR_SEEDS.MALE_2
  },
  {
    id: "NV-1055",
    name: "Lê Thùy Dung",
    department: "Tài chính Kế toán",
    gate: "Cổng A1",
    time: "08:18 AM",
    lateMinutes: 18,
    reason: "Đưa con đi học",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "NV-1061",
    name: "Phạm Quốc Hưng",
    department: "Kinh doanh và Khách hàng doanh nghiệp",
    gate: "Cổng A2",
    time: "08:22 AM",
    lateMinutes: 22,
    reason: "Hỏng xe máy dọc đường",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  }
];

export default function Modal2A_LateAbsence({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [remindedIds, setRemindedIds] = useState([]);

  const handleSendReminder = (id) => {
    setRemindedIds((prev) => [...prev, id]);
    try {
      confetti({ particleCount: 30, spread: 45, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const filteredList = mockLateEmployees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết Danh sách Đi trễ và Vắng mặt hôm nay"
      subtitle="Khung giờ chuẩn: 08:00 - 08:15 • Ghi nhận tự động từ hệ thống điểm danh cổng"
      badge={
        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
          14 trường hợp
        </span>
      }
      maxWidth="max-w-3xl"
    >
      <div className="p-6 space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, mã NV, phòng ban..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-end">
            <span className="text-slate-500">
              Đã gửi nhắc nhở: <strong className="text-amber-700">{remindedIds.length} nhân viên</strong>
            </span>
          </div>
        </div>

        {/* List of Late Employees */}
        <div className="space-y-3">
          {filteredList.map((emp) => (
            <div
              key={emp.id}
              className={`border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs transition-all ${
                emp.lateMinutes >= 30
                  ? 'bg-rose-50/40 border-rose-200'
                  : 'bg-white border-slate-200/90 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={emp.avatar}
                  name={emp.name}
                  id={emp.id}
                  size="md"
                  shape="circle"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{emp.name}</span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {emp.id}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <span>{emp.department}</span>
                    <span>•</span>
                    <span className="text-slate-700 font-semibold">{emp.gate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-between sm:justify-end">
                <div className="text-left sm:text-right">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-amber-700">{emp.time}</span>
                    <span
                      className={`font-bold text-[11px] px-2 py-0.5 rounded-full border ${
                        emp.lateMinutes >= 30
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}
                    >
                      Trễ {emp.lateMinutes} phút
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{emp.reason}</div>
                </div>

                <div className="shrink-0">
                  {remindedIds.includes(emp.id) ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Đã gửi
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendReminder(emp.id)}
                      className="flex items-center gap-1.5 text-xs bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi nhắc nhở</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Quy định công ty: Đi trễ &gt; 15 phút sẽ trừ 0.25 công hoặc yêu cầu bù giờ cuối ca.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </AppleModal>
  );
}
