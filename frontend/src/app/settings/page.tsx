'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  HiUser, HiBell, HiGlobeAlt, HiChevronRight, 
  HiCalendar, HiCog, HiArrowRightOnRectangle,
  HiCheck, HiXMark 
} from "react-icons/hi2";

import Modal from '../components/Modal';
import HeaderDate from '../components/HeaderDate';
import InputField from '../components/InputField';

export default function Settings() {
  const { logout, user } = useAuth();
  const router = useRouter();
  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const [hasNumber, setHasNumber] = useState(false);
  const [hasCase, setHasCase] = useState(false);
  const [hasLength, setHasLength] = useState(false);

  // Validação em tempo real (Igual ao Register)
  useEffect(() => {
    setHasNumber(/\d/.test(password));
    setHasCase(/[a-z]/.test(password) && /[A-Z]/.test(password));
    setHasLength(password.length >= 8);
  }, [password]);

  useEffect(() => {
    if (isEditModalOpen) {
      setPassword('');
      setConfirmPassword('');
      setError('');
    }
  }, [isEditModalOpen]);

  const isPasswordValid = hasNumber && hasCase && hasLength;
  
  // O botão só "acende" se tudo estiver preenchido e correto
  const isFormValid = 
    password !== '' && 
    confirmPassword !== '' && 
    isPasswordValid && 
    password === confirmPassword;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setError('');
      // Enviar o email para o backend conseguir encontrar o user na BD
      const payload = {
        email: user?.email, 
        palavra_passe: password
      };

      // Nota: Verifica se a porta é 5000 ou 3000 no teu ambiente
      const response = await fetch('/api/v1/users/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsEditModalOpen(false);
        alert('Palavra-passe alterada com sucesso!');
      } else {
        const data = await response.json();
        setError(data.message || 'Erro ao editar utilizador na base de dados');
      }
    } catch (err) {
      setError('Erro de ligação ao servidor.');
    }
  };

  const ValidationItem = ({ isValid, text }: { isValid: boolean, text: string }) => (
    <div className={`flex items-center gap-2 text-[10px] transition-colors duration-200 ${isValid ? 'text-green-400' : 'text-red-400'}`}>
      {isValid ? <HiCheck size={12} /> : <HiXMark size={12} />}
      <span>{text}</span>
    </div>
  );

  const SettingItem = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
    <button
      onClick={onClick || (() => router.push('/development'))}
      className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-gray-700/50 last:border-0"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gray-800/50 flex items-center justify-center">
          <Icon size={20} style={{ fill: 'url(#blue-green-gradient)' }} />
        </div>
        <span className="text-gray-200 font-medium">{label}</span>
      </div>
      <HiChevronRight className="text-gray-500" size={20} />
    </button>
  );

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--background)' }}>
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="blue-green-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop stopColor="#57F177" offset="0%" />
            <stop stopColor="#4CB2D8" offset="100%" />
          </linearGradient>
        </defs>
      </svg>

      <HeaderDate />

      <div className="px-6">
        <div className="bg-[#1C3B4F]/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-8 flex items-center gap-4 shadow-md">
          <div className="relative h-16 w-16 rounded-full bg-gradient-to-r from-[#57F177] to-[#4CB2D8] p-[2px]">
            <div className="relative h-full w-full rounded-full overflow-hidden bg-[#06141F] flex items-center justify-center">
               <HiUser className="h-8 w-8" style={{ fill: 'url(#blue-green-gradient)' }} />
            </div>
          </div>
          <div>
            <h2 className="text-white text-lg font-bold">{user?.name || "Utilizador"}</h2>
            <p className="text-gray-400 text-sm">{user?.email || "email@local"}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-2 px-2 uppercase tracking-wider">Conta</h3>
            <div className="bg-[#1C3B4F]/30 border border-gray-700/50 rounded-2xl overflow-hidden shadow-inner">
              <SettingItem icon={HiUser} label="Alterar palavra-passe" onClick={() => setIsEditModalOpen(true)} />
              <SettingItem icon={HiBell} label="Notificações" onClick={() => router.push('/notifications')} />
              <SettingItem icon={HiGlobeAlt} label="Idioma" />
            </div>
          </div>
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-2 px-2 uppercase tracking-wider">Definições</h3>
            <div className="bg-[#1C3B4F]/30 border border-gray-700/50 rounded-2xl overflow-hidden shadow-inner">
              <SettingItem icon={HiCalendar} label="Sincronizar Calendários" />
              <SettingItem icon={HiCog} label="Preferências da aplicação" />
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsLogoutModalOpen(true)} 
          className="w-full mt-8 bg-red-500/10 border border-red-500/50 hover:bg-red-500/20 rounded-xl p-4 flex items-center justify-center gap-2 transition-all group"
        >
          <HiArrowRightOnRectangle className="text-red-500 group-hover:scale-110 transition-transform" size={20} />
          <span className="text-red-500 font-bold">Terminar sessão</span>
        </button>
      </div>

      {/* MODAL ALTERAR PASSWORD */}
      {isEditModalOpen && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <div className="text-center">
            <div className="bg-gray-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
              <HiUser className="size-8" style={{ fill: 'url(#blue-green-gradient)' }} />
            </div>
            <h3 className="text-white text-xl font-bold mb-1">Alterar Palavra-passe</h3>
            <p className="text-gray-400 mb-6 text-sm">Insira a sua nova palavra-passe abaixo.</p>
            <form onSubmit={handleUpdate} className="text-left space-y-4">
              <div className="space-y-2">
                <InputField id="password" label="Nova Palavra-passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {password.length > 0 && (
                  <div className="mt-2 pl-2 space-y-1 bg-black/10 p-2 rounded-lg">
                    <ValidationItem isValid={hasNumber} text="Incluir um número" />
                    <ValidationItem isValid={hasCase} text="Incluir maiúsculas e minúsculas" />
                    <ValidationItem isValid={hasLength} text="Mínimo 8 caracteres" />
                  </div>
                )}
              </div>
              <InputField id="confirm" label="Confirmar Palavra-passe" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              {confirmPassword !== '' && password !== confirmPassword && (
                <p className="text-red-400 text-[10px] pl-2 font-medium">As palavras-passe não coincidem.</p>
              )}
              {error && <p className="text-red-400 text-xs text-center mt-2">{error}</p>}
              <div className="flex flex-col gap-3 pt-4">
                <button 
                  type="submit" 
                  disabled={!isFormValid}
                  className={`w-full rounded-xl py-3.5 text-base font-bold text-white shadow-lg transition-all
                    ${!isFormValid ? 'bg-gray-600 opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-[#57F177] to-[#4CB2D8] hover:opacity-90 active:scale-[0.98]'}`}
                >
                  Guardar Alterações
                </button>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="w-full rounded-xl border-2 border-gray-600 py-3 text-gray-300 font-bold uppercase tracking-wide hover:bg-white/5 transition-all">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {isLogoutModalOpen && (
        <Modal onClose={() => setIsLogoutModalOpen(false)}>
          <div className="text-center">
            <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiArrowRightOnRectangle className="text-red-500" size={32} />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Terminar Sessão?</h3>
            <p className="text-gray-400 mb-8 text-sm px-2">Tem a certeza que deseja sair da sua conta?</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { logout(); router.push('/login'); }} 
                className="w-full rounded-xl py-3.5 text-base font-bold text-white shadow-lg bg-gradient-to-r from-[#57F177] to-[#4CB2D8] transition-all"
              >
                Sim, terminar sessão
              </button>
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="w-full rounded-xl border-2 border-gray-600 py-3 text-gray-300 font-bold uppercase tracking-wide hover:bg-white/5 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}