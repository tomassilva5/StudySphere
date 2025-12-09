'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (token: string, userData?: any) => void;
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

  const login = (token: string, userData?: any) => {
    // Guardar token em cookie (httpOnly seria mais seguro, mas requer backend)
    // Para dev: usar cookie regular
    document.cookie = `authToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
    
    // Guardar dados de utilizador em localStorage (opcional)
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
    }
    
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Remover token de cookie
    document.cookie = 'authToken=; path=/; max-age=0';
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
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

