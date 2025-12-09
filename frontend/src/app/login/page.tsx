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

    // Validação para ativar/desativar o botão
    const isFormValid = identifier.trim().length > 0 && password.trim().length > 0;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isFormValid) return;

        setIsLoading(true);
        console.log('Logging in with', { identifier, password });
        setTimeout(() => {
            setIsLoading(false);
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao fazer login');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col " style={{background: 'var(--background)'}}>

            <div className="flex-1 flex flex-col items-center justify-start pt-6 px-6">
                
                <div className="mb-4 flex flex-col items-center text-center">
                    <div className="relative mb-2 h-[268px] w-[268px]">
                        <Image src="/Logo/Logo.jpg" alt="StudySphere Logo" fill className="object-contain rounded-full" priority />
                    </div>
                    <p className="text-gray-200 text-base font-bold tracking-wide">
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
                    />

                    <div className="space-y-1">
                        <InputField
                            id="password"
                            label="Palavra-passe"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
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
                        className={`w-full rounded-xl py-3.5 text-base font-bold text-white shadow-lg transition-all mt-2
                            ${isLoading || !isFormValid
                                ? "bg-gray-600 cursor-not-allowed opacity-70" 
                                : "bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] hover:opacity-90 active:scale-[0.98]"
                            }`}
                    >
                        {isLoading ? "A entrar..." : "Entrar"}
                    </button>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-900/30 border border-red-500 text-red-200 text-sm">
                            {error}
                        </div>
                    )}
                </form>
            </div>

            <div className="w-full border-t-2 border-gray-700/50 px-6 py-6 flex flex-col items-center bg-gradient-to-t from-[#1C3B4F] to-[#06141F]">
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