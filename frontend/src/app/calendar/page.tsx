'use client';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';

export default function CalendarPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center pb-20" style={{ backgroundColor: '#06141F' }}>
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
