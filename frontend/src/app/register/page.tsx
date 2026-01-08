'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InputField from '../components/InputField';
import { HiCheck, HiX, HiOutlineRefresh } from "react-icons/hi";
import { useAuth } from '@/app/providers/AuthContext';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);

    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
    const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState({ username: false, email: false });

    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    const isUsernameLongEnough = username.length >= 3;
    const isUsernameRegexMatch = usernameRegex.test(username);
    const isUsernameValid = isUsernameLongEnough && isUsernameRegexMatch;
    
    const usernameErrorMessage = !isUsernameLongEnough 
        ? "O nome de utilizador deve ter no mínimo 3 caracteres."
        : !isUsernameRegexMatch 
        ? "Não são permitidos caracteres especiais."
        : "";

    const [hasNumber, setHasNumber] = useState(false);
    const [hasCase, setHasCase] = useState(false);
    const [hasLength, setHasLength] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);

    useEffect(() => {
        setHasNumber(/\d/.test(password));
        setHasCase(/[a-z]/.test(password) && /[A-Z]/.test(password));
        setHasLength(password.length >= 8);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsEmailValid(emailRegex.test(email));
    }, [password, email]);

    useEffect(() => {
        if (!isUsernameValid) {
            setIsUsernameAvailable(null);
            return;
        }
        const timeout = setTimeout(async () => {
            setIsChecking(prev => ({ ...prev, username: true }));
            try {
                const res = await fetch(`http://localhost:3000/api/v1/auth/check-availability?username=${username}`);
                const data = await res.json();
                setIsUsernameAvailable(data.available);
            } catch (err) {
                setIsUsernameAvailable(null);
            } finally {
                setIsChecking(prev => ({ ...prev, username: false }));
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [username, isUsernameValid]);

    useEffect(() => {
        if (!isEmailValid) {
            setIsEmailAvailable(null);
            return;
        }
        const timeout = setTimeout(async () => {
            setIsChecking(prev => ({ ...prev, email: true }));
            try {
                const res = await fetch(`http://localhost:3000/api/v1/auth/check-availability?email=${email}`);
                const data = await res.json();
                setIsEmailAvailable(data.available);
            } catch (err) {
                setIsEmailAvailable(null);
            } finally {
                setIsChecking(prev => ({ ...prev, email: false }));
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [email, isEmailValid]);

    const isPasswordValid = hasNumber && hasCase && hasLength;
    const showEmailError = email.length > 0 && !isEmailValid;
    
    const isFormValid =
        name.trim() !== '' &&
        isUsernameAvailable === true &&
        isEmailAvailable === true &&
        isPasswordValid;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
        setError('');
        if (!isFormValid) return;
        setIsLoading(true);
        const result = await register({ name, username, email, password });
        setIsLoading(false);
        if (result.success) {
            router.push('/login');
        } else {
            setError(result.error || 'Erro ao registar.');
        }
    };

    const ValidationItem = ({ isValid, text }: { isValid: boolean, text: string }) => (
        <div className={`flex items-center gap-2 text-xs transition-colors duration-200 ${isValid ? 'text-green-400' : 'text-red-400'}`}>
            {isValid ? <HiCheck size={14} /> : <HiX size={14} />}
            <span>{text}</span>
        </div>
    );

    return (
        <div className="flex h-screen flex-col overflow-hidden" style={{background: 'var(--background)'}}> 
            <div className="flex-1 flex flex-col items-center justify-start -mt-3 px-6 overflow-y-auto pt-6">
                
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-0 h-[268px] w-[268px]"> 
                        <Image src="/Logo/Logo.jpg" alt="Logo" fill className="object-contain rounded-full" priority />
                    </div>
                    <p className="text-gray-200 text-base font-bold tracking-wide -mt-1 mb-4 relative z-10">
                        Crie a sua conta
                    </p>
                </div>

                <form id="register-form" onSubmit={handleRegister} className="w-full max-w-sm space-y-4 relative z-10">
                    <InputField
                        id="name"
                        label="Nome Completo"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        error={formSubmitted && name.trim() === ''}
                    />

                    <div className="relative">
                        <InputField
                            id="username"
                            label="Nome de Utilizador"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            error={(username !== '' && !isUsernameValid) || isUsernameAvailable === false} 
                        />
                        <div className="absolute right-3 top-10">
                            {isChecking.username && <HiOutlineRefresh className="animate-spin text-gray-400" />}
                            {!isChecking.username && isUsernameAvailable === true && <HiCheck className="text-green-500" />}
                            {!isChecking.username && isUsernameAvailable === false && <HiX className="text-red-500" />}
                        </div>
                        {username !== '' && !isUsernameValid && (
                            <p className="text-xs text-red-400 pl-2 mt-1">{usernameErrorMessage}</p> 
                        )}
                        {isUsernameValid && isUsernameAvailable === false && (
                            <p className="text-xs text-red-400 pl-2 mt-1">Este nome de utilizador já existe.</p>
                        )}
                    </div>

                    <div className="relative">
                        <InputField 
                            id="email" 
                            label="E-mail" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            error={showEmailError || isEmailAvailable === false}
                        />
                        <div className="absolute right-3 top-10">
                            {isChecking.email && <HiOutlineRefresh className="animate-spin text-gray-400" />}
                            {!isChecking.email && isEmailAvailable === true && <HiCheck className="text-green-500" />}
                            {!isChecking.email && isEmailAvailable === false && <HiX className="text-red-500" />}
                        </div>
                        {showEmailError && (
                            <p className="text-xs text-red-400 pl-2 mt-1">E-mail inválido. Use o formato nome@dominio.com</p>
                        )}
                        {isEmailAvailable === false && (
                            <p className="text-xs text-red-400 pl-2 mt-1">Este e-mail já está em uso.</p>
                        )}
                    </div>

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
                                <ValidationItem isValid={hasLength} text="Mínimo 8 caracteres" />
                            </div>
                        )}
                    </div>
                </form>
            </div>

            <div className="w-full bg-[#06141F] border-t-2 border-gray-700 px-6 py-4 flex flex-col items-center gap-3 bg-gradient-to-t from-[#1C3B4F] to-[#06141F]">
                <button
                    type="submit"
                    form="register-form"
                    disabled={isLoading || !isFormValid}
                    className={`w-full max-w-sm rounded-xl py-3.5 text-base font-bold text-white shadow-lg transition-all
                        ${isLoading || !isFormValid
                            ? "bg-gray-600 cursor-not-allowed opacity-70" 
                            : "bg-gradient-to-r from-[#57F177] to-[#4CB2D8] hover:opacity-90 active:scale-[0.98]"}
                    `}
                >
                    {isLoading ? "A criar conta..." : "Registar"}
                </button>
                {error && (
                    <div className="p-3 rounded-lg bg-red-900/30 border border-red-500 text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}
                <Link href="/login" className="w-full max-w-sm">
                    <button type="button" className="w-full rounded-xl border-2 border-[#6EE7B7] py-3 text-[#6EE7B7] font-bold tracking-wide hover:bg-[#6EE7B7] hover:text-[#06141F] transition-all">
                        Voltar
                    </button>
                </Link>
            </div>
        </div>
    );
}