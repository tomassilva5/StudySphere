'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiBell, HiChevronLeft, HiCheckCircle } from 'react-icons/hi2';
import StickyHeaderDate from '../components/StickyHeaderDate';

type NotificationSettings = {
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
    taskReminders: true,
    taskBefore15min: true,
    taskBefore30min: false,
    taskBefore1hour: false,
    dailySummary: true,
    groupUpdates: true,
    eventChanges: true,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Carregar configurações do localStorage
    const stored = localStorage.getItem('notificationSettings');
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  const handleToggle = (key: keyof NotificationSettings) => {
    const newValue = !settings[key];
    
    setSettings(prev => ({
      ...prev,
      [key]: newValue,
    }));

    // Pedir permissão de notificações do navegador quando ativar lembretes
    if (key === 'taskReminders' && newValue) {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  };

  const handleSave = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const ToggleItem = ({ 
    label, 
    description, 
    enabled, 
    onChange 
  }: { 
    label: string; 
    description: string; 
    enabled: boolean; 
    onChange: () => void;
  }) => (
    <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-gray-700/50 last:border-0">
      <div className="flex-1">
        <h4 className="text-white font-medium">{label}</h4>
        <p className="text-gray-400 text-sm mt-1">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-[#57F177]' : 'bg-gray-600'
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--background)' }}>
      <StickyHeaderDate />

      <div className="px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <HiChevronLeft className="text-white" size={24} />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="bg-[#57F177]/20 p-3 rounded-xl">
              <HiBell className="text-[#57F177]" size={24} />
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">Notificações</h1>
              <p className="text-gray-400 text-sm">Configure as suas preferências</p>
            </div>
          </div>
        </div>

        {/* Configurações */}
        <div className="space-y-6">
          {/* Lembretes de Tarefas */}
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-2 px-2">Lembretes de Tarefas</h3>
            <div className="bg-[#1C3B4F]/30 border border-gray-700/50 rounded-2xl overflow-hidden">
              <ToggleItem
                label="Ativar Lembretes"
                description="Receber notificações antes das tarefas"
                enabled={settings.taskReminders}
                onChange={() => handleToggle('taskReminders')}
              />
              {settings.taskReminders && (
                <>
                  <ToggleItem
                    label="15 minutos antes"
                    description="Lembrete 15 minutos antes da tarefa"
                    enabled={settings.taskBefore15min}
                    onChange={() => handleToggle('taskBefore15min')}
                  />
                  <ToggleItem
                    label="30 minutos antes"
                    description="Lembrete 30 minutos antes da tarefa"
                    enabled={settings.taskBefore30min}
                    onChange={() => handleToggle('taskBefore30min')}
                  />
                  <ToggleItem
                    label="1 hora antes"
                    description="Lembrete 1 hora antes da tarefa"
                    enabled={settings.taskBefore1hour}
                    onChange={() => handleToggle('taskBefore1hour')}
                  />
                </>
              )}
            </div>
          </div>

          {/* Resumos e Atualizações */}
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-2 px-2">Resumos e Atualizações</h3>
            <div className="bg-[#1C3B4F]/30 border border-gray-700/50 rounded-2xl overflow-hidden">
              <ToggleItem
                label="Resumo Diário"
                description="Resumo das tarefas do dia todas as manhãs"
                enabled={settings.dailySummary}
                onChange={() => handleToggle('dailySummary')}
              />
              <ToggleItem
                label="Atualizações de Grupos"
                description="Notificações sobre atividades em grupos"
                enabled={settings.groupUpdates}
                onChange={() => handleToggle('groupUpdates')}
              />
              <ToggleItem
                label="Alterações de Eventos"
                description="Avisos quando eventos são modificados"
                enabled={settings.eventChanges}
                onChange={() => handleToggle('eventChanges')}
              />
            </div>
          </div>
        </div>

        {/* Botão Guardar */}
        <button
          onClick={handleSave}
          className={`w-full mt-8 rounded-xl py-4 font-bold transition-all flex items-center justify-center gap-2 ${
            saved
              ? 'bg-green-500/20 border-2 border-green-500 text-green-500'
              : 'bg-gradient-to-r from-[#57F177] to-[#4CB2D8] text-white shadow-lg hover:opacity-90'
          }`}
        >
          {saved ? (
            <>
              <HiCheckCircle size={24} />
              Guardado!
            </>
          ) : (
            'Guardar Preferências'
          )}
        </button>
      </div>
    </div>
  );
}
