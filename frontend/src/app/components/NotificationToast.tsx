'use client';
import { useNotifications } from '../providers/NotificationContext';
import { HiXMark } from "react-icons/hi2";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function NotificationToast() {
  const { notifications, markAsRead } = useNotifications();
  const [activeToast, setActiveToast] = useState<any>(null);
  const pathname = usePathname();

  const hidePaths = ["/login", "/register", "/development"];
  const shouldHide = hidePaths.includes(pathname);

  useEffect(() => {
    if (shouldHide) return;

    const latestUnread = notifications.find(n => !n.read);
    
    if (latestUnread && (!activeToast || activeToast.id !== latestUnread.id)) {
      setActiveToast(latestUnread);
      
      const audio = new Audio('/audio/notification-sound.mp3.wav');
      audio.play().catch(() => {});

      const timer = setTimeout(() => setActiveToast(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [notifications, shouldHide, activeToast]);

  if (shouldHide || !activeToast) return null;

  return (
    <div className="fixed top-4 left-0 right-0 z-[9999] flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-sm bg-[#1C3B4F]/95 backdrop-blur-lg border border-[#57F177]/40 rounded-2xl shadow-2xl p-4 flex items-start gap-4 animate-bounce-in ring-1 ring-white/10">
        
        <div className="w-12 h-12 flex-shrink-0 bg-[#06141F] rounded-xl p-1.5 shadow-lg border border-white/5">
          <img src="/Logo/Logo_sem_fundo.png" alt="Logo" className="w-full h-full object-contain" />
        </div>

        <div className="flex-1">
          <h4 className="text-white font-bold text-sm leading-tight">{activeToast.title}</h4>
          <p className="text-gray-300 text-xs mt-1">{activeToast.message}</p>
        </div>
        
        <button 
          onClick={() => {
            markAsRead(activeToast.id); 
            setActiveToast(null);
          }} 
          className="text-gray-500 hover:text-white p-1 transition-colors"
        >
          <HiXMark size={20} />
        </button>
      </div>
    </div>
  );
}