'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { HiBell, HiXMark, HiBellAlert } from 'react-icons/hi2';
import { useNotifications } from '../providers/NotificationContext';
import { useRouter } from 'next/navigation';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, deleteNotification, clearAll } = useNotifications();
  const router = useRouter();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `Há ${minutes}min`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleNotificationClick = (notificationId: string, taskId?: string) => {
    markAsRead(notificationId);
    if (taskId) router.push('/tasks');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Ícone do Sino com Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/10 rounded-xl transition-all active:scale-95"
      >
        <HiBell className="text-white" size={26} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-[#57F177] text-[#06141F] text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-[#06141F]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && createPortal(
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setIsOpen(false)} />
          <div className="fixed right-6 top-20 z-9999 w-[320px] bg-[#122533] border-2 border-[#57F177]/40 rounded-3xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.9)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-white/10 bg-[#1C3B4F] flex justify-between items-center">
              <h3 className="text-white font-bold text-lg tracking-tight">Notificações</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors"
              >
                <HiXMark size={24} />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[380px] custom-scrollbar bg-[#122533]">
              {notifications.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <HiBellAlert size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">Sem notificações</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id, notification.taskId)}
                    className={`p-4 border-b border-white/5 flex gap-4 items-center cursor-pointer transition-all hover:bg-white/10 relative ${
                      !notification.read ? 'bg-[#57F177]/5' : 'bg-transparent'
                    }`}
                  >
                    <div className="w-10 h-10 shrink-0 bg-[#0A1A24] rounded-xl p-1.5 shadow-md border border-white/10">
                      <img src="/Logo/Logo_sem_fundo.png" alt="StudySphere" className="w-full h-full object-contain" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className={`text-sm font-bold leading-tight truncate ${!notification.read ? 'text-white' : 'text-gray-400'}`}>
                          {notification.title}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-gray-600 hover:text-red-500 p-0.5 transition-colors"
                        >
                          <HiXMark size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{notification.message}</p>
                      <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-widest">{formatTime(notification.timestamp)}</p>
                    </div>

                    {!notification.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#57F177] shadow-[0_0_10px_rgba(87,241,119,0.5)]" />
                    )}
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-4 bg-[#0A1A24] text-center border-t border-white/5">
                <button
                  onClick={() => {
                    clearAll();
                    setIsOpen(false);
                  }}
                  className="text-red-500 text-[10px] font-black hover:text-red-400 transition-colors uppercase tracking-[0.2em]"
                >
                  Limpar todas
                </button>
              </div>
            )}
          </div>
        </>,
        document.body
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #122533; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1C3B4F; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #57F177; }
      `}</style>
    </div>
  );
}