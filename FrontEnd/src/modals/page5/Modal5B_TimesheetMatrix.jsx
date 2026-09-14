import React, { useState } from 'react';
import AppleModal from '../../components/motion/AppleModal';
import Avatar from '../../components/common/Avatar';
import { Calendar, Search, FileSpreadsheet, X, User } from 'lucide-react';
import { mockEmployees } from '../../data/mockEmployees';
import { useAuth } from '../../context/AuthContext';

export default function Modal5B_TimesheetMatrix({ isOpen, onClose }) {
  const { currentRole } = useAuth();
  const [selectedDept, setSelectedDept] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  const daysInMonth = 30; // Tháng 09/2026
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isStaff = currentRole?.key === 'EMPLOYEE';
  const isManager = currentRole?.key === 'LINE_MANAGER';
  const isHrOrCeo = currentRole?.key === 'CEO' || currentRole?.key === 'HR_DIRECTOR';

  // Generate simulated status for 30 days
  const getDayStatus = (day, empId) => {
    const isWeekend = day % 7 === 6 || day % 7 === 0;
    if (isWeekend) return { code: 'OFF', color: 'bg-slate-100 text-slate-400' };
    const hash = (empId.charCodeAt(3) || 7) + day;
    if (hash % 19 === 0) return { code: 'L', color: 'bg-amber-100 text-amber-800 font-bold' }; // Late
    if (hash % 23 === 0) return { code: 'P', color: 'bg-blue-100 text-blue-800 font-bold' }; // Leave
    return { code: '8.0', color: 'bg-emerald-50 text-emerald-700 font-semibold' }; // Full day
  };

  // Build employee list based on role
  let baseList = [];
  if (isStaff) {
    // Regular employee only sees themselves
    const me = mockEmployees.find(e => e.name === currentRole.name) || {
      id: 'NV-1024',
      name: currentRole.name,
      department: 'Kỹ thuật Phần mềm',
      role: currentRole.title,
      avatar: currentRole.avatar
    };
    baseList = [me];
  } else if (isManager) {
    // Line manager sees their department (20 staff), with themselves pinned on top
    const me = mockEmployees.find(e => e.name === currentRole.name) || {
      id: 'NV-1002',
      name: currentRole.name,
      department: 'Kỹ thuật Phần mềm',
      role: currentRole.title,
      avatar: currentRole.avatar
    };
    const team = mockEmployees.filter(e => e.name !== me.name && (e.department.includes('Phần mềm') || e.department.includes('Kỹ thuật')));
    baseList = [me, ...team];
  } else {
    // Cấp 1 (CEO) or Cấp 2A (HR Director): full company, with themselves pinned at row 1!
    const me = mockEmployees.find(e => e.name === currentRole.name) || {
      id: currentRole.key === 'CEO' ? 'NV-0001' : 'NV-0002',
      name: currentRole.name,
      department: currentRole.key === 'CEO' ? 'Ban Giám Đốc' : 'Phòng Quản Trị Nhân Sự',
      role: currentRole.title,
      avatar: currentRole.avatar
    };
    const others = mockEmployees.filter(e => e.name !== me.name);
    baseList = [me, ...others];
  }

  const filteredList = baseList.filter(emp => {
    if (isStaff) return true;
    const matchesDept = selectedDept === 'Tất cả' || emp.department === selectedDept;
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <AppleModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-6xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {isStaff 
                    ? 'Bảng chấm công chi tiết của tôi' 
                    : isManager 
                    ? 'Bảng chấm công bộ phận Kỹ thuật Phần mềm' 
                    : 'Bảng chấm công tổng hợp toàn công ty'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Tháng 09/2026
                </span>
                {isStaff && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Cá nhân
                  </span>
                )}
                {isManager && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                    Trưởng bộ phận ({filteredList.length} nhân sự)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Chu kỳ: 01/09/2026 - 30/09/2026 • Kỳ công chuẩn: 22 ngày công {isStaff ? '• 8.0 giờ/ngày' : isManager ? '• Giám sát & đối soát công nhân viên bộ phận kỹ thuật' : '• Dữ liệu đối soát tự động'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => alert('Đang xuất bảng chấm công (.xlsx)...')}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Xuất Excel (XLSX)
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter and stats ribbon (Only if not employee) */}
        {!isStaff ? (
          <div className="mt-4 flex flex-col lg:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm nhân viên, mã NV..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {isHrOrCeo ? (
                <select
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                  className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
                >
                  <option value="Tất cả">Tất cả phòng ban</option>
                  <option value="Kỹ thuật Phần mềm">Kỹ thuật Phần mềm</option>
                  <option value="Marketing và Truyền thông">Marketing và Truyền thông</option>
                  <option value="Tài chính Kế toán">Tài chính Kế toán</option>
                  <option value="Nhân sự và Vận hành">Nhân sự và Vận hành</option>
                </select>
              ) : isManager ? (
                <div className="bg-white border border-purple-200 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <span>Phòng: Kỹ thuật Phần mềm</span>
                </div>
              ) : null}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold flex items-center justify-center">8</span>
                Đủ công (8h)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-amber-100 text-amber-800 text-[9px] font-bold flex items-center justify-center">L</span>
                Đi muộn
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-blue-100 text-blue-800 text-[9px] font-bold flex items-center justify-center">P</span>
                Nghỉ phép
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-slate-200 text-slate-600 text-[9px] font-bold flex items-center justify-center">-</span>
                Nghỉ tuần
              </span>
            </div>
          </div>
        ) : (
          /* Employee summary bar */
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-xs">
            <div>
              <span className="text-slate-500 block">Số công thực tế:</span>
              <strong className="text-blue-700 text-sm">22 / 22 ngày</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Số lần đi muộn:</span>
              <strong className="text-emerald-700 text-sm">0 lần (100% chuẩn)</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Tổng giờ làm thêm OT:</span>
              <strong className="text-purple-700 text-sm">6.5 giờ</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Trạng thái kỳ công:</span>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                Đủ điều kiện nhận 100% lương
              </span>
            </div>
          </div>
        )}

        {/* Matrix Table with horizontal scroll */}
        <div className="mt-4 border border-slate-200 rounded-xl overflow-x-auto max-h-[50vh] custom-scrollbar shadow-xs">
          <table className="w-full text-left text-xs border-collapse min-w-[1200px]">
            <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 z-20 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 sticky left-0 bg-slate-100 z-30 min-w-[190px] shadow-sm">Nhân viên</th>
                <th className="py-2.5 px-2 text-center min-w-[110px]">Phòng ban</th>
                <th className="py-2.5 px-2 text-center bg-blue-50/50 font-bold text-blue-900">Tổng công</th>
                <th className="py-2.5 px-2 text-center bg-amber-50/50 font-bold text-amber-900">Muộn</th>
                <th className="py-2.5 px-2 text-center bg-emerald-50/50 font-bold text-emerald-900">OT (h)</th>
                {daysArray.map(day => (
                  <th key={day} className="py-2 px-1 text-center min-w-[28px] text-[11px] font-mono">
                    {day < 10 ? `0${day}` : day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((emp, index) => {
                const isMe = emp.name === currentRole?.name;
                const totalLate = isMe ? 0 : index % 3 === 0 ? 1 : 0;
                const totalOt = isMe ? 6.5 : index % 2 === 0 ? 4.5 : 0;

                return (
                  <tr 
                    key={emp.id || index} 
                    className={`transition ${isMe ? 'bg-blue-50/60 font-semibold' : 'hover:bg-slate-50/80'}`}
                  >
                    <td className={`py-2 px-3 sticky left-0 z-10 shadow-sm flex items-center gap-2 ${isMe ? 'bg-blue-50/90' : 'bg-white'}`}>
                      <Avatar src={emp.avatar} name={emp.name} id={emp.id} size="xs" shape="circle" />
                      <div className="truncate">
                        <div className="font-bold truncate text-[11px] flex items-center gap-1">
                          <span>{emp.name}</span>
                          {isMe && (
                            <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold">
                              Tôi
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">{emp.id}</div>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-center text-[10px] text-slate-500 whitespace-nowrap">{emp.department}</td>
                    <td className="py-2 px-2 text-center font-bold text-blue-700 bg-blue-50/20">22.0 / 22</td>
                    <td className="py-2 px-2 text-center font-semibold text-amber-700 bg-amber-50/20">{totalLate}</td>
                    <td className="py-2 px-2 text-center font-semibold text-emerald-700 bg-emerald-50/20">{totalOt}</td>
                    {daysArray.map(day => {
                      const st = getDayStatus(day, emp.id || 'NV-0001');
                      return (
                        <td key={day} className="py-1 px-0.5 text-center">
                          <span className={`inline-block w-6 py-0.5 rounded text-[10px] ${st.color}`}>
                            {st.code}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            {isStaff 
              ? 'Bảng chấm công cá nhân của bạn đã được kiểm duyệt hợp lệ cho kỳ lương Tháng 09/2026'
              : `Hiển thị ${filteredList.length} nhân sự • Dữ liệu chấm công đồng bộ từ hệ thống`}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </AppleModal>
  );
}
