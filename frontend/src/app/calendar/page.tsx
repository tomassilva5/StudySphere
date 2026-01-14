'use client';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import { useEffect } from 'react';

export default function CalendarPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  // Sincronização invisível ao utilizador
  useEffect(() => {
    const syncGoogle = async () => {
      try {
        await fetch(`${API_URL}/api/v1/google/calendar/sync`, {
          method: 'POST',
          credentials: 'include',
        });
      } catch (error) {
      }
    };

    // Sincronizar na primeira vez que a página carrega
    syncGoogle();

    // Sincronizar a cada 2 minutos em background
    const interval = setInterval(() => {
      syncGoogle();
    }, 2 * 60 * 1000); // 2 minutos

    return () => clearInterval(interval);
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center pb-20" style={{background: 'var(--background)'}}>
      <div className="flex flex-col items-center text-center p-4">
        <h1 className="text-3xl font-bold text-white mb-6">Calendário</h1>
        <p className="text-zinc-400 text-lg mb-3">Esta página está em desenvolvimento.</p>
        <p className="text-zinc-400 text-lg mb-8">Agradecemos a compreensão.</p>

        <button
          onClick={handleGoBack}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition"
          style={{ background: 'linear-gradient(to right, #57F177, #4CB2D8)' }}
        >
          <FiArrowLeft />
          Voltar
        </button>
      </div>
    </div>
  );
}
