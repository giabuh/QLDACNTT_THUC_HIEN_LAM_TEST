import React, { useState } from 'react';
import AppleModal from '../../components/motion/AppleModal';
import { Upload, FileSpreadsheet, Download, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Modal4C_ImportExcel({ isOpen, onClose }) {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSimulateUpload = () => {
    setFileName('Danh_sach_nhan_su_moi_T9_2026.xlsx');
    setFileUploaded(true);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);
  };

  const handleConfirmImport = () => {
    setSuccess(true);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1600);
  };

  return (
    <AppleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Nhập danh sách nhân sự từ file Microsoft Excel"
      subtitle="Hỗ trợ định dạng .xlsx, .xls • Tự động kiểm tra trùng lặp mã nhân viên và CCCD"
      maxWidth="max-w-2xl"
    >
      <div className="p-6 space-y-4 text-xs">
        {/* Template download link */}
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-900 font-medium">
            <FileSpreadsheet className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Chưa có biểu mẫu chuẩn? Tải về file mẫu NEXUS HR Excel Template.</span>
          </div>
          <button
            type="button"
            onClick={() => alert('Đang tải xuống Mau_nhap_lieu_nhan_su_NEXUS_v2.xlsx')}
            className="text-blue-700 font-bold hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải file mẫu (.xlsx)</span>
          </button>
        </div>

        {/* Upload Dropzone */}
        {!fileUploaded ? (
          <div
            onClick={handleSimulateUpload}
            className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-blue-50/20 flex flex-col items-center justify-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">
                Nhấp để chọn file Excel hoặc kéo thả vào đây
              </p>
              <p className="text-slate-400 text-[11px] mt-1">
                Dung lượng tối đa: 10MB • Hỗ trợ tối đa 1.000 dòng dữ liệu mỗi lần nạp
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-emerald-900">{fileName}</div>
                <div className="text-[11px] text-emerald-700 mt-0.5">
                  Đã đọc 24 dòng dữ liệu hợp lệ • 0 lỗi định dạng
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setFileUploaded(false)}
              className="text-xs text-slate-500 hover:text-rose-600 font-semibold underline"
            >
              Chọn file khác
            </button>
          </div>
        )}

        {/* Validation summary preview */}
        {fileUploaded && (
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="bg-slate-100/80 px-3 py-2 font-bold text-slate-700 border-b border-slate-200 flex justify-between">
              <span>Bản xem trước dữ liệu (3 dòng đầu tiên)</span>
              <span className="text-emerald-700">✓ Sẵn sàng nhập</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-2">Họ và tên</th>
                  <th className="p-2">Mã NV</th>
                  <th className="p-2">Phòng ban</th>
                  <th className="p-2">Mức lương</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2 font-bold text-slate-900">Vũ Minh Khang</td>
                  <td className="p-2 font-mono text-slate-600">NV-1049</td>
                  <td className="p-2">Kỹ thuật Phần mềm</td>
                  <td className="p-2 font-mono font-semibold text-slate-800">24,000,000 đ</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-slate-900">Bùi Diệu Linh</td>
                  <td className="p-2 font-mono text-slate-600">NV-1050</td>
                  <td className="p-2">Marketing và Truyền thông</td>
                  <td className="p-2 font-mono font-semibold text-slate-800">18,500,000 đ</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-slate-900">Trần Quốc Đạt</td>
                  <td className="p-2 font-mono text-slate-600">NV-1051</td>
                  <td className="p-2">Tài chính Kế toán</td>
                  <td className="p-2 font-mono font-semibold text-slate-800">21,000,000 đ</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-colors cursor-pointer"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={!fileUploaded || isProcessing || success}
            onClick={handleConfirmImport}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {success ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Đã nhập thành công 24 nhân sự!</span>
              </>
            ) : isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang kiểm tra đối soát...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Tiến hành nạp vào cơ sở dữ liệu</span>
              </>
            )}
          </button>
        </div>
      </div>
    </AppleModal>
  );
}
