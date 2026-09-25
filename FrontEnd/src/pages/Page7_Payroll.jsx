import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';
import payrollService from '../services/payrollService';
import { mockPayrollSummary, mockPayrollAnomalies } from '../data/mockPayroll';
import { mockEmployees } from '../data/mockEmployees';
import confetti from 'canvas-confetti';
import { 
  Wallet, 
  Clock, 
  ShieldCheck, 
  Receipt, 
  FileSpreadsheet, 
  AlertTriangle, 
  Lock, 
  TrendingUp, 
  Search, 
  Filter, 
  Download, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Crown,
  Printer,
  HelpCircle,
  Building,
  Check
} from 'lucide-react';

export default function Page7_Payroll() {
  const { openModal } = useModal();
  const { currentRole } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('Tháng 09/2026');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showNumbers, setShowNumbers] = useState(false);
  const [isCeoApproved, setIsCeoApproved] = useState(false);
  const [apiPayslips, setApiPayslips] = useState([]);
  const [apiPeriods, setApiPeriods] = useState([]);
  const [myPayslip, setMyPayslip] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchPayroll() {
      try {
        if (currentRole.key === 'EMPLOYEE') {
          const res = await payrollService.getMyPayslips();
          if (res && res.success && res.data && res.data.length > 0 && isMounted) {
            setMyPayslip(res.data[0]);
          }
        } else {
          const [periodsRes, payslipsRes] = await Promise.all([
            payrollService.getPeriods().catch(() => null),
            payrollService.getPayslips().catch(() => null)
          ]);
          if (periodsRes?.success && Array.isArray(periodsRes.data) && isMounted) {
            setApiPeriods(periodsRes.data);
          }
          if (payslipsRes?.success && Array.isArray(payslipsRes.data) && isMounted) {
            setApiPayslips(payslipsRes.data);
          }
        }
      } catch (err) {
        console.warn('Backend payroll notice, fallback to mock:', err);
      }
    }
    fetchPayroll();
    return () => { isMounted = false; };
  }, [currentRole.key]);

  const handleCeoApprove = async () => {
    setIsCeoApproved(true);
    try {
      const periodCode = selectedPeriod.includes('09/2026') ? '2026-09' : '2026-08';
      await payrollService.calculate(periodCode);
      const updated = await payrollService.getPayslips();
      if (updated?.success && Array.isArray(updated.data)) {
        setApiPayslips(updated.data);
      }
    } catch (e) {
      console.warn('Backend calculate notice:', e);
    }
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const filteredEmployees = mockEmployees.filter((emp) => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'all' || emp.department.includes(departmentFilter);
    return matchesSearch && matchesDept;
  });

  // ==========================================
  // VIEW 1: CẤP 3 - NHÂN VIÊN THÔNG THƯỜNG (ESS)
  // Hiển thị Phiếu Lương Điện Tử Cá Nhân (Personal Payslip)
  // Tuyệt đối không để lộ dữ liệu 3.84 tỷ hay lương đồng nghiệp
  // ==========================================
  if (currentRole.key === 'EMPLOYEE') {
    return (
      <div className="w-full min-h-full p-6 space-y-6">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 font-display">
                Phiếu Lương Điện Tử Cá Nhân
              </h1>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Đã Quyết Toán và Chuyển Khoản
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowNumbers(!showNumbers)}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
            >
              {showNumbers ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-slate-500" />}
              <span>{showNumbers ? 'Ẩn số tiền' : 'Hiện số tiền'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                try {
                  confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
                } catch (e) {}
                alert('Hệ thống đang trích xuất Phiếu lương PDF có chữ ký số điện tử của Tổng Giám Đốc...');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải PDF có chữ ký số</span>
            </button>
          </div>
        </div>

        {/* Employee Identity Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar
              src={currentRole.avatar}
              name={currentRole.name}
              id={currentRole.id}
              size="xl"
              shape="rounded"
              statusBadge="online"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900 font-display">
                  {currentRole.name}
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono text-xs font-bold border border-blue-200">
                  {currentRole.id}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                  Cấp 3
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Kỹ sư Phần mềm • Phòng Phát triển Phần mềm • Khối Kỹ thuật và Công nghệ
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Kỳ chi trả: <strong className="text-slate-700">Tháng 09/2026</strong> • Ngày chuyển khoản: <strong className="text-emerald-600">28/09/2026 • Vietcombank *9921</strong>
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 rounded-xl border border-blue-100 flex flex-col items-start md:items-end">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Thực nhận</span>
            <div className="text-2xl md:text-3xl font-bold font-mono text-blue-700 mt-0.5">
              {showNumbers 
                ? (myPayslip ? Number(myPayslip.net_salary).toLocaleString('vi-VN') + ' ₫' : '31,060,000 ₫') 
                : '•••••••• ₫'}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Đã khấu trừ BHXH và Thuế TNCN
            </span>
          </div>
        </div>

        {/* 4 Financial Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Lương thỏa thuận</span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {showNumbers ? '28,000,000 ₫' : '•••••••• ₫'}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Hợp đồng lao động chính thức</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Làm thêm giờ và Phụ cấp</span>
            <div className="text-xl font-bold font-mono text-emerald-600 mt-1">
              {showNumbers ? '+7,850,000 ₫' : '•••••••• ₫'}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">12.5h OT + Thưởng KPI A</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Các khoản trích trừ</span>
            <div className="text-xl font-bold font-mono text-rose-600 mt-1">
              {showNumbers ? '-4,790,000 ₫' : '•••••••• ₫'}
            </div>
            <p className="text-[11px] text-rose-600 font-semibold mt-0.5">BHXH, BHYT, BHTN, Thuế TNCN</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Ngày công thực tế</span>
            <div className="text-xl font-bold font-mono text-blue-600 mt-1">
              22 / 22 Công
            </div>
            <p className="text-[11px] text-blue-600 font-semibold mt-0.5">100% tỷ lệ chuyên cần</p>
          </div>
        </div>

        {/* Detailed Income Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Earnings Table */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-600" />
                Các Khoản Thu Nhập
              </h3>
              <span className="text-xs font-bold text-emerald-600">
                {showNumbers ? '+35,850,000 ₫' : '••••••••'}
              </span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600">Lương cơ bản theo hợp đồng:</span>
                <span className="font-mono font-bold text-slate-900">{showNumbers ? '28,000,000 ₫' : '••••••••'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600">Phụ cấp chức vụ và tiền ăn trưa:</span>
                <span className="font-mono font-bold text-slate-900">{showNumbers ? '2,500,000 ₫' : '••••••••'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600">Lương làm thêm giờ OT:</span>
                <span className="font-mono font-bold text-emerald-600">{showNumbers ? '2,350,000 ₫' : '••••••••'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Thưởng hiệu suất Sprint 42:</span>
                <span className="font-mono font-bold text-emerald-600">{showNumbers ? '3,000,000 ₫' : '••••••••'}</span>
              </div>
            </div>
          </div>

          {/* Deductions Table */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-rose-600" />
                Các Khoản Trích Trừ
              </h3>
              <span className="text-xs font-bold text-rose-600">
                {showNumbers ? '-4,790,000 ₫' : '••••••••'}
              </span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600">Bảo hiểm xã hội:</span>
                <span className="font-mono font-bold text-rose-600">{showNumbers ? '-2,240,000 ₫' : '••••••••'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600">Bảo hiểm y tế:</span>
                <span className="font-mono font-bold text-rose-600">{showNumbers ? '-420,000 ₫' : '••••••••'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600">Bảo hiểm thất nghiệp:</span>
                <span className="font-mono font-bold text-rose-600">{showNumbers ? '-280,000 ₫' : '••••••••'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Thuế thu nhập cá nhân:</span>
                <span className="font-mono font-bold text-rose-600">{showNumbers ? '-1,850,000 ₫' : '••••••••'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Support Note */}
        <div className="flex items-center justify-end text-xs text-slate-500 pt-1">
          <button 
            type="button"
            onClick={() => alert('Yêu cầu giải trình đã được gửi tới chuyên viên phụ trách nhân sự và tiền lương (hr-payroll@fwbnexus.vn)')}
            className="text-blue-600 hover:text-blue-800 font-semibold hover:underline cursor-pointer"
          >
            Khiếu nại / Thắc mắc về lương?
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: CẤP 2B - TRƯỞNG PHÒNG BAN (LINE MANAGER)
  // Bị giới hạn không xem full bảng lương công ty
  // Hiển thị thông báo phân quyền bảo mật + Phiếu lương cá nhân của Trưởng phòng
  // ==========================================
  if (currentRole.key === 'LINE_MANAGER') {
    return (
      <div className="w-full min-h-full p-6 space-y-6">
        {/* Security Warning Notice */}
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                Khu vực bảo mật thông tin lương doanh nghiệp
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Theo chính sách an toàn thông tin doanh nghiệp, <strong>Bảng lương Tổng công ty (3.84 tỷ)</strong> chỉ dành riêng cho <strong>Ban Giám Đốc</strong> và <strong>Khối Quản Trị Nhân Sự</strong>. Bạn có quyền xem phiếu lương cá nhân của chính mình dưới đây.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowNumbers(!showNumbers)}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              {showNumbers ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
              <span>{showNumbers ? 'Ẩn số tiền' : 'Hiện số tiền'}</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Yêu cầu cấp quyền xem bảng lương đã được chuyển tiếp tới Giám đốc Nhân sự.')}
              className="bg-white hover:bg-amber-100/50 text-amber-900 border border-amber-300 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0"
            >
              Yêu cầu phê duyệt đặc quyền
            </button>
          </div>
        </div>

        {/* Line Manager's Personal Payslip */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar
              src={currentRole.avatar}
              name={currentRole.name}
              id={currentRole.id}
              size="xl"
              shape="rounded"
              statusBadge="online"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900 font-display">
                  {currentRole.name}
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono text-xs font-bold border border-emerald-200">
                  {currentRole.id}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  Trưởng phòng bộ phận
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Trưởng phòng Kỹ thuật Phần mềm • Khối Phát triển Sản phẩm và Công nghệ
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Kỳ lương: Tháng 09/2026 • Lương Gross: <strong className="text-slate-700">{showNumbers ? '45,000,000 ₫' : '••••••••'}</strong> • Phụ cấp trách nhiệm: <strong className="text-emerald-600">{showNumbers ? '+5,000,000 ₫' : '••••••••'}</strong>
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-4 rounded-xl border border-emerald-100 flex flex-col items-start md:items-end">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Thực nhận (Net Pay)</span>
            <div className="text-2xl md:text-3xl font-bold font-mono text-emerald-700 mt-0.5">
              {showNumbers ? '39,200,000 ₫' : '•••••••• ₫'}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Đã chuyển khoản VCB Thành Công
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: CẤP 1 (CEO) & CẤP 2A (HR DIRECTOR)
  // Toàn quyền quản trị bảng lương toàn công ty
  // ==========================================
  const isCeo = currentRole.key === 'CEO';
  const pageTitle = isCeo ? 'Phê Duyệt Quỹ Lương Toàn Công Ty' : 'Xử Lý Tiền Lương Và Quyết Toán';
  const breadcrumbSection = isCeo ? 'Phê duyệt quỹ lương' : 'Xử lý tiền lương và quyết toán';

  return (
    <div className="w-full min-h-full p-6 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 font-display whitespace-nowrap">
              {pageTitle}
            </h1>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1 shrink-0 ${
              isCeoApproved 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              {isCeoApproved ? <Check className="w-3 h-3" /> : null}
              {isCeoApproved ? 'CEO Đã Phê Duyệt Chi Trả' : mockPayrollSummary.status}
            </span>
          </div>
        </div>

        {/* Tailored Buttons for CEO vs HRD */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* Period selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100 shrink-0"
          >
            <option value="Tháng 09/2026">Kỳ: Tháng 09/2026 (Hiện tại)</option>
            <option value="Tháng 08/2026">Kỳ: Tháng 08/2026 (Đã chốt)</option>
            <option value="Tháng 07/2026">Kỳ: Tháng 07/2026 (Đã chốt)</option>
          </select>

          {isCeo ? (
            /* CEO Actions */
            <>
              <button
                type="button"
                onClick={handleCeoApprove}
                className={`text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0 ${
                  isCeoApproved
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20'
                }`}
              >
                <Crown className="w-4 h-4" />
                <span>{isCeoApproved ? 'Đã phê duyệt chi trả' : 'Phê duyệt chi trả toàn công ty'}</span>
              </button>

              <button
                type="button"
                onClick={() => openModal('modal7B')}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Xuất file Ngân hàng VCB</span>
              </button>
            </>
          ) : (
            /* HR Director Actions */
            <>
              <button
                type="button"
                onClick={() => openModal('modal7A')}
                className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold px-3.5 py-2 rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Đối soát 3 bất thường</span>
              </button>

              <button
                type="button"
                onClick={() => openModal('modal7B')}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Xuất file Ngân hàng VCB</span>
              </button>

              <button
                type="button"
                onClick={() => openModal('modal7C')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Lock className="w-4 h-4" />
                <span>Chốt sổ và Khóa kỳ lương</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 4 Financial Ribbon Cards Tailored Per Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Net */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Tổng quỹ lương thực trả (Net)
              </span>
              <div className="text-[24px] font-bold font-display text-blue-600 mt-1">
                {mockPayrollSummary.totalNet.toLocaleString('vi-VN')} đ
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>348 nhân sự toàn công ty</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              +{mockPayrollSummary.netGrowth}%
            </span>
          </div>
        </div>

        {/* Card 2: Strategic for CEO vs OT for HRD */}
        {isCeo ? (
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Tổng Thuế TNCN Nộp NSNN
                </span>
                <div className="text-[24px] font-bold font-display text-purple-600 mt-1">
                  185.200.000 đ
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Đã trừ giảm trừ gia cảnh</span>
              <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                100% Khấu trừ
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Tổng giờ làm thêm (OT)
                </span>
                <div className="text-[24px] font-bold font-display text-amber-600 mt-1">
                  {mockPayrollSummary.totalOtHours} giờ
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{mockPayrollSummary.totalOtEmployees} nhân viên phát sinh OT</span>
              <span className="text-slate-700 font-medium">TB {mockPayrollSummary.avgOtHours}h/người</span>
            </div>
          </div>
        )}

        {/* Card 3: BHXH */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Trích nộp BHXH (10.5%)
              </span>
              <div className="text-[24px] font-bold font-display text-slate-900 mt-1">
                {mockPayrollSummary.totalBhxh.toLocaleString('vi-VN')} đ
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Bao gồm BHXH, BHYT và BHTN</span>
            <span className="text-emerald-700 font-bold">Chuẩn luật định</span>
          </div>
        </div>

        {/* Card 4: Cost per head for CEO vs TNCN for HRD */}
        {isCeo ? (
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Chi Phí Lương TB / Nhân Sự
                </span>
                <div className="text-[24px] font-bold font-display text-emerald-600 mt-1">
                  11.040.000 đ
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Định mức ngân sách năm</span>
              <span className="text-emerald-700 font-bold">Trong hạn mức</span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Thuế TNCN tạm khấu trừ
                </span>
                <div className="text-[24px] font-bold font-display text-purple-600 mt-1">
                  {mockPayrollSummary.totalTax.toLocaleString('vi-VN')} đ
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Đã khấu trừ gia cảnh</span>
              <span className="text-slate-700 font-medium">348 quyết toán</span>
            </div>
          </div>
        )}
      </div>

      {/* Anomaly Callout Banner (Triggers Modal 7A) */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            !
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm font-display">
                Phát hiện 3 trường hợp bất thường cần giải trình trước khi chốt bảng lương
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px]">
                Cảnh báo đỏ
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              1 nhân viên vượt trần 40h OT luật định (DevOps), 1 khoản hoa hồng chưa duyệt, 1 trường hợp biến động thu nhập &gt;35%.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openModal('modal7A')}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
        >
          <span>Đối soát và Giải quyết 3 bất thường</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Table Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên nhân viên, mã NV (NV-1001)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
          >
            <option value="all">Tất cả phòng ban</option>
            <option value="Kỹ thuật">Kỹ thuật Phần mềm</option>
            <option value="Marketing">Marketing và Truyền thông</option>
            <option value="Nhân sự">Nhân sự và Vận hành</option>
          </select>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Nhân viên</th>
                <th className="py-3 px-4">Mã NV</th>
                <th className="py-3 px-4">Lương cơ bản</th>
                <th className="py-3 px-4">Ngày công</th>
                <th className="py-3 px-4">Làm thêm (OT)</th>
                <th className="py-3 px-4">Thưởng KPI</th>
                <th className="py-3 px-4">Trích BHXH</th>
                <th className="py-3 px-4">Thuế TNCN</th>
                <th className="py-3 px-4 font-bold text-blue-700">Thực lĩnh (Net)</th>
                <th className="py-3 px-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {(apiPayslips.length > 0 ? apiPayslips.filter(ps => {
                const matchesSearch = 
                  (ps.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (ps.employee_id || '').toLowerCase().includes(searchTerm.toLowerCase());
                const matchesDept = departmentFilter === 'all' || (ps.department_name || '').includes(departmentFilter);
                return matchesSearch && matchesDept;
              }).map(ps => ({
                id: ps.employee_id,
                name: ps.full_name,
                avatar: ps.avatar_url,
                role: ps.job_title,
                base: parseFloat(ps.base_salary) || 0,
                days: `${ps.actual_work_days} / 22 ngày`,
                ot: parseFloat(ps.ot_pay) || 0,
                kpi: parseFloat(ps.allowances || ps.bonus) || 0,
                bhxh: parseFloat(ps.bhxh_amount) || 0,
                tax: parseFloat(ps.pit_amount) || 0,
                net: parseFloat(ps.net_salary) || 0,
                raw: ps
              })) : filteredEmployees.map(emp => {
                const base = emp.contractSalary;
                const ot = emp.id === 'NV-1002' ? 5200000 : 1200000;
                const kpi = emp.kpiScore >= 95 ? 4000000 : 2000000;
                const bhxh = Math.round(base * 0.105);
                const tax = Math.round(base * 0.05);
                const net = base + ot + kpi - bhxh - tax;
                return {
                  id: emp.id,
                  name: emp.name,
                  avatar: emp.avatar,
                  role: emp.role,
                  base,
                  days: '22 / 22 ngày',
                  ot,
                  kpi,
                  bhxh,
                  tax,
                  net,
                  raw: emp
                };
              })).map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar
                        src={item.avatar}
                        name={item.name}
                        id={item.id}
                        size="sm"
                        shape="circle"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-400">{item.role}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-slate-600">
                    {item.id}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-700 font-semibold">
                    {item.base.toLocaleString('vi-VN')} đ
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-800">
                    {item.days}
                  </td>

                  <td className="py-3 px-4 font-mono font-semibold text-amber-600">
                    +{item.ot.toLocaleString('vi-VN')} đ
                  </td>

                  <td className="py-3 px-4 font-mono font-semibold text-emerald-600">
                    +{item.kpi.toLocaleString('vi-VN')} đ
                  </td>

                  <td className="py-3 px-4 font-mono text-rose-600">
                    -{item.bhxh.toLocaleString('vi-VN')} đ
                  </td>

                  <td className="py-3 px-4 font-mono text-rose-600">
                    -{item.tax.toLocaleString('vi-VN')} đ
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-blue-600 text-[13px]">
                    {item.net.toLocaleString('vi-VN')} đ
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => openModal('modal3C', item.raw)}
                      className="text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
                    >
                      Xem phiếu
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
