import React from 'react';
import AppleModal from '../../components/motion/AppleModal';
import { Printer, Download, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Modal3C_PayslipPdf({ isOpen, onClose, payload }) {
  const employeeName = payload?.name || 'Nguyễn Văn An';
  const employeeId = payload?.id || 'NV-1024';
  const role = payload?.role || 'Kỹ sư Phần mềm Fullstack';
  const department = payload?.department || payload?.dept || 'Phòng Kỹ thuật Phần mềm';
  const baseSalary = payload?.contractSalary || 25000000;
  const kpiBonus = 5000000;
  const lunchAllowance = 1200000;
  const gross = baseSalary + kpiBonus + lunchAllowance;
  const bhxh = Math.round(baseSalary * 0.105);
  const tax = 1200000;
  const totalDeduction = bhxh + tax;
  const net = gross - totalDeduction;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    try {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}
    alert('Đang tải xuống file PDF phiếu lương có chữ ký số điện tử: Phieu_luong_T08_2026.pdf');
  };

  return (
    <AppleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Phiếu Thanh Toán Tiền Lương Điện Tử"
      subtitle="Kỳ lương Tháng 08/2026 • Đã chuyển khoản qua Techcombank ngày 05/09/2026"
      maxWidth="max-w-3xl"
    >
      <div className="p-6 space-y-6">
        {/* Printable Paper Card */}
        <div className="bg-white border border-slate-300 rounded-2xl p-8 shadow-sm text-xs font-sans relative">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-xl shadow-sm">
                N
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">CÔNG TY CỔ PHẦN CÔNG NGHỆ FWB NEXUS</div>
                <div className="text-[11px] text-slate-400">MST: 0312345678 • Nexus Tower, Cầu Giấy, Hà Nội</div>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">
                ĐÃ CHI TRẢ THÀNH CÔNG
              </span>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">Bút toán: #PAY-202608-{employeeId}</div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center my-5">
            <h2 className="text-base font-bold uppercase text-slate-900 font-display">
              PHIẾU LƯƠNG VÀ QUYẾT TOÁN THU NHẬP CÁ NHÂN
            </h2>
            <p className="text-slate-500 text-[11px] mt-0.5">Kỳ tính lương: Tháng 08/2026 (01/08 - 31/08/2026)</p>
          </div>

          {/* Employee Info Grid */}
          <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-5">
            <div>
              <span className="text-slate-500">Họ và tên:</span> <strong className="text-slate-900">{employeeName}</strong>
            </div>
            <div>
              <span className="text-slate-500">Mã nhân viên:</span> <strong className="font-mono text-slate-900">{employeeId}</strong>
            </div>
            <div>
              <span className="text-slate-500">Chức danh:</span> <span className="text-slate-800">{role}</span>
            </div>
            <div>
              <span className="text-slate-500">Phòng ban:</span> <span className="text-slate-800">{department}</span>
            </div>
            <div>
              <span className="text-slate-500">Tài khoản nhận:</span> <span className="font-mono text-slate-800">1903 8847 2919 • Techcombank</span>
            </div>
            <div>
              <span className="text-slate-500">Ngày công chuẩn:</span> <strong className="text-blue-600">22 / 22 ngày (100%)</strong>
            </div>
          </div>

          {/* Income Breakdown */}
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 uppercase text-[11px] mb-2 text-blue-700">
                I. CÁC KHOẢN THU NHẬP
              </h3>
              <table className="w-full border border-slate-200 rounded-lg overflow-hidden">
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 text-slate-700">1. Lương cơ bản theo hợp đồng lao động</td>
                    <td className="p-2 text-right font-mono font-bold text-slate-900">+{baseSalary.toLocaleString('vi-VN')} đ</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 text-slate-700">2. Thưởng hiệu suất KPI Sprint 4 (Đạt 96.0%)</td>
                    <td className="p-2 text-right font-mono font-bold text-emerald-600">+{kpiBonus.toLocaleString('vi-VN')} đ</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 text-slate-700">3. Phụ cấp ăn trưa và thiết bị công nghệ</td>
                    <td className="p-2 text-right font-mono font-bold text-slate-900">+{lunchAllowance.toLocaleString('vi-VN')} đ</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td className="p-2 text-slate-800">TỔNG THU NHẬP GỘP</td>
                    <td className="p-2 text-right font-mono text-blue-700 text-sm">+{gross.toLocaleString('vi-VN')} đ</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 uppercase text-[11px] mb-2 text-rose-700">
                II. CÁC KHOẢN KHẤU TRỪ THEO LUẬT ĐỊNH
              </h3>
              <table className="w-full border border-slate-200 rounded-lg overflow-hidden">
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 text-slate-700">1. Trích nộp BHXH, BHYT, BHTN</td>
                    <td className="p-2 text-right font-mono text-rose-600 font-semibold">-{bhxh.toLocaleString('vi-VN')} đ</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 text-slate-700">2. Thuế thu nhập cá nhân tạm khấu trừ</td>
                    <td className="p-2 text-right font-mono text-rose-600 font-semibold">-{tax.toLocaleString('vi-VN')} đ</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td className="p-2 text-slate-800">TỔNG CÁC KHOẢN KHẤU TRỪ</td>
                    <td className="p-2 text-right font-mono text-rose-600 text-sm">-{totalDeduction.toLocaleString('vi-VN')} đ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* NET SALARY HIGHLIGHT */}
          <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-100">
                THỰC LĨNH CHUYỂN KHOẢN
              </span>
              <div className="text-2xl font-bold font-display mt-0.5">
                {net.toLocaleString('vi-VN')} VNĐ
              </div>
              <div className="text-[11px] text-blue-100 italic mt-0.5">
                (Bằng chữ: Hai mươi tám triệu bốn trăm năm mươi nghìn đồng)
              </div>
            </div>

            <div className="text-center p-2 bg-white/10 backdrop-blur rounded-xl border border-white/20">
              <QrCode className="w-10 h-10 text-white mx-auto" />
              <span className="text-[9px] font-mono text-blue-100 block mt-1">Xác thực số</span>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Mã bảo mật chữ ký số điện tử: <span className="font-mono text-slate-700 font-bold">SHA-256: 9e4f..88a1</span></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>In phiếu lương</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải file PDF</span>
            </button>
          </div>
        </div>
      </div>
    </AppleModal>
  );
}
