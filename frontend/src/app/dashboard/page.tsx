'use client';
import { useState, useEffect } from 'react';
import { FiChevronRight, FiCalendar } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/app/providers/TaskContext';
import { useAuth } from '@/app/providers/AuthContext';
import HeaderDate from '@/app/components/HeaderDate'; 

type TimeDistributionProps = {
  category: string;
  time: string;
  color: string;
  width: string;
};

export default function Dashboard() {
  const [calendarDate] = useState<Date>(new Date());
  const router = useRouter();
  const { tasks } = useTasks();
  const { isAuthenticated, isLoading } = useAuth();
  const [timeDistribution, setTimeDistribution] = useState<TimeDistributionProps[]>([]);

  // Proteção client-side
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-white">A carregar...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  // Lógica de cálculo
  useEffect(() => {
    const categories = [
      { name: 'Aulas', type: 'Universidade', color: 'bg-green-500' },
      { name: 'Estudo Pessoal', type: 'Estudo Individual', color: 'bg-cyan-500' },
      { name: 'Estudo de Grupo', type: 'Estudo de Grupo', color: 'bg-purple-500' },
      { name: 'Eventos Pessoais', type: 'Eventos Pessoais', color: 'bg-red-500' },
      { name: 'Lazer', type: 'Lazer', color: 'bg-yellow-500' },
    ];

    const categoryTimes: Record<string, number> = {};
    categories.forEach(c => categoryTimes[c.type] = 0);

    tasks.forEach(task => {
      if (categoryTimes[task.type] !== undefined) {
        categoryTimes[task.type] += task.duration || 0;
      }
    });

    const totalTime = Object.values(categoryTimes).reduce((sum, time) => sum + time, 0);
    
    // Formatar tempo em formato "h:mm"
    const formatTime = (hours: number) => {
      const h = Math.floor(hours);
      const m = Math.round((hours - h) * 60);
      return `${h}:${m.toString().padStart(2, '0')}h`;
    };
    
    setTimeDistribution(categories.map(c => ({
      category: c.name,
      time: formatTime(categoryTimes[c.type]),
      color: c.color,
      width: `${totalTime > 0 ? (categoryTimes[c.type] / Math.max(totalTime, 24)) * 100 : 0}%`,
    })));
  }, [tasks]);

  const renderDays = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) days.push(<div key={`e-${i}`} />);
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === new Date().getDate() && month === new Date().getMonth();
      days.push(
        <div key={i} className={`p-2 text-center rounded-lg text-sm transition-all ${
          isToday 
            ? 'bg-gradient-to-br from-[#57F177] to-[#4CB2D8] text-[#06141F] font-bold shadow-lg shadow-[#57F177]/20' 
            : 'text-gray-300 hover:bg-white/5'
        }`}>
          {i}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="flex min-h-screen flex-col pb-24" style={{background: 'var(--background)'}}>
      
      {/* 1. Componente Global de Data (Com o novo Fade) */}
      <HeaderDate />

      <div className="px-4 space-y-6">
        
        {/* Bloco Calendário */}
        <div className="bg-[#1C3B4F]/50 backdrop-blur-md rounded-2xl p-5 border border-white/5 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              {/* Ícone atualizado com a nova cor */}
              <div className="bg-[#57F177]/20 p-2 rounded-xl">
                <FiCalendar className="text-[#57F177] text-lg" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Calendário</h2>
            </div>
            <button onClick={() => router.push('/calendar')} className="text-white/70 hover:text-white transition-colors">
              <FiChevronRight size={24} />
            </button>
          </div>

          <p className="text-center text-white font-medium mb-4 opacity-80">
            {new Intl.DateTimeFormat('pt-PT', { month: 'long', year: 'numeric' }).format(calendarDate)}
          </p>

          <div className="grid grid-cols-7 gap-1 text-zinc-500 text-xs font-bold mb-2 uppercase text-center">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
        </div>

        {/* Bloco Distribuição */}
        <div className="bg-[#1C3B4F]/50 backdrop-blur-md rounded-2xl p-5 border border-white/5 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6">Distribuição de Tempo (Hoje)</h2>
          <div className="space-y-5">
            {timeDistribution.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/90 text-sm font-medium">{item.category}</span>
                  <span className="text-white/70 text-sm">{item.time}</span>
                </div>
                <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                  <div 
                    className={`${item.color} h-full rounded-full transition-all duration-700 ease-out`} 
                    style={{ width: item.width }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}