'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  name: string;
  email: string;
  username?: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; username: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // URL base do backend - agora usa proxy do Next.js na mesma origem
  const API_URL = '/api/v1';

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Verificar se existe userData no localStorage primeiro
        const stored = localStorage.getItem('userData');
        if (stored) {
          setUser(JSON.parse(stored) as User);
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Tentar refresh se não houver userData
        const response = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem('userData');
        }
      } catch {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [API_URL]);

  const login = async (identifier: string, password: string) => {
    if (!identifier || !password) {
      return { success: false, error: 'Credenciais em falta.' };
    }

    const payload = identifier.includes('@')
      ? { email: identifier, palavra_passe: password }
      : { nome_utilizador: identifier, palavra_passe: password };

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        return { success: false, error: body.message || 'Erro ao iniciar sessão.' };
      }

      const identity = payload.email ?? payload.nome_utilizador ?? '';
      const username = payload.nome_utilizador || (payload.email?.split('@')[0] || '');
      const userData = { 
        name: identity.split('@')[0], 
        email: payload.email ?? `${payload.nome_utilizador}@local`,
        username: username
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Erro no login', error);
      return { success: false, error: 'Erro de ligação ao servidor.' };
    }
  };

  const register = async (data: { name: string; username: string; email: string; password: string }) => {
    if (!data.email || !data.password) {
      return { success: false, error: 'Dados em falta.' };
    }

    const payload = {
      nome_completo: data.name,
      nome_utilizador: data.username,
      email: data.email,
      palavra_passe: data.password,
    };

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        return { success: false, error: body.message || 'Erro ao registar.' };
      }

      const userData = { name: data.name || data.email.split('@')[0], email: data.email };
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Erro no registo', error);
      return { success: false, error: 'Erro de ligação ao servidor.' };
    }
  };

  const logout = () => {
    fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).finally(() => {
      localStorage.removeItem('userData');
      setIsAuthenticated(false);
      setUser(null);
    });
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
