'use client';

import { HiPlus } from 'react-icons/hi2';

export default function ButtonAdd({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Adicionar"
      className="fixed bottom-26 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-[#57F177] to-[#4CB2D8] shadow-xl flex items-center justify-center text-white text-2xl z-50"
      style={{ pointerEvents: 'auto' }}
    >
      <HiPlus />
    </button>
  );
}