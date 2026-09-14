import React, { useState } from 'react';
import AppleModal from '../../components/motion/AppleModal';
import Avatar from '../../components/common/Avatar';
import { AVATAR_SEEDS } from '../../utils/avatarUtils';
import { Search, Download, RefreshCw, DoorOpen, CheckCircle2, Clock } from 'lucide-react';

const mockLiveLogs = [
  {
    id: "NV-1008",
    name: "Nguyễn Văn Tuấn",
    role: "Kỹ sư Cầu nối BrSE",
    dept: "Kỹ thuật Phần mềm",
    time: "08:01:12 AM",
    gate: "Cổng A1",
    match: "99.8%",
    status: "Đúng giờ",
    photo: AVATAR_SEEDS.MALE_3
  },
  {
    id: "NV-1003",
    name: "Trần Bích Thảo",
    role: "Chuyên viên Truyền thông",
    dept: "Marketing và Truyền thông",
    time: "08:14:05 AM",
    gate: "Cổng A2",
    match: "99.4%",
    status: "Trễ 14p",
    photo: AVATAR_SEEDS.FEMALE_3
  },
  {
    id: "NV-1015",
    name: "Lê Hoàng Nam",
    role: "Kế toán viên Thuế",
    dept: "Tài chính Kế toán",
    time: "08:00:20 AM",
    gate: "Cổng A1",
    match: "99.7%",
    status: "Đúng giờ",
    photo: AVATAR_SEEDS.MALE_1
  },
  {
    id: "NV-1022",
    name: "Đỗ Quốc Việt",
    role: "Chuyên viên Tuyển dụng",
    dept: "Nhân sự và Vận hành",
    time: "07:55:40 AM",
    gate: "Cổng A1",
    match: "99.9%",
    status: "Đúng giờ",
    photo: AVATAR_SEEDS.MALE_2
  },
  {
    id: "NV-1035",
    name: "Hoàng Minh Châu",
    role: "Product Designer",
    dept: "Phát triển Sản phẩm",
    time: "08:04:19 AM",
    gate: "Cổng B1",
    match: "99.6%",
    status: "Đúng giờ",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "NV-1042",
    name: "Đặng Văn Hùng",
    role: "Kỹ sư DevOps",
    dept: "Kỹ thuật Hạ tầng",
    time: "08:38:12 AM",
    gate: "Cổng B1",
    match: "99.1%",
    status: "Trễ 38p",
    photo: AVATAR_SEEDS.FEMALE_2
  }
];

export default function Modal2C_LiveLogs({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [gateFilter, setGateFilter] = useState('all');

  const filteredLogs = mockLiveLogs.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.dept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGate = gateFilter === 'all' || item.gate === gateFilter;
    return matchesSearch && matchesGate;
  });

  return (
    <AppleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Nhật ký chấm công thời gian thực trong ngày"
      subtitle="Thứ Hai, 12/09/2026 • Tự động đồng bộ từ 4 trạm Kiosk AI Face ID và Cổng Barrier"
      badge={
        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          328 lượt ghi nhận
        </span>
      }
      maxWidth="max-w-5xl"
    >
      <div className="p-6 space-y-4">
        {/* Toolbar Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mã NV, tên, phòng ban..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={gateFilter}
              onChange={(e) => setGateFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="all">Tất cả cổng (A1, A2, B1)</option>
              <option value="Cổng A1">Cổng A1</option>
              <option value="Cổng A2">Cổng A2</option>
              <option value="Cổng B1">Cổng B1</option>
            </select>

            <button
              type="button"
              onClick={() => alert('Đang xuất 328 bản ghi chấm công ra file Excel...')}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Xuất Excel</span>
            </button>
          </div>
        </div>

        {/* High-density Data Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Ảnh nhận diện cổng</th>
                <th className="py-2.5 px-3">Mã NV</th>
                <th className="py-2.5 px-3">Nhân viên và Chức danh</th>
                <th className="py-2.5 px-3">Phòng ban</th>
                <th className="py-2.5 px-3">Thời gian</th>
                <th className="py-2.5 px-3">Cổng check-in</th>
                <th className="py-2.5 px-3 text-center">Độ khớp khuôn mặt</th>
                <th className="py-2.5 px-3 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id + log.time} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3">
                    <Avatar
                      src={log.photo}
                      name={log.name}
                      id={log.id}
                      size="sm"
                      shape="rounded"
                    />
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-600">
                    {log.id}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900">{log.name}</div>
                    <div className="text-[11px] text-slate-400">{log.role}</div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {log.dept}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-800 font-semibold">
                    {log.time}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 font-medium">
                    {log.gate}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-600">
                    {log.match}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        log.status.includes('Trễ')
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-3 flex items-center justify-between text-xs text-slate-500">
          <span>Camera tự động ghi log sau mỗi 200ms khi có nhận diện khuôn mặt hợp lệ.</span>
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
