'use client';
import { useState, useEffect } from 'react';
import { FiChevronRight, FiPlusCircle, FiCalendar } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/app/providers/TaskContext';

type TimeDistributionProps = {
  category: string;
  time: string;
  color: string;
  width: string;
};

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const router = useRouter();
  const { tasks } = useTasks();
  const [timeDistribution, setTimeDistribution] =useState<TimeDistributionProps[]>([
    { category: 'Uni', time: '0h', color: 'bg-green-500', width: '0%' },
    { category: 'Estudo Pessoal', time: '0h', color: 'bg-cyan-500', width: '0%' },
    { category: 'Grupos', time: '0h', color: 'bg-purple-500', width: '0%' },
    { category: 'Eventos Pessoais', time: '0h', color: 'bg-red-500', width: '0%' },
    { category: 'Lazer', time: '0h', color: 'bg-yellow-500', width: '0%' },
  ]);

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const calculateTimeDistribution = () => {
    const categories = [
      { name: 'Aulas', type: 'Universidade', color: 'bg-green-500' },
      { name: 'Estudo Pessoal', type: 'Estudo Individual', color: 'bg-cyan-500' },
      { name: 'Estudo de Grupo', type: 'Estudo de Grupo', color: 'bg-purple-500' },
      { name: 'Eventos Pessoais', type: 'Eventos Pessoais', color: 'bg-red-500' },
      { name: 'Lazer', type: 'Lazer', color: 'bg-yellow-500' },
    ];

    const categoryTimes: Record<string, number> = {};
    categories.forEach(category => {
      categoryTimes[category.type] = 0;
    });

    tasks.forEach(task => {
      if (categoryTimes[task.type] !== undefined) {
        categoryTimes[task.type] += task.duration || 0;
      }
    });

    const totalTime = Object.values(categoryTimes).reduce((sum, time) => sum + time, 0);
    const maxTime = Math.min(totalTime, 24);

    const distribution = categories.map(category => {
      const time = categoryTimes[category.type];
      const percentage = totalTime > 0 ? (time / maxTime) * 100 : 0;
      return {
        category: category.name,
        time: `${time}h`,
        color: category.color,
        width: `${percentage}%`,
      };
    });

    setTimeDistribution(distribution);
  };

  useEffect(() => {
    calculateTimeDistribution();
  }, [tasks]);

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const isToday = dayDate.toDateString() === new Date().toDateString();
      days.push(
        <div
          key={`day-${i}`}
          className={`p-2 text-center rounded-lg text-sm ${
            isToday ? 'bg-gradient-to-br from-[#57F177] to-[#4CB2D8] text-white' : 'text-gray-300'
          }`}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  const handleViewFullCalendar = () => {
    router.push('/calendar'); 
  };

  const handleViewMoreTasks = () => {
    router.push('/tasks');
  };

  return (
    <div className="flex min-h-screen flex-col pb-20" style={{ backgroundColor: '#06141F' }}>
      {/* Cabeçalho */}
      <div className="p-4">
        <div className="text-teal-400 font-medium">
          {currentDate.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* Calendário */}
      <div className="bg-[#1C3B4F] rounded-xl mx-4 p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-[#57F177] to-[#4CB2D8] p-2 rounded-lg">
              <FiCalendar className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Calendário</h2>
          </div>
          <button onClick={handleViewFullCalendar} className="p-1">
            <FiChevronRight className="text-white text-xl" />
          </button>
        </div>

        <div className="text-center text-white font-medium mb-3">
          {monthNames[currentDate.getMonth()]} de {currentDate.getFullYear()}
        </div>

        {/* Dias da Semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center text-zinc-400 text-sm font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Dias do Mês */}
        <div className="grid grid-cols-7 gap-1">
          {renderDays()}
        </div>
      </div>

      {/* Distribuição de Tempo */}
      <div className="bg-[#1C3B4F] rounded-xl mx-4 p-4 mb-4">
        <h2 className="text-xl font-bold text-white mb-4">Distribuição de Tempo (Hoje)</h2>
        <div className="space-y-4">
          {timeDistribution.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-medium">{item.category}</span>
                <span className="text-white">{item.time}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-700">
                <div className={`${item.color} h-2 rounded-full`} style={{ width: item.width }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
  