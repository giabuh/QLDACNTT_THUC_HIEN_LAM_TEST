import React, { useState } from "react";
import AppleModal from "../../components/motion/AppleModal";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function Modal4F_JobTitleManage({ isOpen, onClose }) {
  const [jobTitles, setJobTitles] = useState([
    { id: 1, title: "Tổng Giám Đốc (CEO)", code: "JOB-CEO", level: "Cấp 1 - Lãnh đạo tối cao", salaryRange: "80 - 150 triệu", count: 1 },
    { id: 2, title: "Giám Đốc Nhân Sự (CHRO)", code: "JOB-HRD", level: "Cấp 2A - Quản trị Lương và Phúc lợi", salaryRange: "40 - 70 triệu", count: 1 },
    { id: 3, title: "Trưởng Phòng Kỹ Thuật (Tech Lead)", code: "JOB-TL", level: "Cấp 2B - Trưởng bộ phận", salaryRange: "35 - 55 triệu", count: 4 },
    { id: 4, title: "Kỹ Sư Phần Mềm Cao Cấp (Senior SE)", code: "JOB-SSE", level: "Cấp 3 - Nhân viên", salaryRange: "25 - 40 triệu", count: 48 },
    { id: 5, title: "Chuyên Viên Tuyển Dụng và Đào Tạo", code: "JOB-HR-SPEC", level: "Cấp 3 - Nhân viên HR", salaryRange: "15 - 25 triệu", count: 8 },
    { id: 6, title: "Chuyên Viên Kế Toán và Thuế", code: "JOB-ACC", level: "Cấp 3 - Nhân viên Tài chính", salaryRange: "16 - 28 triệu", count: 6 },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    level: "Cấp 3 - Nhân viên",
    salaryRange: "",
  });

  const [filterLevel, setFilterLevel] = useState("all");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newJob = {
      id: Date.now(),
      title: formData.title,
      code: formData.code || `JOB-${Math.floor(100 + Math.random() * 900)}`,
      level: formData.level,
      salaryRange: formData.salaryRange || "Thỏa thuận theo năng lực",
      count: 0,
    };

    setJobTitles([newJob, ...jobTitles]);
    setFormData({ title: "", code: "", level: "Cấp 3 - Nhân viên", salaryRange: "" });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const handleDelete = (id) => {
    setJobTitles(jobTitles.filter(j => j.id !== id));
  };

  const filtered = jobTitles.filter(j => {
    if (filterLevel === "all") return true;
    return j.level.startsWith(filterLevel);
  });

  return (
    <AppleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Quản lý Danh mục Chức danh và Khung Cấp bậc"
      subtitle="Chuẩn hóa hệ thống chức danh nghề nghiệp, phân tầng vai trò và khung lương chuẩn"
      maxWidth="max-w-4xl"
    >
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        {/* Add Job Title Form */}
        <div className="md:col-span-1 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-purple-600" /> Thêm Chức Danh Mới
          </h3>
          <form onSubmit={handleAdd} className="flex flex-col gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Tên Chức Danh *
              </label>
              <input
                type="text"
                required
                placeholder="VD: Senior DevOps Engineer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Mã Chức Danh
              </label>
              <input
                type="text"
                placeholder="VD: JOB-DEVOPS"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Cấp Bậc và Vai Trò (Phân quyền)
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Cấp 1 - Lãnh đạo tối cao">Cấp 1 - Lãnh đạo tối cao (CEO/BOD)</option>
                <option value="Cấp 2A - Quản trị C&B">Cấp 2A - Quản trị C&B / Trưởng HR</option>
                <option value="Cấp 2B - Trưởng bộ phận">Cấp 2B - Trưởng Bộ Phận / Line Manager</option>
                <option value="Cấp 3 - Nhân viên">Cấp 3 - Nhân viên tiêu chuẩn</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Dải Lương Tham Chiếu
              </label>
              <input
                type="text"
                placeholder="VD: 25 - 40 triệu"
                value={formData.salaryRange}
                onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Thêm chức danh</span>
            </button>
          </form>
        </div>

        {/* Job Titles List */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-800">
              Danh sách chức danh ({filtered.length})
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Lọc cấp bậc:</span>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded-md text-slate-700 focus:outline-none"
              >
                <option value="all">Tất cả cấp bậc</option>
                <option value="Cấp 1">Cấp 1 (Lãnh đạo)</option>
                <option value="Cấp 2A">Cấp 2A (Quản trị HR)</option>
                <option value="Cấp 2B">Cấp 2B (Trưởng phòng)</option>
                <option value="Cấp 3">Cấp 3 (Nhân viên)</option>
              </select>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
            {filtered.map((item) => (
              <div key={item.id} className="p-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-slate-900 truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-medium border border-slate-200">
                      {item.code}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                      item.level.includes("Cấp 1")
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : item.level.includes("Cấp 2A")
                        ? "bg-blue-50 text-blue-800 border-blue-200"
                        : item.level.includes("Cấp 2B")
                        ? "bg-purple-50 text-purple-800 border-purple-200"
                        : "bg-emerald-50 text-emerald-800 border-emerald-200"
                    }`}>
                      {item.level.split(" - ")[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-500">
                    <span>Khung lương: <strong className="text-slate-800 font-medium">{item.salaryRange}</strong></span>
                    <span>Số lượng: <strong className="text-slate-800 font-medium">{item.count} nhân sự</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Xóa chức danh"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppleModal>
  );
}
