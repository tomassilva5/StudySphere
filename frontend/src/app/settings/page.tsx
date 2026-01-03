'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  HiUser, HiBell, HiGlobeAlt, HiChevronRight, 
  HiCalendar, HiCog, HiArrowRightOnRectangle 
} from "react-icons/hi2";

import Modal from '../components/Modal';
import HeaderDate from '../components/HeaderDate';
import InputField from '../components/InputField';

export default function Settings() {
  const { logout, user } = useAuth();
  const router = useRouter();
  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditModalOpen && user) {
      setName(user.name || '');
      setPassword('');
      setConfirmPassword('');
      setError('');
    }
  }, [isEditModalOpen, user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setError('As palavras-passe não coincidem.');
      return;
    }
    setIsEditModalOpen(false);
  };

  const SettingItem = ({ icon: Icon, label, onClick, color = "text-white" }: {
    icon: any, label: string, onClick?: () => void, color?: string
  }) => (
    <button
      onClick={onClick || (() => router.push('/development'))}
      className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors first:rounded-t-xl last:rounded-b-xl border-b border-gray-700/50 last:border-0"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-gray-800/50 ${color}`}>
          <Icon size={20} />
        </div>
        <span className="text-gray-200 font-medium">{label}</span>
      </div>
      <HiChevronRight className="text-gray-500" size={20} />
    </button>
  );

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--background)' }}>
      <HeaderDate />

      <div className="px-6">
        <div className="bg-[#1C3B4F]/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-8 flex items-center gap-4">
          <div className="relative h-16 w-16 rounded-full border-2 border-[#6EE7B7] p-[2px]">
            <div className="relative h-full w-full rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
               <HiUser className="text-gray-400 h-8 w-8" />
            </div>
          </div>
          <div>
            <h2 className="text-white text-lg font-bold">{user?.name || "Utilizador"}</h2>
            <p className="text-gray-400 text-sm">{user?.email || "email@exemplo.com"}</p>
          </div>
        </div>

        {/* SECÇÕES */}
        <div className="space-y-6">
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-2 px-2">Conta</h3>
            <div className="bg-[#1C3B4F]/30 border border-gray-700/50 rounded-2xl overflow-hidden">
              <SettingItem icon={HiUser} label="Editar informações pessoais" color="text-[#6EE7B7]" onClick={() => setIsEditModalOpen(true)} />
              <SettingItem icon={HiBell} label="Notificações" color="text-[#6EE7B7]" />
              <SettingItem icon={HiGlobeAlt} label="Idioma" color="text-[#6EE7B7]" />
            </div>
          </div>

          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-2 px-2">Definições</h3>
            <div className="bg-[#1C3B4F]/30 border border-gray-700/50 rounded-2xl overflow-hidden">
              <SettingItem icon={HiCalendar} label="Sincronizar Calendários" color="text-[#6EE7B7]" />
              <SettingItem icon={HiCog} label="Preferências da aplicação" color="text-[#6EE7B7]" />
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full mt-8 bg-red-500/10 border border-red-500/50 hover:bg-red-500/20 rounded-xl p-4 flex items-center justify-center gap-2 transition-all"
        >
          <HiArrowRightOnRectangle className="text-red-500" size={20} />
          <span className="text-red-500 font-bold">Terminar sessão</span>
        </button>
      </div>

      {isEditModalOpen && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <div className="text-center">
            <div className="bg-[#6EE7B7]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiUser className="text-[#6EE7B7]" size={32} />
            </div>
            
            <h3 className="text-white text-xl font-bold mb-1">Editar Perfil</h3>
            <p className="text-gray-400 mb-6 text-sm">Atualize os seus dados de conta.</p>

            <form onSubmit={handleUpdate} className="text-left space-y-4">
              <InputField id="name" label="Nome Completo" value={name} onChange={(e) => setName(e.target.value)} />
              
              <div className="opacity-50">
                <InputField id="email" label="E-mail (Não editável)" value={user?.email || ''} onChange={() => {}} />
              </div>

              <InputField id="password" label="Nova Palavra-passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <InputField id="confirm" label="Confirmar Palavra-passe" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              
              {error && <p className="text-red-400 text-xs pl-2">{error}</p>}

              <div className="flex flex-col gap-3 pt-4">
                <button type="submit" className="w-full rounded-xl py-3.5 text-base font-bold text-white shadow-lg bg-gradient-to-r from-[#57F177] to-[#4CB2D8] hover:opacity-90 active:scale-[0.98] transition-all">
                  Guardar Alterações
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-full rounded-xl border-2 border-[#6EE7B7] py-3 text-[#6EE7B7] font-bold uppercase tracking-wide hover:bg-[#6EE7B7]/10 transition-all"
                >
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
              <button onClick={() => { logout(); router.push('/login'); }} className="w-full rounded-xl py-3.5 text-base font-bold text-white shadow-lg bg-gradient-to-r from-[#57F177] to-[#4CB2D8] transition-all">
                Sim, terminar sessão
              </button>
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="w-full rounded-xl border-2 border-[#6EE7B7] py-3 text-[#6EE7B7] font-bold uppercase tracking-wide hover:bg-[#6EE7B7]/10 transition-all"
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