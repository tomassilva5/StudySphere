// app/dashboard/page.tsx
'use client';

import { useAuth } from '@/app/providers/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center pb-24"
      style={{
        backgroundColor: '#06141F',
      }}
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Bem-vindo ao Dashboard!
        </h1>
        <p className="text-zinc-300 mb-8">
          O redirecionamento funcionou com sucesso.
        </p>
        
        {/* Card de bem-vindo */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-8 max-w-md mx-auto mb-6 shadow-lg">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Olá, Utilizador!
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Explore as funcionalidades disponíveis através do menu de tabs inferior.
          </p>
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
          >
            Sair
          </button>
        </div>

        {/* Info de stats */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
            <p className="text-blue-400 text-sm font-medium">Tarefas</p>
            <p className="text-2xl font-bold text-blue-500">0</p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
            <p className="text-green-400 text-sm font-medium">Eventos</p>
            <p className="text-2xl font-bold text-green-500">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
