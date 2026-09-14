import React, { useState } from 'react';
import AppleModal from '../../components/motion/AppleModal';
import Avatar from '../../components/common/Avatar';
import { AVATAR_SEEDS } from '../../utils/avatarUtils';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  CreditCard, 
  Award, 
  Clock, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Printer, 
  Edit,
  Eye,
  Download,
  Upload
} from 'lucide-react';
import Modal4G_ContractPdfPreview from './Modal4G_ContractPdfPreview';
import { useAuth } from '../../context/AuthContext';

export default function Modal4B_Profile360({ isOpen, onClose, payload }) {
  const { currentRole } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [isContractPdfOpen, setIsContractPdfOpen] = useState(false);

  const emp = payload || {
    id: "NV-1002",
    name: "Trần Đình Trọng",
    role: "Trưởng nhóm DevOps và Hạ tầng đám mây",
    department: "Kỹ thuật Phần mềm",
    email: "trong.td@nexus.vn",
    phone: "0909 112 233",
    avatar: AVATAR_SEEDS.LEAD,
    contractSalary: 38000000,
    kpiScore: 98.5,
    attendanceRate: 100,
    leaveBalance: 11.0,
    cccd: "079192005678",
    bankAccount: "0071 9384 11",
    bankName: "Vietcombank"
  };

  const isStaff = currentRole?.key === 'EMPLOYEE';
  const isManager = currentRole?.key === 'LINE_MANAGER';
  const isSelf = emp?.id === currentRole?.id;
  const isRestrictedPeer = isStaff && !isSelf;
  const isRestrictedManager = isManager && !isSelf;
  const canViewConfidential = currentRole?.key === 'HR_DIRECTOR' || currentRole?.key === 'CEO' || isSelf;

  return (
    <AppleModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isRestrictedPeer
          ? `Thông tin đồng nghiệp: ${emp.name}`
          : isRestrictedManager
          ? `Hồ sơ nhân sự bộ phận: ${emp.name}`
          : `Hồ sơ nhân sự: ${emp.name}`
      }
      subtitle={
        !canViewConfidential
          ? `Mã nhân sự: ${emp.id} • ${emp.department}`
          : `Mã nhân viên: ${emp.id} • Dữ liệu xác thực thông tin và Hợp đồng lao động chính thức`
      }
      badge={
        !canViewConfidential ? (
          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Đang làm việc tại văn phòng
          </span>
        ) : (
          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Đã xác thực eKYC
          </span>
        )
      }
      maxWidth="max-w-4xl"
    >
      <div className="p-6 space-y-6">
        {/* Profile Banner */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar
                src={emp.avatar}
                name={emp.name}
                id={emp.id}
                size="2xl"
                shape="rounded"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full ring-2 ring-white flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900 font-display">{emp.name}</h2>
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  {emp.id}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Chính thức
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-600 mt-1">
                {emp.role} • {emp.department}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-700 font-medium">{emp.email}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-700 font-medium">{emp.phone || '0912 345 678'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick stats in banner */}
          {/* Quick stats in banner */}
          {isRestrictedPeer ? (
            <div className="flex items-center gap-2 self-start md:self-center">
              <div className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-100 text-center">
                <div className="text-[10px] font-bold uppercase text-blue-500">Khối chuyên môn</div>
                <div className="text-xs font-bold text-blue-700 mt-0.5 font-display">Kỹ thuật & Phát triển Phần mềm</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 self-start md:self-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center min-w-[90px]">
                <div className="text-[10px] font-bold uppercase text-slate-400">KPI T9</div>
                <div className="text-base font-bold text-emerald-600 font-display">{emp.kpiScore}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center min-w-[90px]">
                <div className="text-[10px] font-bold uppercase text-slate-400">Chuyên cần</div>
                <div className="text-base font-bold text-blue-600 font-display">{emp.attendanceRate || 98.5}%</div>
              </div>
            </div>
          )}
        </div>

        {/* Khung nội dung chi tiết */}
        {isRestrictedPeer ? (
          /* Chế độ xem đồng nghiệp: Chỉ hiển thị vị trí công tác & thông tin liên hệ công việc */
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vị trí và Bộ phận công tác */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/90 space-y-3">
                <h3 className="font-bold text-slate-900 uppercase text-[11px] pb-1 border-b border-slate-100 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                  <span>Vị trí công tác & Phân công nhiệm vụ</span>
                </h3>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Phòng ban:</span>
                    <span className="font-semibold text-slate-800">{emp.department || 'Kỹ thuật Phần mềm'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Vị trí đảm nhiệm:</span>
                    <span className="font-semibold text-blue-700">{emp.role}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Nhóm dự án / Squad:</span>
                    <span className="text-slate-800 font-medium">Core Platform & Infrastructure</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Quản lý trực tiếp:</span>
                    <span className="text-slate-800 font-semibold">Vũ Đình Khang (Trưởng phòng)</span>
                  </div>
                </div>
              </div>

              {/* Thông tin liên hệ công việc nội bộ */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/90 space-y-3">
                <h3 className="font-bold text-slate-900 uppercase text-[11px] pb-1 border-b border-slate-100 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Thông tin liên hệ công vụ nội bộ</span>
                </h3>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Hòm thư nội bộ:</span>
                    <span className="font-mono font-semibold text-slate-800">{emp.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Số máy lẻ nội bộ:</span>
                    <span className="font-mono text-slate-800 font-semibold">Ext: #1042</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Vị trí chỗ ngồi:</span>
                    <span className="text-slate-800 font-medium">Khu B - Tầng 4, Tòa nhà Nexus</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Giờ làm việc:</span>
                    <span className="text-emerald-700 font-semibold">08:00 - 17:30 (Thứ 2 - Thứ 6)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông báo bảo mật thông tin nhân sự */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 text-slate-600 text-xs">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Dữ liệu lý lịch nhân thân, số CCCD, chế độ tiền lương và đánh giá KPI cá nhân được bảo mật theo Quy chế bảo vệ thông tin nội bộ của Doanh nghiệp.
              </span>
            </div>
          </div>
        ) : isRestrictedManager ? (
          /* Chế độ xem của Trưởng phòng: Không được xem CCCD/nhân thân hay lương thưởng, chỉ xem công tác & đánh giá hiệu suất */
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vị trí công tác */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/90 space-y-3">
                <h3 className="font-bold text-slate-900 uppercase text-[11px] pb-1 border-b border-slate-100 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                  <span>Vị trí công tác & Phân bổ nhiệm vụ</span>
                </h3>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Phòng ban:</span>
                    <span className="font-semibold text-slate-800">{emp.department || 'Kỹ thuật Phần mềm'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Chức danh chuyên môn:</span>
                    <span className="font-semibold text-blue-700">{emp.role}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Số ngày phép năm còn lại:</span>
                    <span className="font-bold text-emerald-700 font-mono">{emp.leaveBalance || 9.5} ngày</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Hòm thư điện tử:</span>
                    <span className="font-mono text-slate-800">{emp.email}</span>
                  </div>
                </div>
              </div>

              {/* Đánh giá hiệu suất nhân sự (Trưởng phòng có thẩm quyền xem & đánh giá) */}
              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-purple-200">
                  <Award className="w-4 h-4 text-purple-600" />
                  <h3 className="font-bold text-purple-900 uppercase text-[11px]">
                    Đánh giá hiệu suất & KPI (Mô hình 9-Box)
                  </h3>
                </div>
                <div className="space-y-1.5 text-purple-900">
                  <div className="flex justify-between">
                    <span>Điểm KPI Tháng 09/2026:</span>
                    <span className="font-bold font-mono text-emerald-700">{emp.kpiScore}% (Xuất sắc)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tỷ lệ chuyên cần tháng:</span>
                    <span className="font-bold font-mono text-blue-700">{emp.attendanceRate || 100}%</span>
                  </div>
                  <p className="text-[11px] text-purple-800 italic pt-1 border-t border-purple-200/60">
                    Phân nhóm: <strong>Ngôi sao tiềm năng (Superstar)</strong>. Đề xuất Trưởng phòng quy hoạch vào dự án trọng điểm Quý IV/2026.
                  </p>
                </div>
              </div>
            </div>

            {/* Thông báo bảo mật thông tin nhân thân và tiền lương đối với Trưởng phòng */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-amber-900 text-xs">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Theo Quy chế bảo mật dữ liệu doanh nghiệp, thông tin lý lịch nhân thân (CCCD, địa chỉ cư trú, bảo hiểm) và hợp đồng lương thưởng được bảo mật, chỉ dành riêng cho Khối Quản Trị Nhân Sự (HR) và Ban Giám Đốc.
              </span>
            </div>
          </div>
        ) : (
          /* Chế độ xem toàn quyền: HR Director / CEO / Cá nhân xem hồ sơ của chính mình */
          <>
            {/* Tab Selection */}
            <div className="flex gap-4 border-b border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className={`pb-2.5 border-b-2 transition-colors ${
                  activeTab === 'info'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                Lý lịch và Nhân thân
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('salary')}
                className={`pb-2.5 border-b-2 transition-colors ${
                  activeTab === 'salary'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                Hợp đồng và Lương thưởng
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('kpi')}
                className={`pb-2.5 border-b-2 transition-colors ${
                  activeTab === 'kpi'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                Lịch sử KPI và Đánh giá hiệu suất
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'info' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white border border-slate-200/90 space-y-3">
                  <h3 className="font-bold text-slate-900 uppercase text-[11px] pb-1 border-b border-slate-100">
                    Thông tin cá nhân
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Số CCCD:</span>
                      <span className="font-mono font-bold text-slate-800">{emp.cccd || '079198001234'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ngày cấp:</span>
                      <span className="text-slate-800 font-medium">10/02/2021 (Cục CSQLHC)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Quê quán:</span>
                      <span className="text-slate-800 font-medium">TP. Hà Nội</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Địa chỉ thường trú:</span>
                      <span className="text-slate-800 font-medium text-right max-w-[200px]">Cầu Giấy, Hà Nội</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200/90 space-y-3">
                  <h3 className="font-bold text-slate-900 uppercase text-[11px] pb-1 border-b border-slate-100">
                    Chế độ Bảo hiểm và Thuế
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mã số BHXH:</span>
                      <span className="font-mono font-bold text-slate-800">7919028812</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mã số thuế TNCN:</span>
                      <span className="font-mono font-bold text-slate-800">8392019283</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Số người phụ thuộc:</span>
                      <span className="text-slate-800 font-bold">01 người (Con nhỏ)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Thẻ BHYT khám chữa bệnh:</span>
                      <span className="text-emerald-700 font-bold">Bệnh viện Vinmec</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'salary' && (
              <div className="space-y-4 text-xs">
                {/* Chi tiết Hợp đồng và Chế độ tiền lương */}
                <div className="p-4 rounded-xl bg-white border border-slate-200/90 space-y-3">
                  <h3 className="font-bold text-slate-900 uppercase text-[11px] pb-1 border-b border-slate-100 flex items-center justify-between">
                    <span>Chi tiết Hợp đồng và Chế độ tiền lương</span>
                    <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-mono font-medium border border-blue-200">
                      Số: HĐLĐ-2023/0315-NEXUS
                    </span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 block mb-0.5">Lương cơ bản thỏa thuận:</span>
                      <span className="text-base font-bold font-mono text-blue-600">
                        {emp.contractSalary?.toLocaleString('vi-VN')} VNĐ / tháng
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">Tài khoản nhận lương:</span>
                      <span className="text-sm font-bold font-mono text-slate-800">
                        {emp.bankAccount || '0071 9384 11'} ({emp.bankName || 'Vietcombank'})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">Số dư ngày phép năm 2026:</span>
                      <span className="text-sm font-bold text-emerald-700">
                        {emp.leaveBalance || 9.5} ngày còn lại
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">Ngày bắt đầu làm việc:</span>
                      <span className="text-sm font-medium text-slate-800">
                        {emp.joinDate || '15/03/2023'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Khung tài liệu Hợp đồng lao động đã ký kết (PDF) */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs shadow-2xs">
                        PDF
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">
                          Hop_dong_lao_dong_da_ky_{emp.id}.pdf
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          2.4 MB • Hợp đồng lao động không xác định thời hạn • Đã xác thực e-Sign và Đóng dấu đỏ
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsContractPdfOpen(true)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem hợp đồng chi tiết đã ký (PDF)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsContractPdfOpen(true)}
                        className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs transition-colors cursor-pointer"
                        title="Tải tệp tin hợp đồng PDF"
                      >
                        <Download className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Người đại diện ký kết: <strong>Lê Vũ Ngọc Duy (Tổng Giám Đốc)</strong></span>
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Chữ ký số VNPT-CA hợp lệ
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'kpi' && (
              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 space-y-3 text-xs text-purple-900">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold uppercase text-[11px]">Đánh giá AI (Mô hình 9-Box Talent Matrix)</h3>
                </div>
                <p className="leading-relaxed">
                  Nhân sự <strong>{emp.name}</strong> thuộc nhóm <strong>Ngôi sao tiềm năng (Superstar)</strong> với điểm số KPI quý liên tục đạt &gt;95.0%. Đề xuất: Phê duyệt tăng lương 12% hoặc quy hoạch vào chương trình đào tạo Cán bộ nguồn Quý IV/2026.
                </p>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          {canViewConfidential ? (
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>In hồ sơ nhân sự (PDF)</span>
            </button>
          ) : (
            <div className="text-slate-400 text-[11px] italic">
              * Hồ sơ công tác hiển thị theo phân quyền thẩm quyền nội bộ
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>

      {/* Contract Preview Modal */}
      <Modal4G_ContractPdfPreview
        isOpen={isContractPdfOpen}
        onClose={() => setIsContractPdfOpen(false)}
        emp={emp}
      />
    </AppleModal>
  );
}
