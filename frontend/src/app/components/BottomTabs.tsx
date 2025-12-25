'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthContext';
import { HiOutlineHome, HiOutlineCheckCircle, HiBars3 } from 'react-icons/hi2';
import { MdGroups } from "react-icons/md";

export default function BottomTabs() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated || pathname === '/login' || pathname === '/register' || pathname === '/loading' || pathname === '/calendar') {
    return null;
  }

  const tabs = [
    { name: 'Home', href: '/dashboard', Icon: HiOutlineHome },
    { name: 'Tarefas', href: '/tasks', Icon: HiOutlineCheckCircle },
    { name: 'Grupos', href: '/groups', Icon: MdGroups },
    { name: 'Configurações', href: '/settings', Icon: HiBars3 },
  ];

  return (
    <nav
      className="fixed bottom-6 left-2.5 right-2.5 h-16 z-10"
      style={{
        background: 'linear-gradient(to bottom, #06141F 30%, #1C3B4F 100%)',
        borderRadius: '62px',
        border: '1px solid #1C3B4F',
      }}
    >
      <div className="flex justify-around items-center h-full w-full">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.Icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center justify-center h-full flex-1"
            >
              <Icon className={`text-3xl ${isActive ? 'text-white' : 'text-gray-400'}`} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
