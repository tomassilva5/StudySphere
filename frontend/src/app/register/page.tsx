'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InputField from '../components/InputField';
import { HiCheck, HiX } from "react-icons/hi";

export default function RegisterPage() {
    const router = useRouter();
    
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Validação Username
    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    const isUsernameValid = username === '' || usernameRegex.test(username);
    const showUsernameError = username !== '' && !isUsernameValid;

    // Validação Password
    const [hasNumber, setHasNumber] = useState(false);
    const [hasCase, setHasCase] = useState(false);
    const [hasLength, setHasLength] = useState(false);

    // Validação Email
    const [isEmailValid, setIsEmailValid] = useState(false);

    useEffect(() => {
        // Password
        setHasNumber(/\d/.test(password));
        setHasCase(/[a-z]/.test(password) && /[A-Z]/.test(password));
        setHasLength(password.length >= 8);

        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsEmailValid(emailRegex.test(email));
    }, [password, email]);

    const isPasswordValid = hasNumber && hasCase && hasLength;
    const showEmailError = email.length > 0 && !isEmailValid;

    const isFormValid =
        name.trim() !== '' &&
        username.trim() !== '' &&
        isUsernameValid &&
        isEmailValid &&
        isPasswordValid;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid) return;

        setIsLoading(true);
        console.log('Registering:', { name, username, email });

        setTimeout(() => {
            setIsLoading(false);
            router.push('/login');
        }, 1500);
    };

    const ValidationItem = ({ isValid, text }: { isValid: boolean, text: string }) => (
        <div className={`flex items-center gap-2 text-xs transition-colors duration-200 ${isValid ? 'text-green-400' : 'text-red-400'}`}>
            {isValid ? <HiCheck size={14} /> : <HiX size={14} />}
            <span>{text}</span>
        </div>
    );

    return (
        <div className="flex h-screen flex-col overflow-hidden" style={{background: 'var(--background)'}}> 

            {/* --- CONTEÚDO SUPERIOR --- */}
            <div className="flex-1 flex flex-col items-center justify-start -mt-3 px-6 overflow-y-auto">
                
                <div className="mb-2 flex flex-col items-center text-center">
                    <div className="relative mb-0 h-[268px] w-[268px]"> 
                        <Image src="/Logo/Logo.jpg" alt="Logo" fill className="object-contain rounded-full" priority />
                    </div>

                    <p className="text-gray-200 text-base font-bold tracking-wide mt-0">
                        Crie a sua conta
                    </p>
                </div>

                <form id="register-form" onSubmit={handleRegister} className="w-full max-w-sm space-y-4">
                    
                    {/* Nome Completo */}
                    <InputField
                        id="name"
                        label="Nome Completo"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    {/* Username */}
                    <div>
                        <InputField
                            id="username"
                            label="Nome de Utilizador"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        {showUsernameError && (
                            <p className="text-xs text-red-400 pl-2 mt-1">
                                O nome de utilizador só pode incluir letras, números, underscores e pontos.
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <InputField 
                            id="email" 
                            label="E-mail" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            error={showEmailError}
                        />
                        {showEmailError && (
                            <p className="text-xs text-red-400 pl-2 mt-1">
                                E-mail inválido. Use o formato nome@domínio.com
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <InputField 
                            id="password" 
                            label="Palavra-passe" 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            error={password.length > 0 && !isPasswordValid}
                        />

                        {password.length > 0 && (
                            <div className="mt-2 pl-2 space-y-1">
                                <ValidationItem isValid={hasNumber} text="Incluir um número" />
                                <ValidationItem isValid={hasCase} text="Incluir maiúsculas e minúsculas" />
                                <ValidationItem isValid={hasLength} text="A palavra-passe deve ter no mínimo 8 caracteres" />
                            </div>
                        )}
                    </div>
                </form>
            </div>

            {/* --- RODAPÉ --- */}
            <div className="w-full bg-[#06141F] border-t-2 border-gray-700 px-6 py-6 flex flex-col items-center gap-3 bg-gradient-to-t from-[#1C3B4F] to-[#06141F]">

                <button
                    type="submit"
                    form="register-form"
                    disabled={isLoading || !isFormValid}
                    className={`w-full max-w-sm rounded-xl py-3.5 text-base font-bold text-white shadow-lg transition-all
                        ${isLoading || !isFormValid
                            ? "bg-gray-600 cursor-not-allowed opacity-70" 
                            : "bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] hover:opacity-90 active:scale-[0.98]"}
                    `}
                >
                    {isLoading ? "A criar conta..." : "Registar"}
                </button>

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
