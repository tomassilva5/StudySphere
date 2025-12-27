'use client';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthContext';

export default function Loading() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, router]);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(to bottom, #06141F 60%, #1C3B4F 100%)',
      }}
    >
      <div className="flex flex-col items-center">
        <Image
          src="/Logo/Logo_sem_fundo.png"
          alt="StudySphere logo"
          width={200}
          height={200}
          priority
          style={{ objectFit: 'contain', marginBottom: '30px' }}
        />
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-zinc-300 border-t-[#57F177] dark:border-zinc-700 rounded-full animate-spin"></div>
          <p className="text-zinc-400 text-sm">A carregar...</p>
        </div>
      </div>
    </div>
  );
}
