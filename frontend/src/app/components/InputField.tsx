import React, { useState } from 'react';
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
    const [showPassword, setShowPassword] = useState(false);
    
    const isPasswordField = type === 'password';

    return (
        <div className="w-full relative">
            
            <input
                id={id}
                type={isPasswordField && showPassword ? 'text' : type}
                value={value}
                onChange={onChange}
                placeholder={label}
                required={required}
                className="w-full rounded-xl bg-white px-4 py-3.5 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6EE7B7] transition-all pr-12"
            />

            {isPasswordField && (
                <button
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    {showPassword ? (
                        <HiEyeOff size={22} /> 
                    ) : (
                        <HiEye size={22} />    
                    )}
                </button>
            )}
        </div>
    );
}