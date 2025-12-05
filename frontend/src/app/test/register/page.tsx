'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthContext';
import Link from 'next/link';

export default function TestRegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.fullname || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Por favor, preencha todos os campos');
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não correspondem');
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres');
        setIsLoading(false);
        return;
      }

      const mockToken = `token-${Date.now()}`;
      login(mockToken);
      router.push('/dashboard');
    } catch (err) {
      setError('Erro ao registar. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        background: 'linear-gradient(to bottom, #06141F 0%, #1C3B4F 100%)',
      }}
    >
      <div className="w-full max-w-md">
        {/* Card de registo */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 text-center">
            StudySphere
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-center mb-8">
            Crie sua conta (TESTE)
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Nome Completo */}
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="João Silva"
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu.email@example.com"
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-1">
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-1">
                Confirmar Senha
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Botão de registo */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition mt-6"
            >
              {isLoading ? 'A registar...' : 'Registar'}
            </button>
          </form>

          {/* Link para login */}
          <p className="text-center text-zinc-600 dark:text-zinc-400 text-sm mt-6">
            Já tem conta?{' '}
            <Link href="/test/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Faça Login
            </Link>
          </p>

          {/* Info de teste */}
          <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-600 dark:text-blue-400">
              <strong>🧪 Página de Teste:</strong> Complete o formulário para simular registo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
