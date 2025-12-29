// src/components/Modal.tsx
import React from 'react';

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
      
      <div className="bg-[#1C3B4F] rounded-xl p-6 w-full max-w-md relative z-50 shadow-xl">
        {children}
      </div>
    </div>
  );
}