'use client';

import { useState } from 'react';
import { useAuth } from '@/app/providers/AuthContext';

export default function Settings() {
  const { logout } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--background)' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Configurações</h1>

        {/* Perfil */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Perfil
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                placeholder="Seu nome"
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
              />
            </div>
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
              Atualizar Perfil
            </button>
          </div>
        </div>

        {/* Preferências */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Preferências
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Notificações</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Receber notificações</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-12 h-6 rounded-full transition ${
                  notifications ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-700'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition transform ${
                    notifications ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Segurança */}
        <div className="bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800 p-6">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
            Segurança
          </h2>
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
