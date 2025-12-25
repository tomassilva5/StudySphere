'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthContext';
import InputField from '../components/InputField';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const isIdentifierValid = identifier.trim().length > 0;
    const isPasswordValid = password.trim().length > 0;
    const isFormValid = isIdentifierValid && isPasswordValid;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setHasSubmitted(true);
        setError('');
        
        if (!isFormValid) return;

        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            login("token-exemplo");
            router.push('/dashboard');
        } catch (err) {
            setError('Erro ao iniciar sessão.');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen flex-col overflow-hidden" style={{background: 'var(--background)' }}>

            <div className="flex-1 flex flex-col items-center justify-start pt-4 px-6 overflow-y-auto">

                {/* Logo + Frase */}
                <div className="mb-4 flex flex-col items-center text-center">
                    <div className="relative mb-0 h-[268px] w-[268px]">
                        <Image src="/Logo/Logo.jpg" alt="Logo" fill className="object-contain rounded-full" priority />
                    </div>
                    <p className="text-gray-200 text-base font-bold tracking-wide mt-0">
                        Acede à tua conta para continuar
                    </p>
                </div>

                <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">

                    <InputField
                        id="identifier"
                        label="E-mail ou Nome de Utilizador"
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        error={hasSubmitted && !isIdentifierValid}
                    />

                    <div>
                        <InputField
                            id="password"
                            label="Palavra-passe"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            error={hasSubmitted && !isPasswordValid}
                        />

                        <div className="flex justify-end">
                            <Link href="#" className="text-xs text-[#6EE7B7] hover:underline opacity-80 pt-1">
                                Esqueceu a Palavra-passe?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !isFormValid}
                        className={`w-full rounded-xl py-3.5 text-base font-bold text-white shadow-lg transition-all
                            ${isLoading || !isFormValid
                                ? "bg-gray-600 cursor-not-allowed opacity-70" 
                                : "bg-gradient-to-r from-[#57F177] to-[#4CB2D8] hover:opacity-90 active:scale-[0.98]"}
                        `}
                    >
                        {isLoading ? "A entrar..." : "Entrar"}
                    </button>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-900/30 border border-red-500 text-red-200 text-sm text-center">
                            {error}
                        </div>
                    )}

                </form>
            </div>

            <div className="w-full bg-[#06141F] border-t-2 border-gray-700 px-6 py-6 flex flex-col items-center gap-3 bg-gradient-to-t from-[#1C3B4F] to-[#06141F] mt-auto">

                <p className="text-white text-lg font-bold mb-3">
                    Ainda não tens conta?
                </p>

                <Link href="/register" className="w-full max-w-sm">
                    <button 
                        type="button"
                        className="w-full rounded-xl border-2 border-[#6EE7B7] py-3.5 text-[#6EE7B7] font-bold uppercase tracking-wide hover:bg-[#6EE7B7] hover:text-[#06141F] transition-all"
                    >
                        Registar
                    </button>
                </Link>
            </div>

        </div>
    );
}
