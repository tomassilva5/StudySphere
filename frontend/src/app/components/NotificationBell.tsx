'use client';

import { useState } from 'react';
import { HiBell, HiXMark, HiCheckCircle } from 'react-icons/hi2';
import { useNotifications } from '../providers/NotificationContext';
import { useRouter } from 'next/navigation';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const router = useRouter();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task':
        return '📋';
      case 'group':
        return '👥';
      case 'event':
        return '📅';
      case 'summary':
        return '📊';
      default:
        return '🔔';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `Há ${minutes}min`;
    if (hours < 24) return `Há ${hours}h`;
    return `Há ${days}d`;
  };

  const handleNotificationClick = (notificationId: string, taskId?: string) => {
    markAsRead(notificationId);
    if (taskId) {
      router.push('/tasks');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
      >
        <HiBell className="text-white" size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Notificações Panel */}
          <div className="absolute right-0 top-12 z-50 w-80 max-h-96 bg-[#0A1F2E] border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-[#1C3B4F]/50">
              <h3 className="text-white font-bold">Notificações</h3>
              {notifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[#57F177] text-sm hover:underline flex items-center gap-1"
                >
                  <HiCheckCircle size={16} />
                  Marcar todas como lidas
                </button>
              )}
            </div>

            {/* Lista */}
            <div className="overflow-y-auto max-h-80">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <HiBell className="mx-auto mb-2" size={48} />
                  <p>Sem notificações</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id, notification.taskId)}
                    className={`p-4 border-b border-gray-700/50 hover:bg-white/5 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-[#57F177]/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`font-medium ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                            {notification.title}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <HiXMark size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatTime(notification.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-700 bg-[#1C3B4F]/30">
                <button
                  onClick={() => {
                    clearAll();
                    setIsOpen(false);
                  }}
                  className="w-full text-center text-red-400 text-sm hover:text-red-300 transition-colors"
                >
                  Limpar todas
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
