'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthContext';
import { HiOutlineHome, HiOutlineCheckCircle, HiOutlineCalendar, HiBars3 } from 'react-icons/hi2';
import { IoMenu } from "react-icons/io5";

export default function BottomTabs() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated || pathname === '/login' || pathname === '/register' || pathname === '/loading') {
    return null;
  }

  const tabs = [
    { name: 'Home', href: '/dashboard', Icon: HiOutlineHome },
    { name: 'Tarefas', href: '/tasks', Icon: HiOutlineCheckCircle },
    { name: 'Calendário', href: '/calendar', Icon: HiOutlineCalendar },
    { name: 'Configurações', href: '/settings', Icon: HiBars3 },
  ];

  return (
    <nav
      className="fixed bottom-6 left-2.5 right-2.5 h-16"
      style={{
        background: 'linear-gradient(to bottom, #06141F 30%, #1C3B4F 100%)',
        borderRadius: '62px',
        border: '1px solid #1C3B4F',
      }}
    >
      <div className="flex justify-around items-center h-full w-full px-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.Icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center h-full flex-1 ${
                isActive ? 'text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              <div className={`flex items-center justify-center h-12 w-full ${isActive ? 'bg-[#1C3B4F] rounded-full' : ''}`}>
                <Icon className="text-3xl" />
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
