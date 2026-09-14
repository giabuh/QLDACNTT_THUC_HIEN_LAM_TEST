import React, { useState, useEffect } from 'react';
import AppleModal from '../../components/motion/AppleModal';
import { Camera, CheckCircle2, ShieldCheck, UserCheck, RefreshCw, X, Sparkles, MapPin, Wifi } from 'lucide-react';

export default function Modal5A_KioskGate({ isOpen, onClose, payload }) {
  const [scanState, setScanState] = useState('scanning'); // 'scanning', 'success'
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setScanState('scanning');
      const scanTimer = setTimeout(() => {
        setScanState('success');
      }, 1600);
      return () => clearTimeout(scanTimer);
    }
  }, [isOpen]);

  const handleSimulateRescan = () => {
    setScanState('scanning');
    setTimeout(() => {
      setScanState('success');
    }, 1400);
  };

  return (
    <AppleModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Mô phỏng Nhận diện Face ID Kiosk</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  AI Edge 60 FPS
                </span>
              </div>
              <p className="text-xs text-slate-500">Cổng chính Tòa nhà Nexus Tower • Kiosk Terminal #01</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport Simulation */}
        <div className="mt-5 relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center shadow-inner">
          {/* Background Image / Stream representation */}
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
            alt="Facial Stream"
            className="w-full h-full object-cover filter brightness-[0.9] contrast-[1.05]"
          />

          {/* HUD Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/50 pointer-events-none" />

          {/* Live Clock & Terminal status */}
          <div className="absolute top-3 left-4 flex items-center gap-2 text-white font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{time.toLocaleTimeString('vi-VN')}</span>
            <span className="text-slate-400">• GPS Lock: 10.7769° N, 106.7009° E</span>
          </div>

          <div className="absolute top-3 right-4 flex items-center gap-2 text-xs text-emerald-300 bg-slate-900/80 px-2.5 py-1 rounded-full border border-emerald-500/30 backdrop-blur-sm">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mạng nội bộ WiFi6: Ổn định</span>
          </div>

          {/* Central Face Target Bounding Box */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`relative w-48 h-56 rounded-2xl transition-all duration-300 border-2 ${
                scanState === 'success' ? 'border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.5)]' : 'border-cyan-400 animate-pulse'
              }`}
            >
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-300 rounded-tl" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-300 rounded-tr" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-300 rounded-bl" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-300 rounded-br" />

              {/* Scan laser line animation */}
              {scanState === 'scanning' && (
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce top-1/2" />
              )}

              {/* Status pill inside box */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                {scanState === 'scanning' ? (
                  <span className="px-3 py-1 bg-cyan-950/90 text-cyan-300 text-[11px] font-bold rounded-full border border-cyan-500/40 shadow-sm flex items-center gap-1.5 backdrop-blur-sm">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Đang quét điểm trắc học 3D...
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-emerald-900/90 text-emerald-200 text-[11px] font-bold rounded-full border border-emerald-400/40 shadow-sm flex items-center gap-1.5 backdrop-blur-sm">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Khớp dữ liệu: 99.4% (Hợp lệ)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Banner */}
          {scanState === 'success' && (
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3.5 border border-emerald-200 shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">Phạm Minh Quân (NV-0842)</span>
                    <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded">Vào ca lúc 08:02</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Kỹ sư Phần mềm • Cổng xoay đã mở (Turnstile Gate #01 Unlocked)</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Đã ghi nhận ✓
              </span>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleSimulateRescan}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Quét lại khuôn mặt
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
          >
            Hoàn tất và Đóng
          </button>
        </div>
      </div>
    </AppleModal>
  );
}
