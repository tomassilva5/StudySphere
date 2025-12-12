'use client'; 

import React, { useState } from 'react';
import { HiEye, HiEyeOff } from "react-icons/hi"; 

interface InputFieldProps {
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id?: string;
    required?: boolean;
    error?: boolean;
}

export default function InputField({
    label,      
    type = 'text',
    value,
    onChange,
    id,
    required = false,
    error = false,
}: InputFieldProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const isPasswordField = type === 'password';

    let borderWrapperClass = "w-full rounded-xl p-[2px] transition-all relative ";

    if (error) {
        borderWrapperClass += "bg-red-500";
    } else if (isFocused) {
        borderWrapperClass += "bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6]";
    } else {
        borderWrapperClass += "bg-transparent";
    }

    return (
        <div className="w-full relative">

            <div className={borderWrapperClass}>
                <input
                    id={id}
                    type={isPasswordField && showPassword ? 'text' : type}
                    value={value}
                    onChange={onChange}
                    // 🟢 Controladores de Foco
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={label}
                    required={required}
                    className="w-full rounded-[10px] bg-white px-4 py-3.5 text-black placeholder-gray-500 border-none outline-none ring-0 focus:ring-0 focus:outline-none pr-12 relative z-10 h-full"
                />
            </div>

            {isPasswordField && (
                <button
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-20"
                >
                    {showPassword ? <HiEyeOff size={22} /> : <HiEye size={22} />}
                </button>
            )}
        </div>
    );
}