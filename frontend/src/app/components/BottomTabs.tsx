'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthContext';
import { useUI } from '@/app/providers/UIContext';
import { HiOutlineHome, HiCheckCircle, HiBars3 } from 'react-icons/hi2';
import { MdGroups } from "react-icons/md";

export default function BottomTabs() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { isBottomTabsVisible } = useUI();

  if (!isAuthenticated || pathname === '/login' || pathname === '/register' || pathname === '/loading' || pathname === '/calendar' || pathname === '/intro' || pathname === '/notifications') {
    return null;
  }

  if (!isBottomTabsVisible) {
    return null;
  }

  const tabs = [
    { name: 'Home', href: '/dashboard', Icon: HiOutlineHome },
    { name: 'Tarefas', href: '/tasks', Icon: HiCheckCircle }, 
    { name: 'Grupos', href: '/groups', Icon: MdGroups },
    { name: 'Configurações', href: '/settings', Icon: HiBars3 },
  ];

  return (
    <nav
      className="fixed bottom-6 left-2.5 right-2.5 h-16 z-40"
      style={{
        background: 'linear-gradient(to bottom, #06141F 30%, #1C3B4F 100%)',
        borderRadius: '62px',
        border: '1px solid #1C3B4F',
      }}
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="tab-fade-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop stopColor="#57F177" offset="0%" />
            <stop stopColor="#4CB2D8" offset="100%" />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex justify-around items-center h-full w-full">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.Icon;
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center justify-center h-full flex-1 transition-all duration-300"
            >
              <div className={`p-2 rounded-lg flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-gray-800/50' : ''}`}>
                <Icon 
                  size={24}
                  style={{ 
                    fill: isActive ? 'url(#blue-green-gradient)' : '#9CA3AF',
                  }} 
                />
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}