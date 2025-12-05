'use client';

import { useState } from 'react';

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = selectedDate.toLocaleString('pt-PT', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(selectedDate);
  const firstDay = getFirstDayOfMonth(selectedDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div
      className="min-h-screen pb-24"
      style={{
        backgroundColor: '#06141F',
      }}
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Calendário</h1>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                className="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 rounded hover:bg-zinc-300 transition"
              >
                ←
              </button>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Hoje
              </button>
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                className="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 rounded hover:bg-zinc-300 transition"
              >
                →
              </button>
            </div>
          </div>

          {/* Dias da semana */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(day => (
              <div key={day} className="text-center font-semibold text-zinc-600 dark:text-zinc-400 text-sm py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Dias do mês */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => (
              <button
                key={idx}
                onClick={() => day && setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
                className={`p-3 rounded text-center text-sm font-medium transition ${
                  day === null
                    ? ''
                    : day === selectedDate.getDate() && selectedDate.getMonth() === new Date().getMonth()
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
