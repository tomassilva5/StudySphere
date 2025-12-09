'use client';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Loading() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    // SEM BACKGROUND AQUI (transparente)
    <div className="flex min-h-screen flex-col items-center justify-center relative">
      <div className="flex flex-col items-center">
        <div className="relative h-48 w-48 mb-8">
          <Image
            src="/Logo/Logo_sem_fundo.png"
            alt="StudySphere logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="w-12 h-12 border-4 border-zinc-700 border-t-[#6EE7B7] rounded-full animate-spin"></div>
      </div>
    </div>
  );
}