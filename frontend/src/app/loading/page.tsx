// pages/loading.tsx
'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthContext';

export default function Loading() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();
  const [showTestButtons, setShowTestButtons] = useState(false);

  useEffect(() => {
    // Redireciona após 2 segundos
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/test/login');
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  const handleTestLogin = () => {
    // Login simulado para testes
    login('test-token-12345');
    router.replace('/dashboard');
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center relative"
      style={{
        background: 'linear-gradient(to bottom, #06141F 60%, #1C3B4F 100%)',
      }}
    >
      {/* Botão para mostrar testes (canto superior direito) */}
      <button
        onClick={() => setShowTestButtons(!showTestButtons)}
        className="absolute top-4 right-4 text-xs text-zinc-400 hover:text-zinc-200 underline"
      >
        🧪 Dev
      </button>

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

      {/* Botões de teste (hidden por padrão) */}
      {showTestButtons && (
        <div className="absolute bottom-8 flex flex-col gap-2 items-center">
          <p className="text-xs text-zinc-400 mb-2">Modo de Teste:</p>
          <button
            onClick={handleTestLogin}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition"
          >
            ✓ Simular Login
          </button>
          <button
            onClick={() => router.push('/test/login')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
          >
            → Ir para Login
          </button>
        </div>
      )}
    </div>
  );
}
