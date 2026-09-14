import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Volume2, 
  Maximize, 
  Minimize,
  RefreshCw,
  Scan,
  ShieldCheck,
  Building
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Page_KioskFullscreen() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [isScanning, setIsScanning] = useState(true);
  const [lastCheckIn, setLastCheckIn] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSimulateCheckIn = () => {
    setIsScanning(false);
    setLastCheckIn({
      name: 'Nguyễn Văn Tuấn',
      id: 'NV-1028',
      role: 'Kỹ sư Phần mềm',
      time: new Date().toLocaleTimeString('vi-VN'),
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch (e) {}

    // Reset back to scan mode after 3.5 seconds
    setTimeout(() => {
      setIsScanning(true);
      setLastCheckIn(null);
    }, 3500);
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-white flex flex-col justify-between select-none overflow-hidden relative">
      {/* Top Header */}
      <header className="px-8 py-5 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/attendance')}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Thoát Kiosk"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xl font-display">
              N
            </div>
            <div>
              <div className="font-bold text-base tracking-wider font-display">KIOSK CỔNG CHÍNH A1</div>
              <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Văn phòng Trụ sở chính Hà Nội • Camera 1080p AI
              </div>
            </div>
          </div>
        </div>

        {/* Live Clock */}
        <div className="text-right">
          <div className="font-mono text-3xl font-bold tracking-tight text-white">
            {time.toLocaleTimeString('vi-VN')}
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Thứ Hai, ngày 12 tháng 09 năm 2026
          </div>
        </div>
      </header>

      {/* Main Center Stage */}
      <main className="flex-1 flex flex-col items-center justify-center relative p-6">
        {/* Camera Viewfinder Frame */}
        <div className="relative w-full max-w-lg aspect-[3/4] max-h-[580px] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-900 flex items-center justify-center">
          {/* Feed */}
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
            alt="Kiosk Camera"
            className="w-full h-full object-cover"
          />

          {/* Oval Guide */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
            <svg className="w-72 h-96" viewBox="0 0 200 260">
              <ellipse cx="100" cy="130" rx="85" ry="115" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="8 8" />
            </svg>
          </div>

          {/* Laser Scanner */}
          {isScanning && (
            <motion.div
              className="absolute inset-x-4 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee]"
              animate={{ top: ['10%', '90%', '10%'] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            />
          )}

          {/* Success Overlay when detected */}
          <AnimatePresence>
            {lastCheckIn && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-6 bottom-8 bg-slate-900/90 backdrop-blur-xl border border-emerald-400/80 rounded-2xl p-4 text-center shadow-2xl flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/40">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Điểm danh thành công!</h3>
                  <p className="text-sm font-semibold text-emerald-400 mt-0.5">
                    {lastCheckIn.name} • {lastCheckIn.id}
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Thời gian vào ca: {lastCheckIn.time} • Đúng giờ
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prompt banner */}
          <div className="absolute top-6 inset-x-6 text-center">
            <span className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur border border-white/20 text-xs font-semibold text-white/90">
              {isScanning ? 'Vui lòng đứng thẳng và nhìn vào camera để điểm danh' : 'Đang xử lý dữ liệu...'}
            </span>
          </div>
        </div>

        {/* Action button for user/demo */}
        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            onClick={handleSimulateCheckIn}
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Camera className="w-5 h-5" />
            <span>Mô phỏng Quẹt thẻ / Nhận diện Face ID</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Bảo mật sinh trắc học AES-256 • Thuật toán NEXUS Biometric v4.2</span>
        </div>
        <div>
          <span>Chế độ Kiosk Cổng dành cho Tablet/iPad treo tường</span>
        </div>
      </footer>
    </div>
  );
}
