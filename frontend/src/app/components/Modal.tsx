import React from 'react';
import { HiXMark } from "react-icons/hi2";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <div className="bg-[#1C3B4F] rounded-xl p-6 w-full max-w-md relative z-50 shadow-xl border border-gray-700/50">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          aria-label="Fechar"
        >
          <HiXMark size={24} />
        </button>

        <div className="mt-2">
          {children}
        </div>
      </div>
    </div>
  );
}