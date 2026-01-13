'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiBell, HiChevronLeft, HiCheckCircle } from 'react-icons/hi2';
import StickyHeaderDate from '../components/StickyHeaderDate';

type NotificationSettings = {
  pauseAll: boolean;
  taskReminders: boolean;
  taskBefore15min: boolean;
  taskBefore30min: boolean;
  taskBefore1hour: boolean;
  dailySummary: boolean;
  groupUpdates: boolean;
  eventChanges: boolean;
};

export default function NotificationsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<NotificationSettings>({
    pauseAll: false,
    taskReminders: true,
    taskBefore15min: true,
    taskBefore30min: false,
    taskBefore1hour: false,
    dailySummary: false,
    groupUpdates: false,
    eventChanges: false,
  });

  // 1. Carregar definições e registar o Service Worker para Mobile
  useEffect(() => {
    const stored = localStorage.getItem('notificationSettings');
    if (stored) {
      setSettings(JSON.parse(stored));
    }

    // Registo do Service Worker (essencial para PWA no iPhone/Android)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        console.log('Service Worker registado com sucesso:', reg.scope);
      }).catch((err) => {
        console.error('Falha ao registar Service Worker:', err);
      });
    }
  }, []);

  // 2. Função para disparar notificação local de teste (Apenas Frontend)
  const sendTestNotification = () => {
    if (Notification.permission === "granted") {
      new Notification("Lembrete Ativado! 🔔", {
        body: "Irás receber alertas das tuas tarefas neste telemóvel.",
        icon: "/Logo/Logo.jpg", // Certifica-te que este ficheiro existe em /public
        badge: "/Logo/Logo.jpg",
      });
    }
  };

  // 3. Lógica de Toggle com Pedido de Permissão Real
  const handleToggle = async (key: keyof NotificationSettings) => {
    // Se o utilizador tentar ligar lembretes, pedimos permissão ao telemóvel
    if (key === 'taskReminders' && !settings.taskReminders) {
      if (!("Notification" in window)) {
        alert("Este telemóvel não suporta notificações web.");
      } else {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          sendTestNotification(); // Mostra logo uma para testar
        }
      }
    }

    setSettings(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      localStorage.setItem('notificationSettings', JSON.stringify(newState));
      return newState;
    });
  };

  const ToggleItem = ({ 
    label, 
    description, 
    enabled, 
    onChange,
    isParentPaused = false,
    isUnderDevelopment = false 
  }: { 
    label: string; 
    description: string; 
    enabled: boolean; 
    onChange: () => void;
    isParentPaused?: boolean;
    isUnderDevelopment?: boolean;
  }) => (
    <div className={`flex items-center justify-between p-4 transition-all duration-300 border-b border-gray-700/50 last:border-0 
      ${(isParentPaused || isUnderDevelopment) ? 'opacity-30 grayscale-[0.8]' : 'opacity-100'}`}>
      <div className="flex-1">
        <h4 className="text-white font-medium">{label}</h4>
        {description && <p className="text-gray-400 text-xs mt-1">{description}</p>}
      </div>
      <button
        onClick={(isParentPaused || isUnderDevelopment) ? undefined : onChange}
        disabled={isParentPaused || isUnderDevelopment}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
          enabled && !isParentPaused && !isUnderDevelopment
            ? 'bg-gradient-to-r from-[#57F177] to-[#4CB2D8]'
            : 'bg-gray-600'
        } ${isUnderDevelopment ? 'cursor-not-allowed' : ''}`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
            enabled && !isParentPaused && !isUnderDevelopment ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--background)' }}>
      <div className="px-6 pt-6 overflow-y-auto pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <HiChevronLeft className="text-white" size={24} />
          </button>
          <h1 className="text-white text-xl font-bold">Notificações</h1>
        </div>

        <div className="space-y-6">
          {/* Secção Pausar Tudo */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl overflow-hidden shadow-lg">
             <ToggleItem
                label="Desativar todas as notificações"
                description="Silenciar avisos temporariamente"
                enabled={settings.pauseAll}
                onChange={() => handleToggle('pauseAll')}
              />
          </div>

          <div className="space-y-6">
            {/* Lembretes de Tarefas */}
            <div>
              <h3 className="text-gray-400 text-[10px] font-bold mb-2 px-2 uppercase tracking-[0.1em]">Lembretes de início de Tarefas</h3>
              <div className="bg-[#1C3B4F]/30 border border-gray-700/50 rounded-2xl overflow-hidden">
                <ToggleItem
                  label="Ativar Lembretes"
                  description="Notificações antes do início das tarefas"
                  enabled={settings.taskReminders}
                  onChange={() => handleToggle('taskReminders')}
                  isParentPaused={settings.pauseAll}
                />
                {(settings.taskReminders && !settings.pauseAll) && (
                  <div className="bg-black/20 transition-all duration-500 border-t border-gray-700/30">
                    <ToggleItem
                      label="15 minutos antes"
                      description=""
                      enabled={settings.taskBefore15min}
                      onChange={() => handleToggle('taskBefore15min')}
                    />
                    <ToggleItem
                      label="30 minutos antes"
                      description=""
                      enabled={settings.taskBefore30min}
                      onChange={() => handleToggle('taskBefore30min')}
                    />
                    <ToggleItem
                      label="1 hora antes"
                      description=""
                      enabled={settings.taskBefore1hour}
                      onChange={() => handleToggle('taskBefore1hour')}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Outras Atualizações */}
            <div>
              <div className="flex justify-between items-center mb-2 px-2">
                <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.1em]">Outras Atualizações</h3>
                <span className="text-[9px] bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full font-bold">Brevemente</span>
              </div>
              <div className="bg-[#1C3B4F]/10 border border-gray-800 rounded-2xl overflow-hidden opacity-60">
                <ToggleItem
                  label="Resumo Diário"
                  description="Tarefas do dia enviadas de manhã"
                  enabled={false}
                  onChange={() => {}}
                  isUnderDevelopment={true}
                />
                <ToggleItem
                  label="Atualizações de Grupos"
                  description="Atividades nos teus grupos"
                  enabled={false}
                  onChange={() => {}}
                  isUnderDevelopment={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}