import React, { useState } from 'react';
import AppleModal from '../../components/motion/AppleModal';
import { Building2, Download, FileSpreadsheet, CheckCircle2, ShieldCheck, X, FileText, ArrowUpRight } from 'lucide-react';

export default function Modal7B_BankTransfer({ isOpen, onClose, payload }) {
  const [selectedBank, setSelectedBank] = useState('vcb'); // 'vcb', 'tcb', 'napas'
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const sampleAccounts = [
    { stt: 1, id: 'NV-0842', name: 'Phạm Minh Quân', account: '0071001289456', bank: 'Vietcombank - CN Sài Gòn', amount: '24.150.000 đ', status: 'Hợp lệ' },
    { stt: 2, id: 'NV-0843', name: 'Trần Mai Hương', account: '0071009872134', bank: 'Vietcombank - CN Sài Gòn', amount: '35.800.000 đ', status: 'Hợp lệ' },
    { stt: 3, id: 'NV-0844', name: 'Lê Minh Tuấn', account: '0071004561239', bank: 'Vietcombank - CN Thủ Đức', amount: '18.420.000 đ', status: 'Hợp lệ' },
    { stt: 4, id: 'NV-0845', name: 'Hoàng Văn Long', account: '0071007892341', bank: 'Vietcombank - CN Tân Bình', amount: '32.100.000 đ', status: 'Hợp lệ' },
    { stt: 5, id: 'NV-0846', name: 'Đỗ Thùy Trang', account: '0071003456782', bank: 'Vietcombank - CN Sài Gòn', amount: '16.750.000 đ', status: 'Hợp lệ' },
  ];

  const handleExport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <AppleModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Xuất lệnh chi lương Ngân hàng và Ủy nhiệm chi (UNC)</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Sẵn sàng kết xuất
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Kỳ lương: <strong className="text-slate-800">Tháng 09/2026</strong> • Đơn vị chi trả: <strong className="text-slate-800">CÔNG TY CP CÔNG NGHỆ FWB NEXUS</strong>
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

        {/* Bank Tabs */}
        <div className="mt-4 flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setSelectedBank('vcb')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              selectedBank === 'vcb'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Vietcombank iB@nk (312 NV - 3.450.280.000 đ)
          </button>
          <button
            onClick={() => setSelectedBank('tcb')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              selectedBank === 'tcb'
                ? 'bg-rose-50 text-rose-800 border border-rose-300 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Techcombank Business (24 NV - 285.400.000 đ)
          </button>
          <button
            onClick={() => setSelectedBank('napas')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              selectedBank === 'napas'
                ? 'bg-blue-50 text-blue-800 border border-blue-300 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            NAPAS 24/7 (12 NV - 106.820.000 đ)
          </button>
        </div>

        {/* Batch Info Card */}
        <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-400 block text-[11px]">Tài khoản nguồn trích nợ:</span>
              <span className="font-mono font-bold text-slate-800">0071 000 888 999 (VND)</span>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block text-[11px]">Tổng số tiền đợt chi:</span>
              <span className="font-bold text-emerald-700 text-sm">3.450.280.000 đ</span>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block text-[11px]">Mã định danh lô chi lương:</span>
              <span className="font-mono font-semibold text-slate-700">SAL-202609-VCB01</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Tài khoản trích nợ đủ số dư
          </span>
        </div>

        {/* Account Table Preview */}
        <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">STT</th>
                <th className="py-2.5 px-3">Mã NV</th>
                <th className="py-2.5 px-3">Họ và tên</th>
                <th className="py-2.5 px-3 font-mono">Số tài khoản thụ hưởng</th>
                <th className="py-2.5 px-3">Chi nhánh ngân hàng</th>
                <th className="py-2.5 px-3 text-right">Thực nhận (VND)</th>
                <th className="py-2.5 px-3 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sampleAccounts.map(acc => (
                <tr key={acc.stt} className="hover:bg-slate-50/70 transition">
                  <td className="py-2 px-3 text-slate-400">{acc.stt}</td>
                  <td className="py-2 px-3 font-mono font-semibold text-slate-800">{acc.id}</td>
                  <td className="py-2 px-3 font-bold text-slate-900">{acc.name}</td>
                  <td className="py-2 px-3 font-mono text-slate-700">{acc.account}</td>
                  <td className="py-2 px-3 text-slate-500">{acc.bank}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">{acc.amount}</td>
                  <td className="py-2 px-3 text-center">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[10px] border border-emerald-200">
                      {acc.status} ✓
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {downloadSuccess && (
          <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-center font-bold text-xs">
            ✓ Đã tải xuống file lệnh chi mã hóa CSV (Chuẩn Vietcombank iB@nk B2B) và file PDF Ủy nhiệm chi!
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Dữ liệu được mã hóa chuẩn SHA-256 theo tiêu chuẩn kết nối ngân hàng điện tử B2B.
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              In Ủy nhiệm chi (PDF)
            </button>
            <button
              onClick={handleExport}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Xuất File CSV Lệnh Chi Ngân Hàng
            </button>
          </div>
        </div>
      </div>
    </AppleModal>
  );
}
