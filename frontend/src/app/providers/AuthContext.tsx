'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; username: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar se token existe em cookie (definido pelo servidor durante login)
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('authToken='))
      ?.split('=')[1];

    if (token) {
      setIsAuthenticated(true);
      try {
        // Tentar recuperar dados de utilizador se existirem
        const stored = localStorage.getItem('userData');
        if (stored) setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);


  // URL base do backend
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const login = async (identifier: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // importante para cookies httpOnly
        body: JSON.stringify({ identifier, password })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { success: false, error: data.message || 'Erro ao autenticar.' };
      }
      const data = await res.json();
      // Espera-se que o backend envie user (token pode vir em cookie httpOnly)
      if (data.user) {
        localStorage.setItem('userData', JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Resposta inesperada do servidor.' };
    } catch (err) {
      return { success: false, error: 'Erro de rede.' };
    }
  };

  const register = async (data: { name: string; username: string; email: string; password: string }) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const resp = await res.json().catch(() => ({}));
        return { success: false, error: resp.message || 'Erro ao registar.' };
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Erro de rede.' };
    }
  };

  const logout = () => {
    // Remover token de cookie
    document.cookie = 'authToken=; path=/; max-age=0';
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

