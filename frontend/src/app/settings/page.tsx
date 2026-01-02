'use client';

import { useAuth } from '@/app/providers/AuthContext';
import { useRouter } from 'next/navigation';
import { HiUser, HiBell, HiGlobeAlt, HiChevronRight, HiCalendar, HiCog, HiArrowRightOnRectangle } from "react-icons/hi2";
import Image from 'next/image';

export default function Settings() {
  const { logout, user } = useAuth();
  const router = useRouter();

  // Componente Auxiliar para os Itens da Lista
  const SettingItem = ({ icon: Icon, label, route = '/development', color = "text-white" }: {
    icon: any,
    label: string,
    route?: string,
    color?: string
  }) => (
    <button
      onClick={() => router.push(route)}
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
    <div className="min-h-screen pb-24 px-4 pt-8">
      {/* 1. CARTÃO DE PERFIL */}
      <div className="bg-[#1C3B4F]/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-8 flex items-center gap-4">
        {/* Avatar / Foto */}
        <div className="relative h-16 w-16 rounded-full border-2 border-[#6EE7B7] p-[2px]">
          <div className="relative h-full w-full rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
            <HiUser className="text-gray-400 h-8 w-8" />
          </div>
        </div>

        {/* Info do User */}
        <div>
          <h2 className="text-white text-lg font-bold">
            {user?.name || (user?.email ? user.email.split('@')[0] : "Miguel Azevedo")}
          </h2>
          <p className="text-gray-400 text-sm">
            {user?.email || "MA@ipvc.pt"}
          </p>
        </div>
      </div>

      {/* 2. SECÇÃO CONTA */}
      <div className="mb-6">
        <h3 className="text-gray-400 text-sm font-medium mb-2 px-2">Conta</h3>
        <div className="bg-[#1C3B4F]/30 border border-gray-700/50 rounded-2xl overflow-hidden">
          <SettingItem icon={HiUser} label="Editar informações pessoais" color="text-[#6EE7B7]" />
          <SettingItem icon={HiBell} label="Notificações" color="text-[#6EE7B7]" />
          <SettingItem icon={HiGlobeAlt} label="Idioma" color="text-[#6EE7B7]" />
        </div>
      </div>

      {/* 3. SECÇÃO DEFINIÇÕES */}
      <div className="mb-8">
        <h3 className="text-gray-400 text-sm font-medium mb-2 px-2">Definições</h3>
        <div className="bg-[#1C3B4F]/30 border border-gray-700/50 rounded-2xl overflow-hidden">
          <SettingItem icon={HiCalendar} label="Sincronizar Calendários" color="text-[#6EE7B7]" />
          <SettingItem icon={HiCog} label="Preferências da aplicação" color="text-[#6EE7B7]" />
        </div>
      </div>

      {/* 4. BOTÃO TERMINAR SESSÃO */}
      <button
        onClick={() => {
          logout();
          router.push('/login');
        }}
        className="w-full bg-red-500/10 border border-red-500/50 hover:bg-red-500/20 active:scale-[0.98] transition-all rounded-xl p-4 flex items-center justify-center gap-2 group"
      >
        <HiArrowRightOnRectangle className="text-red-500 group-hover:text-red-400" size={20} />
        <span className="text-red-500 font-bold group-hover:text-red-400">Terminar sessão</span>
      </button>
    </div>
  );
}
