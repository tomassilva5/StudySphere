// pages/loading.tsx
'use client';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Loading() {
//bloco para redirecionamento automático com timer
//Comnentado para testar a página de loading isoladamente
/* 
    const router = useRouter();

  useEffect(() => {
    // Redireciona para a página principal após 2 segundos (ajusta o tempo conforme necessário)
    const timer = setTimeout(() => {
      router.push('/dashboard'); // ou '/home', '/tasks', etc.
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
*/
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
