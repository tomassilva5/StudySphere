'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function IntroPage() {
  const router = useRouter();

  const handleStart = () => {
    // 1. Guardar na memória que o utilizador já viu a intro
    localStorage.setItem('hasSeenIntro', 'true');
    
    // 2. Redirecionar para o Login
    router.push('/login');
  };

  return (
    <div className="flex h-screen flex-col items-center justify-between bg-gradient-to-b from-[#06141F] via-[#0B1F2E] to-[#1C3B4F] px-6 py-12">
      
      {/* Imagem / Ilustração no Topo */}
      <div className="flex flex-1 flex-col items-center justify-center w-full">
        <div className="relative h-64 w-64 mb-8">
          <Image 
            src="/Logo/Logo.jpg" // Ou uma ilustração de onboarding se tiveres
            alt="StudySphere" 
            fill 
            className="object-contain rounded-full shadow-2xl"
            priority
          />
        </div>
        
        <h1 className="text-3xl font-bold text-white text-center mb-4">
          Bem-vindo ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6]">StudySphere</span>
        </h1>
        
        <p className="text-gray-300 text-center text-lg max-w-xs leading-relaxed">
          Organiza as tuas tarefas, grupos e estudos num só lugar. Simples e eficiente.
        </p>
      </div>

      {/* Botão de Ação no Fundo */}
      <div className="w-full max-w-sm">
        <button 
          onClick={handleStart}
          className="w-full rounded-2xl bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] py-4 text-lg font-bold text-white shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Começar Agora
        </button>
      </div>

    </div>
  );
}