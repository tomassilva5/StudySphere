'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthContext';
import InputField from '../components/InputField';

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useAuth();
    
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // TODO: Integrar com API de backend
            // const response = await fetch('/api/auth/register', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ name, username, email, password }),
            // });
            // const data = await response.json();
            // if (!response.ok) throw new Error(data.message);

            // Simulação: criar utilizador e autenticar
            const mockToken = `token-${Date.now()}`;
            const userData = { name, username, email };
            
            // Autentica após registar
            login(mockToken, userData);
            
            // Redireciona para dashboard
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao registar');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen flex-col overflow-hidden" style={{background: 'var(--background)'}}>

            <div className="flex-1 flex flex-col items-center justify-start pt-4 px-6">
                
                {/* 1. BLOCO LOGO/FRASE: Reduzi mb-4 para mb-2 (Aproxima o formulário) */}
                <div className="mb-2 flex flex-col items-center text-center">
                    
                    {/* LOGO: Posição Mantida (mb-0 agora) */}
                    <div className="relative mb-0 h-[268px] w-[268px]"> 
                        <Image
                            src="/Logo/Logo.jpg" 
                            alt="StudySphere Logo"
                            fill
                            className="object-contain rounded-full"
                            priority
                        />
                    </div>
                    
                    <p className="text-gray-200 text-base font-bold tracking-wide mt-0">
                        Crie a sua conta
                    </p>
                </div>

                <form id="register-form" onSubmit={handleRegister} className="w-full max-w-sm space-y-3">
                    
                    <InputField
                        id="name"
                        label="Nome Completo"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <InputField
                        id="email"
                        label="E-mail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <InputField
                        id="username"
                        label="Nome de Utilizador"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <InputField
                        id="password"
                        label="Palavra-passe"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </form>
            </div>

            <div className="w-full bg-[#06141F] border-t-2 border-gray-700 px-6 py-6 flex flex-col items-center gap-3 bg-gradient-to-t from-[#1C3B4F] to-[#06141F]">
                
                <button
                    type="submit"
                    form="register-form"
                    disabled={isLoading}
                    className={`w-full max-w-sm rounded-xl py-3.5 text-base font-bold text-white shadow-lg transition-all
                        ${isLoading 
                            ? "bg-gray-600 cursor-not-allowed opacity-70" 
                            : "bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] hover:opacity-90 active:scale-[0.98]"
                        }`}
                >
                    {isLoading ? "A criar conta..." : "Registar"}
                </button>

                {error && (
                    <div className="w-full max-w-sm p-3 rounded-lg bg-red-900/30 border border-red-500 text-red-200 text-sm">
                        {error}
                    </div>
                )}

                <Link href="/login" className="w-full max-w-sm">
                    <button 
                        type="button"
                        className="w-full rounded-xl border-2 border-[#6EE7B7] py-3.5 text-[#6EE7B7] font-bold tracking-wide hover:bg-[#6EE7B7] hover:text-[#06141F] transition-all"
                    >
                        Voltar
                    </button>
                </Link>

            </div>

        </div>
    );
}