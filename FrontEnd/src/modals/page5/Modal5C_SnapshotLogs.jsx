import React, { useState } from 'react';
import AppleModal from '../../components/motion/AppleModal';
import { Clock, ShieldCheck, Camera, CheckCircle2, MapPin, Wifi, X, Search, Calendar, ChevronRight, ExternalLink } from 'lucide-react';

export default function Modal5C_SnapshotLogs({ isOpen, onClose, payload }) {
  const [activeTab, setActiveTab] = useState('all');

  const logs = [
    {
      id: 'LOG-9921',
      date: '12/09/2026',
      time: '08:02:14',
      type: 'Vào ca (Check-in)',
      gate: 'Kiosk Cổng Chính #01',
      score: '99.4%',
      status: 'Hợp lệ',
      snapshot: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      ip: '192.168.10.45',
      gps: '10.7769° N, 106.7009° E',
    },
    {
      id: 'LOG-9874',
      date: '11/09/2026',
      time: '18:05:30',
      type: 'Tan ca (Check-out)',
      gate: 'Kiosk Cửa Phụ B2 #02',
      score: '98.9%',
      status: 'Hợp lệ',
      snapshot: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      ip: '192.168.10.46',
      gps: '10.7769° N, 106.7009° E',
    },
    {
      id: 'LOG-9840',
      date: '11/09/2026',
      time: '08:14:02',
      type: 'Vào ca (Check-in)',
      gate: 'Kiosk Cổng Chính #01',
      score: '99.1%',
      status: 'Hợp lệ',
      snapshot: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      ip: '192.168.10.45',
      gps: '10.7769° N, 106.7009° E',
    },
    {
      id: 'LOG-9792',
      date: '10/09/2026',
      time: '18:12:44',
      type: 'Tan ca (Check-out)',
      gate: 'Kiosk Cổng Chính #01',
      score: '99.6%',
      status: 'Hợp lệ',
      snapshot: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      ip: '192.168.10.45',
      gps: '10.7769° N, 106.7009° E',
    },
    {
      id: 'LOG-9750',
      date: '10/09/2026',
      time: '08:08:19',
      type: 'Vào ca (Check-in)',
      gate: 'Kiosk Cổng Chính #01',
      score: '99.2%',
      status: 'Hợp lệ',
      snapshot: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      ip: '192.168.10.45',
      gps: '10.7769° N, 106.7009° E',
    },
  ];

  return (
    <AppleModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Nhật ký chấm công và Đối soát ảnh chụp nhận diện</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Đối soát sinh trắc học
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Nhân viên: <strong className="text-slate-800 font-semibold">Phạm Minh Quân (NV-0842)</strong> • Phòng Kỹ thuật Phần mềm
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* KPI Ribbon */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-[11px] font-medium text-slate-500">Số ngày đã làm</div>
            <div className="text-lg font-extrabold text-slate-900 mt-0.5">9 / 9 ngày</div>
            <div className="text-[10px] font-semibold text-emerald-600">100% chuyên cần</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-[11px] font-medium text-slate-500">Đi muộn / Về sớm</div>
            <div className="text-lg font-extrabold text-slate-900 mt-0.5">0 lượt</div>
            <div className="text-[10px] font-semibold text-emerald-600">Tuân thủ hoàn hảo</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-[11px] font-medium text-slate-500">Tăng ca (OT)</div>
            <div className="text-lg font-extrabold text-slate-900 mt-0.5">4.5 giờ</div>
            <div className="text-[10px] font-semibold text-blue-600">Đã phê duyệt</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-[11px] font-medium text-slate-500">Độ tin cậy FaceID TB</div>
            <div className="text-lg font-extrabold text-emerald-600 mt-0.5">99.3%</div>
            <div className="text-[10px] font-semibold text-emerald-600">Xác thực sinh trắc học</div>
          </div>
        </div>

        {/* Table list */}
        <div className="mt-5 border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Ảnh chụp FaceID</th>
                <th className="py-2.5 px-3">Thời gian ghi nhận</th>
                <th className="py-2.5 px-3">Sự kiện</th>
                <th className="py-2.5 px-3">Độ tin cậy nhận diện</th>
                <th className="py-2.5 px-3">Thiết bị và Cổng</th>
                <th className="py-2.5 px-3 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-2 px-3">
                    <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 group">
                      <img
                        src={item.snapshot}
                        alt="Snapshot"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                        }}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <ExternalLink className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <div className="font-mono font-bold text-slate-900">{item.time}</div>
                    <div className="text-[11px] text-slate-400">{item.date}</div>
                  </td>
                  <td className="py-2 px-3">
                    <span className="font-semibold text-slate-800">{item.type}</span>
                    <div className="text-[10px] text-slate-400">Mã log: {item.id}</div>
                  </td>
                  <td className="py-2 px-3">
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {item.score}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">Liveness Test: Passed</div>
                  </td>
                  <td className="py-2 px-3">
                    <div className="font-medium text-slate-800">{item.gate}</div>
                    <div className="text-[10px] text-slate-400">IP: {item.ip}</div>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-200 text-[11px]">
                      {item.status} ✓
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400">Tất cả dữ liệu hình ảnh được mã hóa tuân thủ chuẩn an toàn thông tin ISO 27001.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition active:scale-95"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </AppleModal>
  );
}
