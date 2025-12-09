import React, { useState } from 'react';
// 👇 Importamos os ícones da biblioteca que acabaste de instalar
import { HiEye, HiEyeOff } from "react-icons/hi"; 

interface InputFieldProps {
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id?: string;
    required?: boolean;
}

export default function InputField({
    label,      
    type = 'text',
    value,
    onChange,
    id,
    required = false,
}: InputFieldProps) {
    // Estado para controlar se mostramos a senha
    const [showPassword, setShowPassword] = useState(false);
    
    // Verificamos se este campo foi configurado como password
    const isPasswordField = type === 'password';

    return (
        <div className="w-full relative">
            
            <input
                id={id}
                // SE for password E quisermos mostrar -> tipo 'text'
                // SENÃO -> usa o tipo original (password ou text)
                type={isPasswordField && showPassword ? 'text' : type}
                value={value}
                onChange={onChange}
                placeholder={label}
                required={required}
                // 'pr-12': Espaço à direita para o ícone não tapar o texto
                className="w-full rounded-xl bg-white px-4 py-3.5 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6EE7B7] transition-all pr-12"
            />

            {/* Só mostramos o olhinho se for um campo de password */}
            {isPasswordField && (
                <button
                    type="button" // Para não submeter o form ao clicar
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    {showPassword ? (
                        <HiEyeOff size={22} /> // Ícone de "Esconder"
                    ) : (
                        <HiEye size={22} />    // Ícone de "Ver"
                    )}
                </button>
            )}
        </div>
    );
}