import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import Avatar from '../common/Avatar';
import { Search, Bell, Sparkles, ChevronDown, User, Calendar, FileText, ArrowRight, LogOut } from 'lucide-react';
import { mockEmployees } from '../../data/mockEmployees';
import { mockNotificationsData } from '../../data/mockNotifications';

export default function Topbar() {
  const { currentRole } = useAuth();
  const { openModal } = useModal();
  const navigate = useNavigate();

  const roleKey = currentRole?.key || 'EMPLOYEE';
  const roleNotifications = mockNotificationsData[roleKey] || mockNotificationsData.EMPLOYEE;
  const unreadCount = roleNotifications.filter(n => !n.isRead).length;

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const searchResults = searchQuery.trim()
    ? mockEmployees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.department.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between shrink-0 select-none z-30 relative">
      {/* Search Bar with Ctrl+K shortcut badge và live dropdown */}
      <div className="flex items-center gap-2 max-w-md w-full relative">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm nhân sự, phòng ban, bảng lương..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full h-9 pl-9 pr-14 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl outline-none transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            <span className="text-[10px] font-bold bg-white border border-slate-200 text-slate-400 px-1.5 py-0.5 rounded shadow-2xs">
              Ctrl K
            </span>
          </div>
        </div>

        {/* Live Search Results Dropdown */}
        {isSearchOpen && searchQuery.trim() && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsSearchOpen(false)}
            />
            <div className="absolute top-11 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Kết quả tìm kiếm nhân sự ({searchResults.length})
              </div>
              {searchResults.length > 0 ? (
                searchResults.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      openModal('modal4B', emp);
                    }}
                    className="w-full p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar src={emp.avatar} name={emp.name} id={emp.id} size="xs" />
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {emp.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {emp.id} • {emp.department}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Xem hồ sơ chi tiết <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-slate-400">
                  Không tìm thấy nhân sự phù hợp
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right Tools: Date, Language, Notifications, User */}
      <div className="flex items-center gap-3">
        {/* Real-time Date Badge */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 font-medium bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>Thứ Hai, 12/09/2026 - 08:30</span>
        </div>

        <div className="h-4 w-[1px] bg-slate-200 hidden lg:block" />

        {/* Language selector */}
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <span>Tiếng Việt</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Notification Bell - Clearly visible button and offset badge */}
        <button
          type="button"
          onClick={() => openModal('modalNotificationCenter')}
          className="relative w-9 h-9 rounded-xl bg-slate-100/90 hover:bg-slate-200/90 text-slate-700 flex items-center justify-center transition-colors cursor-pointer border border-slate-200"
          title={`Thông báo hệ thống (${unreadCount} chưa đọc)`}
        >
          <Bell className="w-4 h-4 text-slate-700 stroke-[2.2]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Support Assistant Button */}
        <button
          type="button"
          onClick={() => openModal('modal8B')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/90 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
          title="Mở trợ lý hỗ trợ"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Trợ lý hỗ trợ</span>
        </button>

        {/* User Info và Avatar with Dropdown */}
        <div className="relative">
          <div 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer hover:bg-slate-50 p-1.5 rounded-xl transition-colors group"
            title="Tài khoản cá nhân"
          >
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                {currentRole.name}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 truncate max-w-[160px]">
                {currentRole.title}
              </span>
            </div>
            <Avatar
              src={currentRole.avatar}
              name={currentRole.name}
              id={currentRole.id}
              size="sm"
              shape="circle"
              statusBadge="online"
            />
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Menu */}
          {isProfileMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsProfileMenuOpen(false)} 
              />
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header User Card */}
                <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                  <Avatar
                    src={currentRole.avatar}
                    name={currentRole.name}
                    id={currentRole.id}
                    size="md"
                    shape="circle"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {currentRole.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {currentRole.title}
                    </div>
                    <span className="inline-block px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200 mt-1">
                      {currentRole.level}
                    </span>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-2 space-y-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      openModal('modal4B', currentRole);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100/80 hover:text-blue-600 flex items-center gap-2.5 font-semibold transition-colors cursor-pointer text-xs"
                  >
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>Hồ sơ nhân sự chi tiết</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('/login');
                    }}
                    className="w-full px-3 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-semibold transition-colors cursor-pointer text-xs border border-transparent hover:border-rose-100"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Đăng xuất tài khoản</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
