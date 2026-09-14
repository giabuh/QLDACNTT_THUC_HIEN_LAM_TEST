import React, { useState } from 'react';
import AppleModal from '../../components/motion/AppleModal';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import { mockNotificationsData } from '../../data/mockNotifications';
import Avatar from '../../components/common/Avatar';
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  ShieldAlert, 
  Calendar, 
  FileText,
  Filter,
  Check
} from 'lucide-react';

export default function Modal_NotificationCenter({ isOpen, onClose }) {
  const { currentRole } = useAuth();
  const { openModal } = useModal();

  const roleKey = currentRole?.key || 'EMPLOYEE';
  const rawList = mockNotificationsData[roleKey] || mockNotificationsData.EMPLOYEE;

  const [notifications, setNotifications] = useState(rawList);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread' | 'urgent'

  // Re-sync if role changes
  React.useEffect(() => {
    setNotifications(mockNotificationsData[roleKey] || mockNotificationsData.EMPLOYEE);
  }, [roleKey]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleItemClick = (notif) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n => (n.id === notif.id ? { ...n, isRead: true } : n))
    );

    // Open corresponding business modal
    switch (notif.actionType) {
      case 'leave_detail':
        openModal('modal6E', notif.actionPayload);
        break;
      case 'notice_popup':
        openModal('modalNotificationDetail', notif.actionPayload);
        break;
      case 'late_absence_popup':
        openModal('modal2A', notif.actionPayload);
        break;
      case 'payslip_popup':
        openModal('modal3C', notif.actionPayload);
        break;
      case 'health_popup':
        openModal('modal3B', notif.actionPayload);
        break;
      case 'ot_popup':
        openModal('modal3A', notif.actionPayload);
        break;
      case 'payroll_anomaly_popup':
        openModal('modal7A', notif.actionPayload);
        break;
      case 'bank_transfer_popup':
        openModal('modal7B', notif.actionPayload);
        break;
      case 'turnover_popup':
        openModal('modal8A', notif.actionPayload);
        break;
      default:
        openModal('modalNotificationDetail', notif.actionPayload);
        break;
    }
  };

  const filteredNotifications = notifications.filter(item => {
    if (activeTab === 'unread') return !item.isRead;
    if (activeTab === 'urgent') return item.priority === 'high';
    return true;
  });

  return (
    <AppleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Trung Tâm Thông Báo Hệ Thống"
      subtitle={`Hộp thư dành riêng cho: ${currentRole?.name} (${currentRole?.title})`}
      badge={
        <span className="bg-rose-50 text-rose-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
          <Bell className="w-3.5 h-3.5" />
          {unreadCount > 0 ? `${unreadCount} thông báo mới` : 'Đã đọc tất cả'}
        </span>
      }
      maxWidth="max-w-2xl"
    >
      <div className="p-6 space-y-4 text-xs font-sans">
        {/* Filter Tabs & Mark All Read Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('unread')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'unread'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chưa đọc ({unreadCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('urgent')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'urgent'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Khẩn cấp / Cần duyệt
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-blue-600 hover:text-blue-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer self-end sm:self-center"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Đánh dấu tất cả đã đọc</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3 max-h-[58vh] overflow-y-auto pr-1">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                <Bell className="w-5 h-5" />
              </div>
              <p className="font-bold text-slate-700">Không có thông báo nào trong mục này</p>
              <p className="text-slate-400 text-[11px]">Bạn đã cập nhật và xử lý toàn bộ các thông báo mới nhất.</p>
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative group flex flex-col gap-2.5 ${
                  item.isRead
                    ? 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                    : 'bg-blue-50/30 border-blue-200 hover:border-blue-400 hover:bg-blue-50/50 shadow-2xs'
                }`}
              >
                {/* Unread indicator badge */}
                {!item.isRead && (
                  <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                )}

                {/* Sender & Category Header */}
                <div className="flex items-center justify-between gap-3 pr-4">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar
                      src={item.sender.avatar}
                      name={item.sender.name}
                      id={item.sender.id}
                      size="sm"
                      shape="rounded"
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 block truncate leading-tight">
                        {item.sender.name}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {item.sender.role}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${item.categoryBadge}`}>
                    {item.category}
                  </span>
                </div>

                {/* Title & Summary */}
                <div className="space-y-1">
                  <h4 className={`text-xs font-bold transition-colors ${
                    item.isRead ? 'text-slate-800' : 'text-slate-950 font-display'
                  }`}>
                    {item.title}
                  </h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                    {item.summary}
                  </p>
                </div>

                {/* Timestamp & Action Button */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100/80 text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </span>

                  <span className="text-blue-600 group-hover:text-blue-700 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-all">
                    <span>{item.actionButtonText || 'Xem chi tiết'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500">
          <span className="text-[11px]">Thông báo tự động đồng bộ theo thời gian thực</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </AppleModal>
  );
}
