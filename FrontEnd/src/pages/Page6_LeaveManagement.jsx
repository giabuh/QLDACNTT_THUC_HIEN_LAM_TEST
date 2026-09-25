import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';
import leaveService from '../services/leaveService';
import { 
  CalendarDays, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Sparkles, 
  Clock, 
  Check, 
  ShieldAlert,
  Eye,
  CheckCheck,
  UserCheck,
  RotateCcw,
  Building,
  Award,
  Filter,
  ShieldCheck,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Page6_LeaveManagement() {
  const { openModal } = useModal();
  const { currentRole } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [approvedList, setApprovedList] = useState([]);
  const [apiLeaves, setApiLeaves] = useState([]);

  // Load real leave requests from backend PostgreSQL
  const loadLeaves = async () => {
    try {
      const res = await leaveService.getAll();
      if (res && res.success && Array.isArray(res.data)) {
        setApiLeaves(res.data);
      }
    } catch (e) {
      console.warn('Backend leaves API notice, fallback to local:', e);
    }
  };

  useEffect(() => {
    loadLeaves();
    const handleUpdate = () => loadLeaves();
    window.addEventListener('nexus:leave-updated', handleUpdate);
    return () => window.removeEventListener('nexus:leave-updated', handleUpdate);
  }, [currentRole.key]);

  // Calculate current month string for auto-reset monthly log
  const currentMonthYear = 'Tháng 09/2026';
  const monthlyResetCount = 48; // Sẽ tự động reset về 0 vào đầu mỗi tháng mới

  const handleApprove = async (id, name) => {
    setApprovedList((prev) => [...prev, id]);
    try {
      await leaveService.approve(id, 'Đồng ý phê duyệt đơn phép');
      loadLeaves();
    } catch (e) {
      console.warn('Backend approve notice:', e);
    }
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  // ==========================================
  // VIEW 1: CẤP 3 - NHÂN VIÊN (ESS)
  // ==========================================
  if (currentRole.key === 'EMPLOYEE') {
    const rawApiLeaves = apiLeaves.map(l => ({
      id: l.id,
      employeeName: l.full_name || 'Phạm Minh Quân',
      employeeId: l.employee_id,
      employeeRole: l.job_title || 'Kỹ sư Phần mềm (Frontend)',
      employeeDept: l.department_name || 'Phòng Phát triển Phần mềm',
      type: l.leave_type_name || 'Nghỉ việc riêng hưởng nguyên lương',
      leaveType: l.leave_type_name || 'Nghỉ việc riêng hưởng nguyên lương',
      range: `${new Date(l.start_date).toLocaleDateString('vi-VN')} - ${new Date(l.end_date).toLocaleDateString('vi-VN')} (${l.total_days} ngày)`,
      daysCount: Number(l.total_days),
      shiftType: 'Cả ngày (08:00 - 17:30)',
      reason: l.reason,
      handoverPerson: l.handover_to || 'Đồng nghiệp',
      handoverNote: 'Đã bàn giao theo dõi ticket Jira',
      submittedAt: new Date(l.submitted_at).toLocaleDateString('vi-VN'),
      approver: l.manager_approver_name || 'Vũ Đình Khang (Trưởng Phòng Kỹ Thuật)',
      status: approvedList.includes(l.id) || l.stage === 'DA_PHE_DUYET' ? 'approved' : l.stage === 'TU_CHOI' ? 'rejected' : 'pending',
      statusLabel: approvedList.includes(l.id) || l.stage === 'DA_PHE_DUYET' ? 'Đã duyệt' : l.stage === 'CHO_TRUONG_PHONG_DUYET' ? 'Đang chờ Trưởng phòng duyệt' : l.stage === 'CHO_HR_PHE_CHUAN' ? 'Chờ HR phê chuẩn' : 'Từ chối',
      statusColor: approvedList.includes(l.id) || l.stage === 'DA_PHE_DUYET' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200',
      approvalType: 'two_level',
      attachedFile: l.attachment_name || null,
      remainingQuota: 9,
    }));

    const mockMyLeaveRequests = [
      {
        id: 'LP-2026-104',
        employeeName: 'Phạm Minh Quân',
        employeeId: 'NV-0842',
        employeeRole: 'Kỹ sư Phần mềm (Frontend)',
        employeeDept: 'Phòng Phát triển Phần mềm',
        type: 'Nghỉ việc riêng hưởng nguyên lương',
        leaveType: 'Nghỉ việc riêng hưởng nguyên lương',
        range: '25/09/2026 (01 ngày)',
        daysCount: 1,
        shiftType: 'Cả ngày (08:00 - 17:30)',
        reason: 'Gia đình có việc hiếu hỷ (Lễ cưới em ruột theo Luật Lao Động)',
        handoverPerson: 'Vũ Mai Chi (Senior Designer)',
        handoverNote: 'Đã hoàn thành merge pull request #142 và bàn giao theo dõi ticket Jira',
        submittedAt: '12/09/2026 09:30',
        approver: 'Vũ Đình Khang (Trưởng Phòng Kỹ Thuật)',
        status: 'pending',
        statusLabel: 'Đang chờ Trưởng phòng duyệt',
        statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
        approvalType: 'one_level',
        attachedFile: 'Thiep_cuoi_xac_nhan.jpg',
        remainingQuota: 9,
      },
      {
        id: 'LP-2026-089',
        employeeName: 'Phạm Minh Quân',
        employeeId: 'NV-0842',
        employeeRole: 'Kỹ sư Phần mềm (Frontend)',
        employeeDept: 'Phòng Phát triển Phần mềm',
        type: 'Nghỉ phép thường niên (Annual Leave)',
        leaveType: 'Nghỉ phép thường niên (Annual Leave)',
        range: '18/09/2026 - 19/09/2026 (02 ngày)',
        daysCount: 2,
        shiftType: 'Cả ngày (08:00 - 17:30)',
        reason: 'Du lịch nghỉ dưỡng cùng gia đình',
        handoverPerson: 'Nguyễn Văn Tuấn (Kỹ sư Backend)',
        handoverNote: 'Đã hoàn tất tài liệu API và bàn giao trực ca giám sát hệ thống',
        submittedAt: '05/09/2026 14:15',
        approver: 'Vũ Đình Khang (Trưởng Phòng Kỹ Thuật)',
        approvalNote: 'Đồng ý phê duyệt, đề nghị hoàn thành bàn giao trước 17h ngày 17/09.',
        status: 'approved',
        statusLabel: 'Trưởng phòng đã duyệt',
        statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        approvalType: 'one_level',
        attachedFile: 'Bien_ban_ban_giao_cong_viec.docx',
        remainingQuota: 9,
      },
      {
        id: 'LP-2026-042',
        employeeName: 'Phạm Minh Quân',
        employeeId: 'NV-0842',
        employeeRole: 'Kỹ sư Phần mềm (Frontend)',
        employeeDept: 'Phòng Phát triển Phần mềm',
        type: 'Nghỉ ốm đau BHXH (Giấy khám C65)',
        leaveType: 'Nghỉ ốm đau BHXH (Giấy khám C65)',
        range: '12/08/2026 (01 ngày)',
        daysCount: 1,
        shiftType: 'Cả ngày (08:00 - 17:30)',
        reason: 'Sốt xuất huyết điều trị ngoại trú tại Vinmec',
        handoverPerson: 'Vũ Mai Chi (Senior Designer)',
        handoverNote: 'Nghỉ đột xuất vì lý do sức khỏe, đã báo trưởng nhóm qua điện thoại',
        submittedAt: '12/08/2026 08:00',
        approver: 'Trần Mai Hương (Giám Đốc Nhân Sự)',
        approvalNote: 'Đã kiểm tra chứng từ y tế C65 hợp lệ và gửi hồ sơ giám định BHXH chi trả 75%.',
        status: 'approved',
        statusLabel: 'HR đã duyệt chế độ BHXH',
        statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
        approvalType: 'hr_medical',
        attachedFile: 'Giay_chung_nhan_y_te_C65.pdf',
        remainingQuota: 9,
      },
    ];

    const myLeaveRequests = [
      ...rawApiLeaves,
      ...mockMyLeaveRequests.filter(m => !rawApiLeaves.some(a => a.id === m.id))
    ];

    return (
      <div className="w-full min-h-full p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 font-display">
                Đơn Nghỉ Phép và Quỹ Phép Cá Nhân
              </h1>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                Quỹ phép năm: Còn 9/12 ngày
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => openModal('modal6A')}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <span>Xem lịch phép</span>
            </button>
            <button
              type="button"
              onClick={() => openModal('modal6D')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo đơn nghỉ phép mới</span>
            </button>
          </div>
        </div>

        {/* Quota cards: 4 metrics minh bạch */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Tổng quỹ phép 2026</span>
            <div className="text-2xl font-bold text-slate-900 mt-1 font-display">12 ngày</div>
            <span className="text-[11px] text-slate-400">1 ngày phép tích lũy / tháng</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Đã sử dụng</span>
            <div className="text-2xl font-bold text-amber-600 mt-1 font-display">3 ngày</div>
            <span className="text-[11px] text-amber-600 font-semibold">2 ngày phép năm + 1 ngày ốm</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Đang chờ duyệt</span>
            <div className="text-2xl font-bold text-blue-600 mt-1 font-display">1 ngày</div>
            <span className="text-[11px] text-blue-600 font-semibold">Đơn việc hiếu hỷ ngày 25/09</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Khả dụng còn lại</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1 font-display">9 ngày</div>
            <span className="text-[11px] text-emerald-600 font-semibold">Hạn dùng đến hết 31/12/2026</span>
          </div>
        </div>

        {/* Leave Requests Table - Clickable Rows */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Lịch sử gửi đơn nghỉ phép của bạn</h3>
              <p className="text-xs text-slate-500">Bấm vào từng đơn để xem chi tiết tiến trình thẩm duyệt và minh chứng đính kèm</p>
            </div>
            <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
              3 đơn gần nhất
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Mã đơn</th>
                  <th className="py-3 px-4">Loại nghỉ phép</th>
                  <th className="py-3 px-4">Thời gian nghỉ</th>
                  <th className="py-3 px-4">Lý do</th>
                  <th className="py-3 px-4">Người phê duyệt</th>
                  <th className="py-3 px-4">Ngày gửi</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myLeaveRequests.map((req) => (
                  <tr 
                    key={req.id} 
                    onClick={() => openModal('modal6E', req)}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{req.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{req.type}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{req.range}</td>
                    <td className="py-3.5 px-4 text-slate-500 italic max-w-xs truncate">{req.reason}</td>
                    <td className="py-3.5 px-4 text-slate-700">{req.approver}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">{req.submittedAt}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${req.statusColor}`}>
                        {req.statusLabel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal('modal6E', req);
                        }}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                        title="Xem chi tiết đơn này"
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
      </div>
    );
  }

  // ==========================================
  // VIEW 2: CẤP 2B - TRƯỞNG PHÒNG (LINE MANAGER - NGƯỜI DUYỆT CHỦ CHỐT)
  // ==========================================
  if (currentRole.key === 'LINE_MANAGER') {
    const apiDeptPending = apiLeaves
      .filter(l => l.stage === 'CHO_TRUONG_PHONG_DUYET' && !approvedList.includes(l.id))
      .map(l => ({
        id: l.id,
        empId: l.employee_id,
        empName: l.full_name || 'Nhân viên',
        employeeName: l.full_name || 'Nhân viên',
        employeeId: l.employee_id,
        role: l.job_title || 'Kỹ sư Phần mềm',
        employeeRole: l.job_title || 'Kỹ sư Phần mềm',
        employeeDept: l.department_name || 'Phòng Phát triển Phần mềm',
        avatar: l.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        employeeAvatar: l.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        type: l.leave_type_name || 'Nghỉ phép',
        leaveType: l.leave_type_name || 'Nghỉ phép',
        range: `${new Date(l.start_date).toLocaleDateString('vi-VN')} - ${new Date(l.end_date).toLocaleDateString('vi-VN')} (${l.total_days} ngày)`,
        daysCount: Number(l.total_days),
        shiftType: 'Cả ngày (08:00 - 17:30)',
        reason: l.reason,
        handoverPerson: l.handover_to || 'Đồng nghiệp cùng Squad',
        handoverNote: 'Đã hoàn thành bàn giao task trước khi gửi đơn',
        submittedAt: new Date(l.submitted_at).toLocaleDateString('vi-VN'),
        remainingQuota: 9,
        conflictCheck: 'Đã đối soát lịch trực và tiến độ sprint',
        conflictWarning: 'Không trùng lịch Sprint Demo.',
        urgency: 'Bình thường',
        approvalType: 'two_level',
        attachedFile: l.attachment_name || null,
        approver: 'Vũ Đình Khang (Trưởng Phòng Kỹ Thuật)',
        status: 'pending',
      }));

    const mockDeptPendingRequests = [
      {
        id: 'LP-2026-104',
        empId: 'NV-0842',
        empName: 'Phạm Minh Quân',
        employeeName: 'Phạm Minh Quân',
        employeeId: 'NV-0842',
        role: 'Kỹ sư Phần mềm (Frontend)',
        employeeRole: 'Kỹ sư Phần mềm (Frontend)',
        employeeDept: 'Phòng Phát triển Phần mềm',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        employeeAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        type: 'Nghỉ việc riêng hưởng nguyên lương (Hiếu hỷ)',
        leaveType: 'Nghỉ việc riêng hưởng nguyên lương (Hiếu hỷ)',
        range: '25/09/2026 (01 ngày)',
        daysCount: 1,
        shiftType: 'Cả ngày (08:00 - 17:30)',
        reason: 'Gia đình có việc hiếu hỷ (Lễ cưới em ruột theo Bộ Luật Lao Động)',
        handoverPerson: 'Vũ Mai Chi (Senior Designer)',
        handoverNote: 'Đã bàn giao task Jira và merge pull request #142',
        submittedAt: '12/09/2026 09:30',
        remainingQuota: 9,
        conflictCheck: 'Không trùng lịch Sprint Demo • Đảm bảo 80% quân số online',
        conflictWarning: 'Không trùng lịch Sprint Demo. Quân số squad Kỹ thuật còn 4/5 nhân sự (80%).',
        urgency: 'Bình thường',
        approvalType: 'one_level',
        attachedFile: 'Thiep_moi_cuoi_va_xac_nhan.jpg',
        approver: 'Vũ Đình Khang (Trưởng Phòng Kỹ Thuật)',
        status: 'pending',
      },
      {
        id: 'LP-2026-105',
        empId: 'NV-0845',
        empName: 'Lê Hoàng Nam',
        employeeName: 'Lê Hoàng Nam',
        employeeId: 'NV-0845',
        role: 'Kỹ sư Frontend (Web)',
        employeeRole: 'Kỹ sư Frontend (Web)',
        employeeDept: 'Phòng Phát triển Phần mềm',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        type: 'Nghỉ kết hôn bản thân (Hưởng 100% lương theo Luật)',
        leaveType: 'Nghỉ kết hôn bản thân (Hưởng 100% lương theo Luật)',
        range: '02/10/2026 - 04/10/2026 (03 ngày)',
        daysCount: 3,
        shiftType: 'Cả ngày (08:00 - 17:30)',
        reason: 'Bản thân kết hôn theo quy định Điều 115 Bộ Luật Lao Động (Hưởng nguyên lương)',
        handoverPerson: 'Nguyễn Văn Tuấn (Kỹ sư Backend)',
        handoverNote: 'Đã hoàn tất tài liệu bàn giao chức năng giỏ hàng và thanh toán',
        submittedAt: '10/09/2026 15:40',
        remainingQuota: 10,
        conflictCheck: 'Đã bàn giao task cho đồng nghiệp • Không trùng lịch phát hành',
        conflictWarning: 'Đã bàn giao đầy đủ tài liệu API. Không trùng lịch Sprint Release.',
        urgency: 'Quan trọng',
        approvalType: 'one_level',
        attachedFile: 'Giay_xac_nhan_dang_ky_ket_hon.pdf',
        approver: 'Vũ Đình Khang (Trưởng Phòng Kỹ Thuật)',
        status: 'pending',
      },
      {
        id: 'LP-2026-106',
        empId: 'NV-0848',
        empName: 'Trần Văn Hùng',
        employeeName: 'Trần Văn Hùng',
        employeeId: 'NV-0848',
        role: 'Kỹ sư DevOps & Cloud',
        employeeRole: 'Kỹ sư DevOps & Cloud',
        employeeDept: 'Phòng Phát triển Phần mềm',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        type: 'Nghỉ phép thường niên dài ngày (> 3 ngày)',
        leaveType: 'Nghỉ phép thường niên dài ngày (> 3 ngày)',
        range: '28/09/2026 - 02/10/2026 (05 ngày)',
        daysCount: 5,
        shiftType: 'Cả ngày (08:00 - 17:30)',
        reason: 'Nghỉ phép năm kết hợp giải quyết việc gia đình ở quê dài hạn',
        handoverPerson: 'Phạm Minh Quân (Kỹ sư Phần mềm)',
        handoverNote: 'Đã bàn giao chìa khóa hạ tầng AWS và quyền truy cập CI/CD',
        submittedAt: '08/09/2026 10:20',
        remainingQuota: 8,
        conflictCheck: 'Đơn dài ngày: Trưởng phòng xác nhận -> Chuyển Tổng Giám Đốc duyệt',
        conflictWarning: 'Nghỉ 5 ngày liên tục: Cần Tổng Giám Đốc Lê Vũ Ngọc Duy phê duyệt tối cao.',
        urgency: 'Cần CEO duyệt',
        approvalType: 'two_level',
        attachedFile: 'Ke_hoach_ban_giao_ha_tang_AWS.pdf',
        approver: 'Lê Vũ Ngọc Duy (Tổng Giám Đốc)',
        status: 'pending',
      },
    ];

    const deptPendingRequests = [
      ...apiDeptPending,
      ...mockDeptPendingRequests.filter(m => !apiDeptPending.some(a => a.id === m.id) && !approvedList.includes(m.id))
    ];

    return (
      <div className="w-full min-h-full p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 font-display">
                Phê Duyệt Nghỉ Phép Bộ Phận
              </h1>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                Thẩm định vận hành • {deptPendingRequests.length - approvedList.length} đơn chờ xử lý
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Trưởng phòng là người thẩm định tiến độ và duyệt trực tiếp đơn nghỉ phép (1-3 ngày) hoặc xác nhận chuyển cấp trên duyệt (&gt; 3 ngày).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => openModal('modal6A')}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <span>Lịch nghỉ phép bộ phận</span>
            </button>
            <button
              type="button"
              onClick={() => openModal('modal6D')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo đơn xin nghỉ của tôi</span>
            </button>
          </div>
        </div>

        {/* 3 Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Đơn cần bạn duyệt</p>
              <h3 className="text-2xl font-bold font-display text-amber-600 mt-1">
                {deptPendingRequests.length - approvedList.length} đơn
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Thuộc team Kỹ thuật Phần mềm</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Hiện diện hôm nay</p>
              <h3 className="text-2xl font-bold font-display text-emerald-600 mt-1">18 / 20</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">90% nhân sự đang online</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Đã phê duyệt trong tháng</p>
              <h3 className="text-2xl font-bold font-display text-blue-600 mt-1">
                {8 + approvedList.length} đơn
              </h3>
              <p className="text-[11px] text-blue-600 font-semibold mt-0.5">Đảm bảo đúng tiến độ release</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Pending list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              Danh Sách Đơn Chờ Xem Xét và Phê Duyệt
            </h3>
            <span className="text-xs text-slate-400">Bấm vào đơn để xem chứng từ đính kèm trước khi duyệt</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {deptPendingRequests.map((item) => {
              const isApproved = approvedList.includes(item.id);
              return (
                <div 
                  key={item.id}
                  onClick={() => openModal('modal6E', item)}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-300 shadow-2xs hover:shadow-apple-card transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <Avatar
                      src={item.avatar}
                      name={item.empName}
                      id={item.empId}
                      size="lg"
                      shape="rounded"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900">{item.empName}</h4>
                        <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {item.empId}
                        </span>
                        <span className="text-xs text-slate-500">• {item.role}</span>
                        {item.approvalType === 'two_level' && (
                          <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded border border-purple-200">
                            Quy trình 2 cấp (&gt; 3 ngày)
                          </span>
                        )}
                      </div>
                      <div className="mt-2 space-y-1 text-xs">
                        <p className="font-semibold text-slate-800">
                          Loại nghỉ: <span className="text-blue-600 font-bold">{item.type}</span> • Thời gian: <span className="font-mono font-bold text-slate-900">{item.range}</span>
                        </p>
                        <p className="text-slate-500">Lý do: <span className="italic text-slate-700">"{item.reason}"</span></p>
                        <p className="text-emerald-700 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {item.conflictCheck}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal('modal6E', item);
                      }}
                      className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>Xem chi tiết</span>
                    </button>

                    {isApproved ? (
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-2 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600" />
                        {item.approvalType === 'two_level' ? 'Đã chuyển CEO duyệt' : 'Trưởng phòng đã duyệt'}
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal('modal6C', item);
                          }}
                          className="bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer"
                        >
                          Từ chối
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(item.id, item.empName);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>{item.approvalType === 'two_level' ? 'Xác nhận và Chuyển CEO' : 'Duyệt đơn'}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lịch sử các đơn đã phê duyệt của bộ phận */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Lịch sử đơn đã phê duyệt của bộ phận</h3>
              <p className="text-xs text-slate-500">Bấm vào từng đơn để xem lại ghi chú và chứng từ lưu trữ</p>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold">
              Đảm bảo 100% tiến độ Sprint
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Mã đơn</th>
                  <th className="py-3 px-4">Nhân sự</th>
                  <th className="py-3 px-4">Loại nghỉ phép</th>
                  <th className="py-3 px-4">Thời gian</th>
                  <th className="py-3 px-4">Người bàn giao</th>
                  <th className="py-3 px-4">Ghi chú duyệt</th>
                  <th className="py-3 px-4 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  {
                    id: 'LP-2026-088',
                    employeeName: 'Hoàng Quốc Bảo',
                    employeeId: 'NV-0850',
                    employeeRole: 'Kỹ sư Backend',
                    employeeDept: 'Phòng Phát triển Phần mềm',
                    type: 'Nghỉ phép năm thường niên',
                    leaveType: 'Nghỉ phép năm thường niên',
                    range: '01/09/2026 (01 ngày)',
                    daysCount: 1,
                    reason: 'Giải quyết thủ tục hành chính',
                    handoverPerson: 'Nguyễn Văn Tuấn',
                    approver: 'Vũ Đình Khang (Trưởng phòng)',
                    approvalNote: 'Đã duyệt, công việc đã bàn giao tốt.',
                    status: 'approved',
                    submittedAt: '28/08/2026',
                    attachedFile: 'Bien_ban_ban_giao_cong_viec.docx'
                  },
                  {
                    id: 'LP-2026-085',
                    employeeName: 'Nguyễn Tiến Đạt',
                    employeeId: 'NV-0852',
                    employeeRole: 'Kỹ sư QA/QC',
                    employeeDept: 'Phòng Phát triển Phần mềm',
                    type: 'Nghỉ bù tăng ca ngoài giờ (TOIL)',
                    leaveType: 'Nghỉ bù tăng ca ngoài giờ (TOIL)',
                    range: '28/08/2026 (01 ngày)',
                    daysCount: 1,
                    reason: 'Nghỉ bù 8 giờ trực OT thứ Bảy đợt triển khai phiên bản v2.3',
                    handoverPerson: 'Trần Đình Trọng',
                    approver: 'Vũ Đình Khang (Trưởng phòng)',
                    approvalNote: 'Đã đối soát quỹ 8 giờ OT hợp lệ trên hệ thống.',
                    status: 'approved',
                    submittedAt: '25/08/2026',
                    attachedFile: 'Bang_cham_cong_OT_thu_bay.pdf'
                  },
                ].map((row) => (
                  <tr 
                    key={row.id} 
                    onClick={() => openModal('modal6E', row)}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{row.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{row.employeeName}</td>
                    <td className="py-3.5 px-4 text-slate-700">{row.type}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{row.range}</td>
                    <td className="py-3.5 px-4 text-slate-600">{row.handoverPerson}</td>
                    <td className="py-3.5 px-4 text-slate-500 italic max-w-xs truncate">"{row.approvalNote}"</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal('modal6E', row);
                        }}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                        title="Xem chi tiết hồ sơ đơn đã duyệt"
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
      </div>
    );
  }

  // ==========================================
  // VIEW 3: CẤP 1 (CEO) - GIÁM SÁT & KIỂM TOÁN LỊCH SỬ ĐÃ DUYỆT (MONTHLY COUNTER AUTO-RESET)
  // ==========================================
  if (currentRole.key === 'CEO') {
    const ceoSubordinateRequest = {
      id: 'CEO-APP-1',
      employeeName: 'Vũ Đình Khang',
      employeeId: 'NV-1002',
      employeeRole: 'Trưởng Phòng Kỹ Thuật Phần Mềm',
      employeeDept: 'Phòng Phát triển Phần mềm',
      leaveType: 'Nghỉ phép năm thường niên',
      type: 'Nghỉ phép năm (02 ngày)',
      range: '28/09/2026 - 29/09/2026 (02 ngày)',
      daysCount: 2,
      reason: 'Tham gia hội thảo Quốc tế AI & Cloud Engineer Singapore Summit 2026',
      handoverPerson: 'Phạm Minh Quân (Senior Kỹ sư Phần mềm)',
      approvalType: 'ceo_direct',
      attachedFile: 'Thu_moi_hoi_nghi_AI_Singapore_2026.pdf',
      status: 'pending',
      submittedAt: '12/09/2026 09:15',
      note: 'Đã phân chia task Sprint 24 và ủy quyền điều hành trực tiếp cho Phạm Minh Quân.'
    };

    const historicalApprovedLeaves = [
      {
        id: 'LP-2026-098',
        employeeName: 'Đặng Thu Thảo',
        emp: 'Đặng Thu Thảo',
        employeeId: 'NV-0912',
        employeeRole: 'Chuyên viên Marketing',
        dept: 'Phòng Marketing và Truyền thông',
        employeeDept: 'Phòng Marketing và Truyền thông',
        leaveType: 'Nghỉ phép năm thường niên',
        type: 'Phép năm thường niên (02 ngày)',
        range: '08/09/2026 - 09/09/2026 (02 ngày)',
        dates: '08/09 - 09/09/2026',
        daysCount: 2,
        approver: 'Trần Văn Đức (Trưởng phòng MKT)',
        status: 'Hợp lệ',
        audit: 'Đã trừ phép năm',
        reason: 'Giải quyết công việc hành chính gia đình',
        handoverPerson: 'Lê Thùy Dung',
        approvalNote: 'Đã duyệt, công việc trong team phân bổ ổn định.',
        submittedAt: '05/09/2026'
      },
      {
        id: 'LP-2026-095',
        employeeName: 'Phan Minh Đạt',
        emp: 'Phan Minh Đạt',
        employeeId: 'NV-0421',
        employeeRole: 'Phó Phòng Kế Toán',
        dept: 'Phòng Tài chính Kế toán',
        employeeDept: 'Phòng Tài chính Kế toán',
        leaveType: 'Nghỉ việc riêng hưởng nguyên lương (Hiếu hỷ)',
        type: 'Việc riêng hưởng lương (03 ngày)',
        range: '05/09/2026 - 07/09/2026 (03 ngày)',
        dates: '05/09 - 07/09/2026',
        daysCount: 3,
        approver: 'Lê Vũ Ngọc Duy (CEO)',
        status: 'Hợp lệ',
        audit: 'Hưởng 100% lương',
        reason: 'Lễ thành hôn (Cưới hỏi bản thân theo Điều 115 Bộ luật Lao động)',
        handoverPerson: 'Nguyễn Thị Hà',
        approvalNote: 'Chúc mừng hạnh phúc gia đình nhân sự. Tổng Giám Đốc phê duyệt theo quy chế.',
        attachedFile: 'Thiep_cuoi_Giay_dang_ky_ket_hon.pdf',
        submittedAt: '01/09/2026'
      },
      {
        id: 'LP-2026-091',
        employeeName: 'Vũ Mai Chi',
        emp: 'Vũ Mai Chi',
        employeeId: 'NV-0845',
        employeeRole: 'Kỹ sư QA/QC',
        dept: 'Phòng Phát triển Phần mềm',
        employeeDept: 'Phòng Phát triển Phần mềm',
        leaveType: 'Nghỉ ốm đau hưởng trợ cấp Bảo hiểm Xã hội (C65-HD)',
        type: 'Nghỉ ốm BHXH C65 (02 ngày)',
        range: '03/09/2026 - 04/09/2026 (02 ngày)',
        dates: '03/09 - 04/09/2026',
        daysCount: 2,
        approver: 'Trần Mai Hương (HRD)',
        status: 'Hợp lệ',
        audit: 'Hưởng 75% BHXH',
        reason: 'Điều trị ngoại trú sốt siêu vi theo chỉ định của Bệnh viện Thống Nhất',
        handoverPerson: 'Nguyễn Tiến Đạt',
        approvalNote: 'Đã đối soát chứng từ C65 có dấu đỏ bệnh viện hợp lệ.',
        attachedFile: 'Giay_nghi_om_C65_BV_Thong_Nhat.pdf',
        submittedAt: '02/09/2026'
      },
      {
        id: 'LP-2026-088',
        employeeName: 'Hoàng Quốc Bảo',
        emp: 'Hoàng Quốc Bảo',
        employeeId: 'NV-0850',
        employeeRole: 'Kỹ sư Backend',
        dept: 'Phòng Phát triển Phần mềm',
        employeeDept: 'Phòng Phát triển Phần mềm',
        leaveType: 'Nghỉ phép năm thường niên',
        type: 'Phép năm thường niên (01 ngày)',
        range: '01/09/2026 (01 ngày)',
        dates: '01/09/2026',
        daysCount: 1,
        approver: 'Vũ Đình Khang (Trưởng phòng)',
        status: 'Hợp lệ',
        audit: 'Đã trừ phép năm',
        reason: 'Giải quyết thủ tục hành chính',
        handoverPerson: 'Nguyễn Văn Tuấn',
        approvalNote: 'Đã duyệt, công việc đã bàn giao tốt.',
        submittedAt: '28/08/2026'
      },
      {
        id: 'LP-2026-085',
        employeeName: 'Lê Hoàng Nam',
        emp: 'Lê Hoàng Nam',
        employeeId: 'NV-0843',
        employeeRole: 'Kỹ sư Frontend (Web)',
        dept: 'Phòng Phát triển Phần mềm',
        employeeDept: 'Phòng Phát triển Phần mềm',
        leaveType: 'Nghỉ bù tăng ca ngoài giờ (TOIL)',
        type: 'Nghỉ bù tăng ca OT (01 ngày)',
        range: '28/08/2026 (01 ngày)',
        dates: '28/08/2026',
        daysCount: 1,
        approver: 'Vũ Đình Khang (Trưởng phòng)',
        status: 'Hợp lệ',
        audit: 'Đã trừ quỹ OT',
        reason: 'Nghỉ bù ca trực đêm bảo trì hệ thống hạ tầng dữ liệu',
        handoverPerson: 'Phạm Minh Quân',
        approvalNote: 'Đã kiểm tra log chấm công trực đêm hợp lệ.',
        submittedAt: '25/08/2026'
      },
    ];

    return (
      <div className="w-full min-h-full p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 font-display">
                Phê Duyệt Nghỉ Phép Cấp Cao và Lịch Sử Đã Duyệt
              </h1>
              {/* Auto reset monthly badge */}
              <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full border border-purple-200 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                Lịch sử đã duyệt {currentMonthYear}: {monthlyResetCount} đơn (Tự động reset đầu mỗi tháng)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Góc nhìn kiểm toán toàn diện: Theo dõi tỷ lệ nghỉ phép toàn công ty, thẩm định đơn nghỉ dài hạn và phê duyệt đơn của cấp Trưởng phòng.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => openModal('modal6A')}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <span>Sơ đồ lịch nghỉ toàn công ty</span>
            </button>
          </div>
        </div>

        {/* Macro Strategic Cards for CEO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Tỷ lệ vắng mặt trung bình</p>
              <h3 className="text-2xl font-bold font-display text-emerald-600 mt-1">1.2%</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Rất tốt (&lt; 2.5% chuẩn)</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Tổng ngày nghỉ {currentMonthYear}</p>
              <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">42 ngày</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">348 nhân sự • 0.12 ngày/người</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Đơn cấp Trưởng cần CEO duyệt</p>
              <h3 className="text-2xl font-bold font-display text-amber-600 mt-1">1 đơn</h3>
              <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Trưởng phòng Kỹ thuật xin nghỉ</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Đã duyệt trong tháng (Reset kỳ)</p>
              <h3 className="text-2xl font-bold font-display text-purple-600 mt-1">{monthlyResetCount} đơn</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Reset về 0 vào ngày 01/10/2026</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CheckCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Special CEO Approval Card: Direct subordinate */}
        <div 
          onClick={() => openModal('modal6E', ceoSubordinateRequest)}
          className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 hover:border-amber-300 rounded-2xl p-5 shadow-2xs cursor-pointer transition-all"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <Avatar name="Vũ Đình Khang" id="NV-1002" size="lg" shape="rounded" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">Cần CEO duyệt</span>
                  <h4 className="font-bold text-slate-900 text-sm">Vũ Đình Khang • Trưởng Phòng Kỹ Thuật Phần Mềm</h4>
                </div>
                <p className="text-xs text-slate-700 mt-1">
                  <strong>Loại nghỉ:</strong> Nghỉ phép năm (02 ngày: 28/09 - 29/09/2026) • <strong>Lý do:</strong> Tham gia hội thảo Quốc tế AI & Cloud Engineer Singapore
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đã bàn giao điều hành cho Phạm Minh Quân (Senior Kỹ sư Phần mềm). Đính kèm thư mời hội thảo.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal('modal6E', ceoSubordinateRequest);
                }}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>Xem chi tiết và đính kèm</span>
              </button>

              {approvedList.includes('CEO-APP-1') ? (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Tổng Giám Đốc Đã Phê Duyệt
                </span>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApprove('CEO-APP-1', 'Vũ Đình Khang');
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Phê duyệt đơn Trưởng phòng</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* AUDIT LOG: Lịch sử đã duyệt toàn công ty */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCheck className="w-4 h-4 text-purple-600" />
                Lịch Sử Đã Phê Duyệt Toàn Công Ty ({currentMonthYear})
              </h3>
              <p className="text-xs text-slate-500">
                Nhật ký kiểm toán minh bạch • Bấm vào từng dòng để xem toàn bộ chi tiết đơn, chứng từ và tiến trình phê duyệt
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg">
                Chu kỳ: 01/09/2026 - 30/09/2026
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase">
                  <th className="py-3 px-4">Mã đơn</th>
                  <th className="py-3 px-4">Nhân viên</th>
                  <th className="py-3 px-4">Phòng ban</th>
                  <th className="py-3 px-4">Loại nghỉ và Số ngày</th>
                  <th className="py-3 px-4">Khoảng thời gian</th>
                  <th className="py-3 px-4">Cấp thẩm quyền đã duyệt</th>
                  <th className="py-3 px-4">Kiểm toán C&B</th>
                  <th className="py-3 px-4 text-center">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historicalApprovedLeaves.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => openModal('modal6E', item)}
                    className="hover:bg-purple-50/40 cursor-pointer transition"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-purple-700">{item.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{item.emp}</td>
                    <td className="py-3 px-4 text-slate-600">{item.dept}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{item.type}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{item.dates}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{item.approver}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[11px]">
                        {item.audit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal('modal6E', item);
                        }}
                        className="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition"
                        title="Xem chi tiết đơn và lịch sử"
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
      </div>
    );
  }

  // ==========================================
  // VIEW 4: CẤP 2A - QUẢN TRỊ HR / HRD (THẨM DUYỆT CHẾ ĐỘ BHXH & QUY CHẾ)
  // ==========================================
  const c65Request = {
    id: 'LR-02',
    employeeName: 'Nguyễn Thị Hà',
    employeeId: 'NV-1004',
    employeeRole: 'Kế toán viên',
    employeeDept: 'Phòng Tài chính Kế toán',
    leaveType: 'Nghỉ ốm đau hưởng trợ cấp Bảo hiểm Xã hội (C65-HD)',
    type: 'Nghỉ ốm BHXH (C65-HD)',
    range: '13/09/2026 (01 ngày)',
    daysCount: 1,
    reason: 'Điều trị ngoại trú tại Bệnh viện Quốc tế Hoàn Mỹ. Kèm giấy chứng nhận nghỉ việc hưởng BHXH (Mẫu C65-HD).',
    handoverPerson: 'Trần Thị Mỹ Linh (Phó phòng Kế toán)',
    attachedFile: 'Giay_ra_vien_chung_nhan_C65_BHXH.pdf',
    approvalType: 'hr_c65',
    status: 'pending',
    submittedAt: '12/09/2026 14:20'
  };

  return (
    <div className="w-full min-h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 font-display">
              Thẩm Duyệt Nghỉ Phép và Chế Độ Phúc Lợi
            </h1>
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
              Thẩm định hồ sơ C65 và Quy chế
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Kiểm tra chứng từ bảo hiểm y tế, hồ sơ hưởng chế độ ốm đau/thai sản và đồng bộ sang kỳ quyết toán tiền lương.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => openModal('modal6A')}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <CalendarDays className="w-4 h-4 text-blue-600" />
            <span>Xem lịch phép công ty</span>
          </button>
          <button
            type="button"
            onClick={() => openModal('modal6D')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo đơn xin nghỉ của tôi</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Hồ sơ C65 chờ HR duyệt</p>
            <h3 className="text-2xl font-bold font-display text-amber-600 mt-1">1 hồ sơ</h3>
            <p className="text-[11px] text-amber-700 font-semibold mt-0.5">Kèm chứng từ viện phí</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Tỷ lệ duyệt hợp lệ</p>
            <h3 className="text-2xl font-bold font-display text-emerald-600 mt-1">96.5%</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">48 đơn đúng quy chế</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Tổng ngày nghỉ toàn công ty</p>
            <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">42 ngày</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Kỳ Tháng 09/2026</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CalendarDays className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Chế độ BHXH trích chi</p>
            <h3 className="text-2xl font-bold font-display text-purple-600 mt-1">8.420.000 đ</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Cơ quan BHXH thanh toán</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-7 space-y-4">
          {/* C65 Medical Claim item */}
          <article 
            onClick={() => openModal('modal6E', c65Request)}
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:border-blue-300 hover:shadow-apple-card transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <Avatar name="Nguyễn Thị Hà" id="NV-1004" size="lg" shape="rounded" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">Nguyễn Thị Hà</h3>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      NV-1004
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Kế toán viên • Phòng Tài chính Kế toán</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="bg-amber-50 text-amber-800 font-bold text-[11px] px-2.5 py-1 rounded-lg border border-amber-200">
                  Nghỉ ốm hưởng BHXH C65
                </span>
                <span className="text-[10px] text-slate-400">1 giờ trước</span>
              </div>
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 space-y-2 border border-slate-100 text-xs">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <CalendarDays className="w-4 h-4 text-amber-600" />
                <span>1 ngày (Thứ Bảy, 13/09/2026)</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                <strong>Lý do:</strong> Điều trị ngoại trú tại Bệnh viện Quốc tế Hoàn Mỹ. Kèm giấy chứng nhận nghỉ việc hưởng BHXH (Mẫu C65-HD).
              </p>
              
              <div className="pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal('modal6E', c65Request);
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-50 transition-colors shadow-2xs cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>Giay_ra_vien_chung_nhan_C65_BHXH.pdf</span>
                  <Eye className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </button>
              </div>
            </div>

            <div className="mt-3 px-3 py-2 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-between text-xs border border-amber-200">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>Chế độ: <strong>Chứng từ C65 hợp lệ</strong> theo Luật BHXH.</span>
              </div>
              <span className="font-bold text-amber-800">Hưởng trợ cấp 75%</span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal('modal6E', c65Request);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>Xem hồ sơ chi tiết</span>
              </button>

              {approvedList.includes('LR-02') ? (
                <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Đơn đã được HR thẩm định thành công
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal('modal6C', { employeeName: 'Nguyễn Thị Hà', id: 'LR-02' });
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 font-bold text-xs border border-rose-200 transition-colors cursor-pointer"
                  >
                    Yêu cầu bổ sung chứng từ
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove('LR-02', 'Nguyễn Thị Hà');
                    }}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Duyệt quyết toán BHXH</span>
                  </button>
                </div>
              )}
            </div>
          </article>
        </div>

        {/* Right Column: Policy Compliance */}
        <div className="xl:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm font-display">
                  Kiểm tra tự động và Tuân thủ Luật Lao động
                </h3>
                <p className="text-[11px] text-slate-500">Hệ thống thẩm định quy chế và chính sách</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Hồ sơ C65 hợp lệ và đầy đủ điều kiện</span>
              </div>
              <p className="leading-relaxed text-slate-600">
                Đã tra cứu mã bảo hiểm xã hội hợp lệ trên cổng Dịch vụ công Quốc gia. Chứng từ khám chữa bệnh đủ điều kiện thanh toán trợ cấp 75% lương đóng BHXH.
              </p>
            </div>

            <button
              type="button"
              onClick={() => openModal('modal6E', c65Request)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Xem chi tiết hồ sơ chứng nhận C65 BHXH</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

