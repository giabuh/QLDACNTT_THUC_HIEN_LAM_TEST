import React, { useState } from 'react';
import AppleModal from '../../components/motion/AppleModal';
import Avatar from '../../components/common/Avatar';
import { useModal } from '../../context/ModalContext';
import { 
  BarChart3, 
  Search, 
  Download, 
  Eye, 
  X, 
  Award, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2 
} from 'lucide-react';

export default function Modal8D_NineBoxDetail({ isOpen, onClose, payload }) {
  const { openModal } = useModal();
  const [searchTerm, setSearchTerm] = useState('');

  const box = payload || {
    title: 'Ngôi sao xuất sắc',
    count: 18,
    desc: 'Lãnh đạo tương lai và chuyên gia nòng cốt',
    tag: 'Quy hoạch kế cận',
    color: 'bg-emerald-50/80 border-emerald-200'
  };

  const sampleMembers = [
    {
      id: 'NV-0845',
      name: 'Hoàng Văn Long',
      role: 'Senior Backend Lead',
      department: 'Phòng Kỹ thuật Phần mềm',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      kpiScore: 94.5,
      potential: 'Rất cao (A+)',
      recommendation: 'Đề bạt vị trí Technical Architect trong Q4/2026',
    },
    {
      id: 'NV-1002',
      name: 'Trần Đình Trọng',
      role: 'Trưởng phòng Kỹ thuật Phần mềm',
      department: 'Phòng Kỹ thuật Phần mềm',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      kpiScore: 92.8,
      potential: 'Lãnh đạo xuất sắc',
      recommendation: 'Tham gia chương trình bồi dưỡng Giám đốc Công nghệ (CTO)',
    },
    {
      id: 'NV-1004',
      name: 'Nguyễn Thị Hà',
      role: 'Chuyên viên Phân tích Dữ liệu',
      department: 'Phòng Kỹ thuật Phần mềm',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      kpiScore: 91.2,
      potential: 'Tiềm năng cao',
      recommendation: 'Giao phụ trách dự án Data Lakehouse toàn viện',
    },
    {
      id: 'NV-0842',
      name: 'Phạm Minh Quân',
      role: 'Kỹ sư Phần mềm Fullstack',
      department: 'Phòng Kỹ thuật Phần mềm',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      kpiScore: 88.5,
      potential: 'Phát triển nhanh',
      recommendation: 'Cử tham gia hội thảo quốc tế Cloud Native Computing',
    }
  ];

  const filteredMembers = sampleMembers.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppleModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Chi Tiết Phân Nhóm: {box.title}
                </h3>
                <span className="bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                  {box.count} nhân sự
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {box.desc} • Định hướng: <strong className="text-slate-800 font-semibold">{box.tag}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm nhân sự theo tên, mã NV..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert(`Đã xuất danh sách nhân sự phân nhóm ${box.title} định dạng Excel`)}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Xuất danh sách Excel</span>
            </button>
          </div>
        </div>

        {/* Members Table */}
        <div className="mt-4 border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Nhân sự</th>
                  <th className="py-3 px-4">Mã NV</th>
                  <th className="py-3 px-4">Chức vụ & Phòng ban</th>
                  <th className="py-3 px-4">Điểm KPI</th>
                  <th className="py-3 px-4">Đánh giá tiềm năng</th>
                  <th className="py-3 px-4">Lộ trình khuyến nghị</th>
                  <th className="py-3 px-4 text-right">Tác vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={emp.avatar} name={emp.name} id={emp.id} size="sm" shape="circle" />
                        <span className="font-bold text-slate-900">{emp.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-600">
                      {emp.id}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="font-medium text-slate-800">{emp.role}</div>
                      <div className="text-[10px] text-slate-400">{emp.department}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {emp.kpiScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                        {emp.potential}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {emp.recommendation}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          openModal('modal4B', emp);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Xem Hồ sơ 360"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Dữ liệu đánh giá chu kỳ Q2/2026 • Phân loại bởi mô hình chuẩn 9-Box</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </AppleModal>
  );
}
