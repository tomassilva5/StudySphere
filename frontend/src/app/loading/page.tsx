// pages/loading.tsx
'use client';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthContext';

export default function Loading() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redireciona após 2 segundos
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

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
        <div className="w-12 h-12 border-4 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-zinc-50 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
