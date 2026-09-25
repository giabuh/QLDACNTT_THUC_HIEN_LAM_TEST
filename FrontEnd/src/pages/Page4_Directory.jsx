import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';
import { mockEmployees } from '../data/mockEmployees';
import employeeService from '../services/employeeService';
import { initialSquads } from '../data/mockProjectsTasks';
import confetti from 'canvas-confetti';
import { 
  Users, 
  UserCheck, 
  Clock, 
  GraduationCap, 
  Search, 
  Plus, 
  Upload, 
  FileSpreadsheet, 
  Eye, 
  UserX, 
  ChevronLeft,
  ChevronRight,
  Building2,
  Briefcase,
  Layers,
  Activity,
  Award,
  Code2,
  MessageSquare,
  Send,
  X,
  Check,
  FolderKanban,
  Sparkles,
  User,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function Page4_Directory() {
  const { openModal } = useModal();
  const { currentRole } = useAuth();
  const [employees, setEmployees] = useState(mockEmployees);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState(
    currentRole.key === 'LINE_MANAGER' || currentRole.key === 'EMPLOYEE' ? 'Phần mềm' : 'all'
  );
  const [statusFilter, setStatusFilter] = useState('all');

  const isStaff = currentRole.key === 'EMPLOYEE';
  const isManager = currentRole.key === 'LINE_MANAGER';
  const canManagePersonnel = currentRole.key === 'CEO' || currentRole.key === 'HR_DIRECTOR';

  // Tabs for Manager & Employee:
  // Manager: 'department_staff' | 'squads'
  // Employee: 'my_squads' | 'all_department'
  const [activeTab, setActiveTab] = useState(isStaff ? 'my_squads' : 'department_staff');

  // Squads state
  const [squads, setSquads] = useState(initialSquads);
  const [isCreateSquadOpen, setIsCreateSquadOpen] = useState(false);
  const [activeChatSquad, setActiveChatSquad] = useState(null);
  const [chatInputText, setChatInputText] = useState('');

  // Fetch employees from API on mount
  useEffect(() => {
    let isMounted = true;
    const loadEmployees = async () => {
      try {
        setIsLoadingEmployees(true);
        const res = await employeeService.getAll();
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const normalized = res.data.map(emp => ({
            id: emp.id,
            name: emp.full_name || emp.name,
            role: emp.job_title || emp.role || 'Nhân viên',
            department: emp.department_name || emp.department || 'Kỹ thuật Phần mềm',
            email: emp.work_email || emp.email,
            phone: emp.phone_number || emp.phone || '0900 000 000',
            avatar: emp.avatar_url || emp.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            contractSalary: Number(emp.base_salary || emp.contractSalary || 20000000),
            status: (emp.status === 'DANG_LAM_VIEC' || emp.status === 'active') ? 'active' : emp.status,
            type: emp.contract_type === 'CHINH_THUC' ? 'Toàn thời gian' : 'Thử việc',
            joinDate: emp.joined_date ? new Date(emp.joined_date).toLocaleDateString('vi-VN') : (emp.joinDate || '01/01/2026'),
            leaveBalance: Number(emp.leave_balance ?? emp.leaveBalance ?? 12),
            cccd: emp.citizen_id || emp.cccd || '079000000000',
            bankAccount: emp.bank_account || emp.bankAccount || '123456789',
            bankName: emp.bank_name || emp.bankName || 'Vietcombank',
            kpiScore: Number(emp.kpi_score ?? emp.kpiScore ?? 95.0),
            attendanceRate: Number(emp.attendance_rate ?? emp.attendanceRate ?? 98.0),
          }));
          if (isMounted) setEmployees(normalized);
        }
      } catch (err) {
        console.warn('API employees fallback to local seed data:', err);
      } finally {
        if (isMounted) setIsLoadingEmployees(false);
      }
    };

    loadEmployees();

    const handleEmployeeAdded = (e) => {
      if (e?.detail) {
        setEmployees(prev => [e.detail, ...prev.filter(x => x.id !== e.detail.id)]);
        setDepartmentFilter('all');
        setStatusFilter('all');
        setSearchTerm('');
      } else {
        loadEmployees();
      }
    };

    const handleEmployeeDeleted = (e) => {
      if (e?.detail?.id) {
        setEmployees(prev => prev.filter(x => x.id !== e.detail.id));
      }
    };

    window.addEventListener('nexus:employee-added', handleEmployeeAdded);
    window.addEventListener('nexus:employee-deleted', handleEmployeeDeleted);
    return () => {
      isMounted = false;
      window.removeEventListener('nexus:employee-added', handleEmployeeAdded);
      window.removeEventListener('nexus:employee-deleted', handleEmployeeDeleted);
    };
  }, []);

  // New Squad Form State
  const [newSquad, setNewSquad] = useState({
    name: '',
    projectCode: 'PRJ-NEXUS-V2',
    projectName: 'Nâng cấp Cổng Dịch Vụ Nhân Sự NEXUS HR v2.0',
    leadName: 'Trần Đình Trọng',
    leadRole: 'Techlead DevOps và Backend',
    target: '',
    selectedMemberIds: ['NV-0842', 'NV-1002', 'NV-1004'],
  });

  // Page Header Texts
  const pageTitle = canManagePersonnel
    ? 'Hồ Sơ Nhân Sự'
    : isManager
    ? 'Nhân Sự Bộ Phận'
    : 'Đồng Nghiệp Cùng Nhóm';

  const pageSubtitle = canManagePersonnel
    ? `Toàn bộ ${employees.length} hồ sơ nhân sự, hợp đồng lao động và phân bổ phòng ban`
    : isManager
    ? 'Danh sách nhân sự thuộc Phòng Kỹ Thuật Phần Mềm dưới quyền quản lý của Trưởng phòng Vũ Đình Khang'
    : 'Danh sách các đội nhóm dự án và thông tin liên hệ công vụ các đồng nghiệp cùng phòng Kỹ thuật';

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    if (isStaff || isManager) {
      if (emp.department && !emp.department.includes('Phần mềm') && !emp.department.includes('Kỹ thuật')) {
        return false;
      }
    }

    const matchesSearch = 
      (emp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.role || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = departmentFilter === 'all' || (emp.department || '').includes(departmentFilter);
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' && emp.status === 'active');

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Squads for Employee (where Employee is a member)
  const employeeSquads = squads.filter((sq) =>
    sq.members.some((m) => m.id === 'NV-0842')
  );

  // Handlers
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInputText.trim() || !activeChatSquad) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: currentRole.name || (isStaff ? 'Phạm Minh Quân' : 'Vũ Đình Khang'),
      roleBadge: isManager ? 'Trưởng phòng' : isStaff ? 'Kỹ sư Frontend' : currentRole.title,
      avatar: currentRole.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      text: chatInputText.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
      isManager: isManager,
    };

    const updatedSquads = squads.map((sq) => {
      if (sq.id === activeChatSquad.id) {
        return {
          ...sq,
          chatMessages: [...sq.chatMessages, newMsg],
        };
      }
      return sq;
    });

    setSquads(updatedSquads);
    setActiveChatSquad({
      ...activeChatSquad,
      chatMessages: [...activeChatSquad.chatMessages, newMsg],
    });
    setChatInputText('');
  };

  const handleCreateSquad = (e) => {
    e.preventDefault();
    if (!newSquad.name.trim()) return;

    const memberObjects = employees
      .filter((e) => newSquad.selectedMemberIds.includes(e.id))
      .map((e) => ({
        id: e.id,
        name: e.name,
        role: e.role,
        avatar: e.avatar,
      }));

    const created = {
      id: `SQ-0${squads.length + 1}`,
      name: newSquad.name,
      projectCode: newSquad.projectCode,
      projectName: newSquad.projectName,
      leadName: newSquad.leadName,
      leadRole: 'Techlead Dự án',
      leadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      target: newSquad.target || 'Nghiên cứu và phát triển tính năng sprint mới của bộ phận.',
      activeTasksCount: 3,
      members: memberObjects.length > 0 ? memberObjects : [
        { id: 'NV-0842', name: 'Phạm Minh Quân', role: 'Kỹ sư Frontend Lead', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
        { id: 'NV-1002', name: 'Trần Đình Trọng', role: 'Techlead Backend', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
      ],
      chatMessages: [
        {
          id: `m-init-${Date.now()}`,
          sender: currentRole.name || 'Vũ Đình Khang',
          roleBadge: 'Trưởng phòng',
          avatar: currentRole.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
          text: `Đội nhóm ${newSquad.name} đã được khởi tạo thành công! Các thành viên bắt đầu trao đổi tại đây nhé.`,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          isManager: true,
        },
      ],
    };

    setSquads([created, ...squads]);
    setIsCreateSquadOpen(false);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    setNewSquad({
      name: '',
      projectCode: 'PRJ-NEXUS-V2',
      projectName: 'Nâng cấp Cổng Dịch Vụ Nhân Sự NEXUS HR v2.0',
      leadName: 'Trần Đình Trọng',
      leadRole: 'Techlead DevOps và Backend',
      target: '',
      selectedMemberIds: ['NV-0842', 'NV-1002', 'NV-1004'],
    });
  };

  return (
    <div className="w-full min-h-full p-6 space-y-6 animate-in fade-in duration-300">
      {/* Page Breadcrumb and Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 font-display tracking-tight">
              {pageTitle}
            </h1>
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
              {isStaff || isManager ? '20 nhân sự bộ phận' : '348 nhân sự toàn công ty'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{pageSubtitle}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {canManagePersonnel && (
            <>
              <button
                type="button"
                onClick={() => alert('Đang xuất danh sách nhân sự (.xlsx)...')}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Xuất file Excel</span>
              </button>
              <button
                type="button"
                onClick={() => openModal('modal4E')}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
                title="Quản lý cơ cấu các phòng ban"
              >
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Quản lý phòng ban</span>
              </button>

              <button
                type="button"
                onClick={() => openModal('modal4F')}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
                title="Quản lý danh mục chức danh và cấp bậc"
              >
                <Briefcase className="w-4 h-4 text-purple-600" />
                <span>Quản lý chức danh</span>
              </button>

              <button
                type="button"
                onClick={() => openModal('modal4C')}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Nhập file Excel</span>
              </button>

              <button
                type="button"
                onClick={() => openModal('modal4A')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tiếp nhận nhân sự mới</span>
              </button>
            </>
          )}

          {isManager && (
            <button
              type="button"
              onClick={() => setIsCreateSquadOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tạo Đội Nhóm Dự Án Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {canManagePersonnel ? (
        /* Cấp 1 và 2A: Toàn công ty 348 nhân sự */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Tổng số nhân sự</p>
              <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">348</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Toàn công ty</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-slate-500">Chính thức</p>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-200">
                  89.6%
                </span>
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">312</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Hợp đồng dài hạn</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-slate-500">Đang thử việc</p>
                <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-amber-200">
                  7.5%
                </span>
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">26</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Thử việc 2 tháng</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-slate-500">Thực tập và Khác</p>
                <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-purple-200">
                  2.9%
                </span>
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">10</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Cộng tác viên / TTS</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
        </div>
      ) : isManager ? (
        /* Cấp 2B: Metric dành riêng cho Trưởng Bộ Phận */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Nhân sự bộ phận</p>
              <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">20</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Phòng Kỹ thuật Phần mềm</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-slate-500">Có mặt hôm nay</p>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-200">
                  90%
                </span>
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">18 / 20</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">2 người nghỉ phép năm</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Đội nhóm dự án (Squads)</p>
              <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">{squads.length} Đội</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Có kênh chat trao đổi trực tiếp</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-slate-500">Điểm KPI TB Team</p>
                <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-purple-200">
                  Top 1
                </span>
              </div>
              <h3 className="text-2xl font-bold font-display text-purple-600 mt-1">88.5%</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Hiệu suất rất cao</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>
      ) : (
        /* Cấp 3: Nhân viên tiêu chuẩn */
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Phòng Kỹ Thuật và Công Nghệ Phần Mềm
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Trưởng phòng: <strong>Vũ Đình Khang</strong> • Techlead: <strong>Trần Đình Trọng</strong> • Quy mô: <strong>20 kỹ sư phần mềm</strong>
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-blue-700 font-semibold bg-white/80 px-3 py-1.5 rounded-xl border border-blue-200">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Bạn đang tham gia {employeeSquads.length} Đội nhóm dự án</span>
          </div>
        </div>
      )}

      {/* Tab Switcher for Manager & Employee */}
      {(isManager || isStaff) && (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          {isManager ? (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('department_staff')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'department_staff'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Danh sách nhân sự bộ phận (20)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('squads')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'squads'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>Đội nhóm dự án và Kênh trao đổi ({squads.length} Squads)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('my_squads')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'my_squads'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>Đội nhóm dự án của tôi ({employeeSquads.length} Squads)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('all_department')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'all_department'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Toàn bộ đồng nghiệp phòng Kỹ thuật (20)
              </button>
            </>
          )}
        </div>
      )}

      {/* VIEW 1: SQUADS VIEW (Đội nhóm dự án và Kênh chat) */}
      {((isManager && activeTab === 'squads') || (isStaff && activeTab === 'my_squads')) ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>
                  {isStaff ? 'Đội Nhóm Dự Án Của Tôi (My Project Squads)' : 'Danh Sách Các Đội Nhóm Dự Án Bộ Phận'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isStaff
                  ? 'Các đồng nghiệp trực tiếp cùng làm chung dự án với bạn. Có kênh chat nội bộ trao đổi công việc theo thời gian thực.'
                  : 'Các nhóm Agile Squad được Trưởng phòng phân công theo từng dự án trọng điểm, tích hợp kênh chat trao đổi tập trung.'}
              </p>
            </div>

            {isManager && (
              <button
                type="button"
                onClick={() => setIsCreateSquadOpen(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tạo Đội Nhóm Mới</span>
              </button>
            )}
          </div>

          {/* Squads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(isStaff ? employeeSquads : squads).map((squad) => (
              <div
                key={squad.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Badge */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-mono text-[10px] font-bold border border-blue-200">
                      {squad.projectCode}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px]">
                      {squad.activeTasksCount} tasks đang làm
                    </span>
                  </div>

                  {/* Title & Project */}
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                      {squad.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      Dự án: <strong className="text-slate-700">{squad.projectName}</strong>
                    </p>
                  </div>

                  {/* Target description */}
                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200/80 leading-relaxed">
                    {squad.target}
                  </div>

                  {/* Techlead / Leader */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <img
                      src={squad.leadAvatar}
                      alt={squad.leadName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 truncate">{squad.leadName}</div>
                      <div className="text-[10px] text-blue-600 font-semibold truncate">{squad.leadRole}</div>
                    </div>
                  </div>

                  {/* Members list */}
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Thành viên tham gia ({squad.members.length})
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {squad.members.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/80 rounded-lg text-[11px] text-slate-700 font-semibold"
                          title={`${m.name} - ${m.role}`}
                        >
                          <img
                            src={m.avatar}
                            alt={m.name}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span className="truncate max-w-[100px]">{m.name.split(' ').slice(-2).join(' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action: Open Team Chat */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveChatSquad(squad)}
                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Mở Kênh Chat Đội Nhóm ({squad.chatMessages.length})</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* VIEW 2: DEPARTMENT DIRECTORY TABLE */
        <div className="space-y-4">
          {/* Filter and Search Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isStaff ? "Tìm đồng nghiệp theo họ tên, chức vụ, hòm thư công vụ..." : "Tìm theo họ tên, mã nhân viên (NV-1001), chức vụ, hòm thư..."}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium"
              />
            </div>

            {/* Dropdowns */}
            <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
              {canManagePersonnel && (
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                >
                  <option value="all">Tất cả phòng ban</option>
                  <option value="Kỹ thuật">Kỹ thuật Phần mềm</option>
                  <option value="Marketing">Marketing và Truyền thông</option>
                  <option value="Nhân sự">Nhân sự và Vận hành</option>
                  <option value="Tài chính">Tài chính Kế toán</option>
                </select>
              )}

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang làm việc</option>
                <option value="probation">Đang thử việc</option>
                <option value="leave">Nghỉ phép</option>
              </select>
            </div>
          </div>

          {/* Directory Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Nhân viên</th>
                    <th className="py-3 px-4">Mã NV</th>
                    <th className="py-3 px-4">Phòng ban</th>
                    <th className="py-3 px-4">Chức danh</th>
                    {canManagePersonnel ? (
                      <th className="py-3 px-4">Lương cơ bản</th>
                    ) : (
                      <th className="py-3 px-4">Số máy lẻ nội bộ</th>
                    )}
                    {!isStaff && <th className="py-3 px-4">Hiệu suất KPI</th>}
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredEmployees.map((emp) => (
                    <tr 
                      key={emp.id} 
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => openModal('modal4B', emp)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={emp.avatar} name={emp.name} id={emp.id} size="md" />
                          <div>
                            <div className="font-bold text-slate-900">{emp.name}</div>
                            <div className="text-[11px] text-slate-400">{emp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] font-semibold text-slate-600">
                        {emp.id}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {emp.department}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {emp.role}
                      </td>

                      {/* Confidential Column */}
                      {canManagePersonnel ? (
                        <td className="py-3.5 px-4 font-semibold text-slate-900 font-mono">
                          {emp.contractSalary ? `${emp.contractSalary.toLocaleString('vi-VN')} ₫` : '28.000.000 ₫'}
                        </td>
                      ) : (
                        <td className="py-3.5 px-4 font-semibold text-blue-600 font-mono text-xs">
                          {emp.phone ? `Ext: ${emp.phone.slice(-4)}` : 'Ext: 8042'}
                        </td>
                      )}

                      {!isStaff && (
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{emp.kpiScore || 85}%</span>
                            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-emerald-500 h-1.5 rounded-full" 
                                style={{ width: `${emp.kpiScore || 85}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      )}

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          emp.status === 'active' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            emp.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`} />
                          {emp.status === 'active' ? 'Đang làm việc' : 'Nghỉ phép'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => openModal('modal4B', emp)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Xem hồ sơ chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canManagePersonnel && (
                            <button
                              type="button"
                              onClick={() => openModal('modal4D', emp)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Quy trình thôi việc / Bàn giao"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div>
                Hiển thị <strong className="text-slate-800">{filteredEmployees.length}</strong> / {isStaff || isManager ? '20' : '348'} nhân sự
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 font-bold border border-blue-200">
                  Trang 1 / {isStaff || isManager ? '1' : '15'}
                </span>
                <button className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50" disabled={isStaff || isManager}>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- MODAL: TẠO ĐỘI NHÓM DỰ ÁN MỚI -------------------- */}
      {isCreateSquadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Tạo Đội Nhóm Dự Án Mới</h3>
                  <p className="text-[11px] text-slate-500">Phòng Phát triển Phần mềm • Phân bổ thành viên Agile Squad</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateSquadOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSquad} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên Đội Nhóm Dự Án *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Squad Core HRMS và Phân Quyền"
                  value={newSquad.name}
                  onChange={(e) => setNewSquad({ ...newSquad, name: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dự Án Phụ Trách</label>
                  <select
                    value={newSquad.projectCode}
                    onChange={(e) => setNewSquad({ ...newSquad, projectCode: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="PRJ-NEXUS-V2">NEXUS HR v2.0</option>
                    <option value="PRJ-AI-ATTENDANCE">Kiosk Chấm Công AI</option>
                    <option value="PRJ-MOBILE-ESS">Mobile ESS App</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trưởng Nhóm (Techlead)</label>
                  <select
                    value={newSquad.leadName}
                    onChange={(e) => setNewSquad({ ...newSquad, leadName: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="Trần Đình Trọng">Trần Đình Trọng</option>
                    <option value="Phạm Minh Quân">Phạm Minh Quân</option>
                    <option value="Vũ Mai Chi">Vũ Mai Chi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mục Tiêu Hoạt Động Của Squad</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả phạm vi bàn giao công việc của đội nhóm trong sprint..."
                  value={newSquad.target}
                  onChange={(e) => setNewSquad({ ...newSquad, target: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateSquadOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Xác Nhận Tạo Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- MODAL: KÊNH CHAT ĐỘI NHÓM DỰ ÁN -------------------- */}
      {activeChatSquad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full h-[600px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900">{activeChatSquad.name}</h3>
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-mono text-[10px] font-bold">
                      {activeChatSquad.projectCode}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Kênh trao đổi nội bộ • {activeChatSquad.members.length} thành viên trực tuyến</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveChatSquad(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/40">
              {activeChatSquad.chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 text-xs ${
                    msg.isSelf ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <img
                    src={msg.avatar}
                    alt={msg.sender}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5"
                  />
                  <div className={`max-w-[80%] space-y-1 ${msg.isSelf ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="font-bold text-slate-800">{msg.sender}</span>
                      {msg.roleBadge && (
                        <span className={`px-1.5 py-0.2 rounded font-semibold ${
                          msg.isManager ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {msg.roleBadge}
                        </span>
                      )}
                      <span className="text-slate-400">{msg.time}</span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.isSelf
                          ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                          : msg.isManager
                          ? 'bg-purple-50 text-purple-950 border border-purple-200 rounded-tl-xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-2xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={handleSendChatMessage}
              className="p-3 border-t border-slate-100 bg-white flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Nhập tin nhắn trao đổi công việc trong đội nhóm..."
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                className="flex-1 h-10 px-4 rounded-xl border border-slate-200 text-xs focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
              />
              <button
                type="submit"
                disabled={!chatInputText.trim()}
                className="h-10 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Gửi</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
