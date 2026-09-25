import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, ROLES } from '../context/AuthContext';
import authService from '../services/authService';
import Avatar from '../components/common/Avatar';
import { 
  BadgeCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ScanFace, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  UserCheck,
  Crown,
  Briefcase,
  Users,
  User,
  ShieldAlert,
  Laptop,
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Page1_Login() {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  const [employeeId, setEmployeeId] = useState('NV-1001');
  const [password, setPassword] = useState('Hrd@123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // FaceID Modal State
  const [isFaceIdOpen, setIsFaceIdOpen] = useState(false);
  const [faceIdStep, setFaceIdStep] = useState(1); // 1: scanning, 2: matched, 3: success

  const testAccounts = [
    {
      roleKey: 'CEO',
      level: 'Cấp 1',
      title: 'Tổng Giám Đốc (CEO)',
      name: 'Lê Vũ Ngọc Duy',
      id: 'NV-0001',
      email: 'ceo@fwbnexus.vn',
      password: 'Ceo@123456',
      icon: Crown,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      desc: 'Toàn quyền điều hành xem toàn bộ dữ liệu tài chính và nhân sự',
      targetPath: '/dashboard',
    },
    {
      roleKey: 'HR_DIRECTOR',
      level: 'Cấp 2A',
      title: 'Giám đốc Nhân sự (HRD)',
      name: 'Trần Mai Hương',
      id: 'NV-1001',
      email: 'hrd@fwbnexus.vn',
      password: 'Hrd@123456',
      icon: Briefcase,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      desc: 'Toàn quyền vận hành HRMS, quyết toán lương và thẩm duyệt phép',
      targetPath: '/dashboard',
    },
    {
      roleKey: 'LINE_MANAGER',
      level: 'Cấp 2B',
      title: 'Trưởng phòng Kỹ thuật',
      name: 'Vũ Đình Khang',
      id: 'NV-1002',
      email: 'lead@fwbnexus.vn',
      password: 'Lead@123456',
      icon: Users,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      desc: 'Quản lý phòng ban, duyệt phép đội ngũ và đánh giá hiệu suất',
      targetPath: '/dashboard',
    },
    {
      roleKey: 'EMPLOYEE',
      level: 'Cấp 3',
      title: 'Nhân viên Kỹ sư (ESS)',
      name: 'Phạm Minh Quân',
      id: 'NV-0842',
      email: 'employee@fwbnexus.vn',
      password: 'Emp@123456',
      icon: User,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      desc: 'Cổng tự phục vụ ESS: xem lương, FaceID, xin phép cá nhân',
      targetPath: '/portal',
    },
  ];

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!employeeId || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ mã nhân viên/email và mật khẩu');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    // Map to account if available
    const matchedAccount = testAccounts.find(
      (a) => a.id === employeeId || a.email.toLowerCase() === employeeId.toLowerCase()
    );

    const emailToUse = matchedAccount ? matchedAccount.email : (employeeId.includes('@') ? employeeId : `${employeeId.toLowerCase()}@fwbnexus.vn`);

    try {
      await authService.login(emailToUse, password);
    } catch (err) {
      console.warn('API login warning (fallback to demo role):', err);
    }

    setIsLoading(false);
    // Determine destination based on ID or default to dashboard
    if (employeeId === 'NV-0842' || employeeId.includes('employee')) {
      switchRole('EMPLOYEE');
      navigate('/portal');
    } else if (employeeId === 'NV-0001' || employeeId.includes('ceo')) {
      switchRole('CEO');
      navigate('/dashboard');
    } else if (employeeId === 'NV-1002' || employeeId.includes('lead')) {
      switchRole('LINE_MANAGER');
      navigate('/dashboard');
    } else {
      switchRole('HR_DIRECTOR');
      navigate('/dashboard');
    }
  };

  const handleSelectQuickAccount = async (acc) => {
    setEmployeeId(acc.id);
    setPassword(acc.password);
    switchRole(acc.roleKey);
    setIsLoading(true);

    try {
      await authService.login(acc.email, acc.password);
    } catch (err) {
      console.warn('Quick login API notice:', err);
    }

    setIsLoading(false);
    navigate(acc.targetPath);
  };

  const handleStartFaceId = () => {
    setIsFaceIdOpen(true);
    setFaceIdStep(1);

    setTimeout(() => {
      setFaceIdStep(2); // Face detected
      setTimeout(() => {
        setFaceIdStep(3); // Verified
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // Ignore
        }
        setTimeout(() => {
          setIsFaceIdOpen(false);
          switchRole('HR_DIRECTOR');
          navigate('/dashboard');
        }, 900);
      }, 1200);
    }, 1400);
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col justify-between select-none relative overflow-x-hidden"
      style={{
        backgroundColor: '#F8FAFC',
        backgroundImage: 'radial-gradient(rgba(37, 99, 235, 0.05) 1px, transparent 1px), radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.07), transparent 70%)',
        backgroundSize: '24px 24px, 100% 100%'
      }}
    >
      {/* Top right language & status */}
      <div className="fixed top-5 right-6 z-20 flex items-center gap-2.5">
        <button 
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-2xs text-[12px] font-semibold text-slate-700 hover:bg-white hover:border-slate-300 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <span>Tiếng Việt</span>
        </button>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 shadow-2xs text-[12px] font-bold text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Hệ thống sẵn sàng</span>
        </div>
      </div>

      {/* Main Container: 2-column on desktop (Left Quick Roles, Right Login Form) */}
      <main className="w-full flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Quick Role Selector (5 cols) */}
          <motion.div 
            className="lg:col-span-5 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Mô phỏng Đăng nhập theo Vai trò</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 font-display tracking-tight leading-tight">
                Chọn tài khoản demo để đăng nhập tức thì
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Nhấp vào bất kỳ vai trò nào dưới đây để trải nghiệm quyền hạn thực tế từ cấp Giám đốc điều hành đến nhân viên:
              </p>
            </div>

            {/* 4 Test Account Cards */}
            <div className="space-y-2.5 pt-1">
              {testAccounts.map((acc) => {
                const IconComponent = acc.icon;
                const isSelected = employeeId === acc.id;
                return (
                  <button
                    key={acc.roleKey}
                    type="button"
                    onClick={() => handleSelectQuickAccount(acc)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/10'
                        : 'bg-white/80 hover:bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={ROLES[acc.roleKey]?.avatar}
                        name={acc.name}
                        id={acc.id}
                        size="md"
                        shape="rounded"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {acc.name}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${acc.badgeColor}`}>
                            {acc.level}
                          </span>
                        </div>
                        <div className="text-[11px] font-medium text-slate-600">
                          {acc.title}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {acc.email} • Mã: <span className="font-mono">{acc.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-blue-50 group-hover:text-blue-600 text-slate-400 flex items-center justify-center transition-all shrink-0">
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Hint Box */}
            <div className="p-3 bg-slate-100/80 rounded-xl border border-slate-200/70 text-[11px] text-slate-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Mật khẩu chung cho tất cả các tài khoản demo là: <strong className="font-mono text-slate-900">nexus@2026</strong>
              </span>
            </div>
          </motion.div>

          {/* Right: Traditional Login Card (7 cols) */}
          <motion.div 
            className="lg:col-span-7 flex justify-center"
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div 
              className="w-full max-w-[460px] bg-white border border-slate-200/90 rounded-3xl p-7 md:p-9 shadow-xl transition-all duration-200 relative"
            >
              {/* Header */}
              <div className="flex flex-col items-center text-center">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-blue-500/25">
                  N
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="text-base font-extrabold text-slate-900 tracking-wider font-display uppercase">
                    NEXUS HRMS
                  </span>
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                    Enterprise AI
                  </span>
                </div>

                <h1 className="mt-1 text-xl font-black text-slate-900 font-display tracking-tight">
                  Đăng nhập Hệ thống
                </h1>
                <p className="mt-1 text-xs text-slate-500 max-w-xs">
                  Nhập mã nhân viên và mật khẩu được cấp hoặc xác thực nhanh bằng sinh trắc học Face ID
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                {/* Employee ID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Mã Nhân Viên / Email Công Việc:</span>
                    <span className="text-[10px] text-slate-400 font-normal">Ví dụ: NV-1001 hoặc hrd@fwbnexus.vn</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <BadgeCheck className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      placeholder="Nhập mã nhân viên..."
                      className="w-full h-11 pl-10 pr-4 text-xs font-medium bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Mật khẩu:</label>
                    <button
                      type="button"
                      onClick={() => alert('Vui lòng liên hệ phòng IT Helpdesk: it-support@fwbnexus.vn')}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu..."
                      className="w-full h-11 pl-10 pr-10 text-xs font-medium bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-xs text-slate-600 font-medium">Duy trì đăng nhập trong 30 ngày</span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all duration-150 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-75 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Đang xác thực bảo mật...</span>
                      </>
                    ) : (
                      <>
                        <span>Đăng nhập vào Hệ thống</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-[1px] bg-slate-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    HOẶC XÁC THỰC SINH TRẮC HỌC
                  </span>
                </div>
              </div>

              {/* Quick Biometric FaceID Trigger */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleStartFaceId}
                  className="w-full h-10 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-2xs flex items-center justify-center gap-2.5 transition-all hover:border-blue-300 hover:text-blue-700 group cursor-pointer"
                >
                  <ScanFace className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span>Xác thực bằng Sinh Trắc Học Face ID</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center border-t border-slate-200/80 bg-white/60">
        <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            Entra Identity Core Enterprise ISO 27001
          </span>
          <span>•</span>
          <span>Bản quyền © 2026 NEXUS HRMS (Đồ án Quản lý Dự án CNTT - Nhóm 2)</span>
        </div>
      </footer>

      {/* Apple-style FaceID Simulation Modal */}
      <AnimatePresence>
        {isFaceIdOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div 
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 z-10 flex flex-col items-center text-center"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Camera Scanner Simulation */}
              <div className="relative w-36 h-36 rounded-full bg-slate-50 border-2 border-blue-500/40 flex items-center justify-center my-4 overflow-hidden shadow-inner">
                <Avatar
                  src={ROLES.HR_DIRECTOR.avatar}
                  name={ROLES.HR_DIRECTOR.name}
                  id="NV-1001"
                  size="2xl"
                  shape="circle"
                />

                {/* Scanning Laser */}
                {faceIdStep === 1 && (
                  <motion.div 
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#06b6d4]"
                    animate={{ top: ['10%', '90%', '10%'] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  />
                )}

                {/* Success Overlay */}
                {faceIdStep === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-emerald-600/30 backdrop-blur-2xs flex items-center justify-center text-white"
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 drop-shadow-md" />
                  </motion.div>
                )}
              </div>

              {/* Status text */}
              <h3 className="text-base font-bold text-slate-900 font-display">
                {faceIdStep === 1 && 'Đang quét sinh trắc học khuôn mặt 3D...'}
                {faceIdStep === 2 && 'Đã khớp dữ liệu: Trần Mai Hương'}
                {faceIdStep === 3 && 'Xác thực thành công! Đang vào hệ thống...'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {faceIdStep === 1 && 'Vui lòng nhìn thẳng vào camera và giữ cố định'}
                {faceIdStep === 2 && 'Mã NV: NV-1001 • Giám đốc Nhân sự'}
                {faceIdStep === 3 && 'Độ tin cậy sinh trắc học: 99.8% (Hợp lệ)'}
              </p>

              {/* Cancel Button */}
              {faceIdStep !== 3 && (
                <button
                  type="button"
                  onClick={() => setIsFaceIdOpen(false)}
                  className="mt-5 px-4 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium"
                >
                  Hủy thao tác
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
