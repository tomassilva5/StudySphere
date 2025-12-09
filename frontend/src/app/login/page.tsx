'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputField from '../components/InputField';

export default function LoginPage() {
    const router = useRouter();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        console.log('Logging in with', { email, password });
        setTimeout(() => {
            setIsLoading(false);
            router.push('/dashboard');
        }, 1500);
    };

    return (
        <div className="flex min-h-screen flex-col">

            <div className="flex-1 flex flex-col items-center justify-start pt-6 px-6">
                
                <div className="mb-4 flex flex-col items-center text-center">
                    <div className="relative mb-2 h-[268px] w-[268px]">
                        <Image
                            src="/Logo/Logo.jpg" 
                            alt="StudySphere Logo"
                            fill
                            className="object-contain rounded-full"
                            priority
                        />
                    </div>
                    
                    <p className="text-gray-200 text-base font-bold tracking-wide">
                        Acede à tua conta para continuar
                    </p>
                </div>

                <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
                    <InputField
                        id="email"
                        label="E-mail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        disabled={isLoading}
                        className={`w-full rounded-xl py-3.5 text-base font-bold text-white shadow-lg transition-all mt-2
                            ${isLoading 
                                ? "bg-gray-600 cursor-not-allowed opacity-70" 
                                : "bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] hover:opacity-90 active:scale-[0.98]"
                            }`}
                    >
                        {isLoading ? "A entrar..." : "Entrar"}
                    </button>
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