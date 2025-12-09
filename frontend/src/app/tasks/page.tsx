'use client';
import { useState, useRef, useEffect } from 'react';
import { FiCheckSquare, FiClock, FiTrash2, FiEdit2, FiPlus } from 'react-icons/fi';
import { useTasks, TaskType, type Task } from '@/app/providers/TaskContext';
// Tipos Globais
type RepeatType = 'Nunca' | 'Todos os dias' | 'Todas as semanas' | 'Todos os meses';
// Constantes Globais
const typeColors: Record<TaskType, string> = {
  'Universidade': 'bg-green-500',
  'Estudo Individual': 'bg-cyan-500',
  'Estudo de Grupo': 'bg-purple-500',
  'Eventos Pessoais': 'bg-red-500',
  'Lazer': 'bg-yellow-500',
};
const typeLabels: Record<TaskType, string> = {
  'Universidade': 'Aulas',
  'Estudo Individual': 'Individual',
  'Estudo de Grupo': 'Grupo',
  'Eventos Pessoais': 'Eventos',
  'Lazer': 'Lazer',
};
// Componente TaskItem
function TaskItem({ task, toggleTask }: { task: Task; toggleTask: (id: string) => void }) {
  return (
    <div
      className={`rounded-xl p-3 border border-zinc-800 ${task.completed ? 'bg-[#1C3B4F]/70' : 'bg-[#1C3B4F]'
        }`}
    >
      <div className="flex items-center gap-3">
        <FiCheckSquare
          onClick={() => toggleTask(task.id)}
          className={`text-xl cursor-pointer ${task.completed ? 'text-green-500' : 'text-zinc-500'
            }`}
          aria-label={task.completed ? 'Desmarcar tarefa como concluída' : 'Marcar tarefa como concluída'}
          role="button"
        />
        <div className="flex-1">
          <h3 className={`font-medium ${task.completed ? 'text-zinc-400 line-through' : 'text-white'}`}>
            {task.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded-full text-xs ${typeColors[task.type]} ${task.completed ? 'opacity-70' : ''}`}>
              {typeLabels[task.type]}
            </span>
            <span className={`text-xs ${task.completed ? 'text-zinc-500' : 'text-zinc-400'}`}>
              <FiClock className="inline mr-1" aria-hidden="true" />
              {task.startTime} - {task.endTime}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" aria-label="Editar tarefa">
            <FiEdit2 className="text-zinc-400" aria-hidden="true" />
          </button>
          <button type="button" aria-label="Excluir tarefa">
            <FiTrash2 className="text-red-500" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
// Componente AddTaskModal
function AddTaskModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id' | 'completed' | 'duration'>) => void;
}) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TaskType>('Universidade');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [repeat, setRepeat] = useState<RepeatType>('Nunca');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return { hours, minutes };
  };

  const formatTime = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const updateEndTime = (newStartTime: string) => {
    const { hours, minutes } = parseTime(newStartTime);
    const newEndHours = (hours + 1) % 24;
    setEndTime(formatTime(newEndHours, minutes));
  };

  const handleAdd = () => {
    onAdd({ title, type, date, startTime, endTime, repeat });
    setTitle('');
    setStartTime('09:00');
    setEndTime('10:00');
    setRepeat('Nunca');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const TimePicker = ({ time, setTime, onClose }: { time: string; setTime: (time: string) => void; onClose: () => void }) => {
    const { hours, minutes } = parseTime(time);
    const [useKeyboard, setUseKeyboard] = useState(false);
    const [keyboardValue, setKeyboardValue] = useState(`${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}`);
    const wheelRef = useRef<HTMLDivElement>(null);
    const [selectedType, setSelectedType] = useState<'hours' | 'minutes'>('hours');

    const handleWheelScroll = (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 1 : -1;
      if (selectedType === 'hours') {
        const newHours = (hours + delta + 24) % 24;
        setTime(formatTime(newHours, minutes));
        if (setTime === setStartTime) {
          const newEndHours = (newHours + 1) % 24;
          updateEndTime(formatTime(newEndHours, minutes));
        }
      } else {
        const newMinutes = (minutes + delta + 60) % 60;
        setTime(formatTime(hours, newMinutes));
      }
    };

    const handleTouchStart = (type: 'hours' | 'minutes', e: React.TouchEvent) => {
      e.preventDefault();
      setSelectedType(type);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!wheelRef.current) return;
      e.preventDefault();
      const rect = wheelRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const angle = Math.atan2(touchY - centerY, touchX - centerX);
      let degrees = (angle * 180) / Math.PI;
      degrees = (degrees + 360) % 360;
      const maxValue = selectedType === 'hours' ? 24 : 60;
      const newValue = Math.round((degrees / 360) * maxValue) % maxValue;
      if (selectedType === 'hours') {
        setTime(formatTime(newValue, minutes));
        if (setTime === setStartTime) {
          const newEndHours = (newValue + 1) % 24;
          updateEndTime(formatTime(newEndHours, minutes));
        }
      } else {
        setTime(formatTime(hours, newValue));
      }
    };

    const handleKeyboardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 4) value = value.substring(0, 4);
      setKeyboardValue(value);
      if (value.length === 4) {
        const newHours = parseInt(value.substring(0, 2), 10) % 24;
        const newMinutes = parseInt(value.substring(2, 4), 10) % 60;
        setTime(formatTime(newHours, newMinutes));
        if (setTime === setStartTime) {
          const newEndHours = (newHours + 1) % 24;
          updateEndTime(formatTime(newEndHours, newMinutes));
        }
      }
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 z-30 bg-black/50 backdrop-blur-sm">
        <div className="bg-[#1C3B4F] rounded-xl p-6 w-80 relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-medium">Selecionar horário</h3>
            <button onClick={onClose} className="text-white text-xl">&times;</button>
          </div>
          <div className="flex justify-center mb-4">
            <div className="text-white text-3xl font-bold">
              {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
            </div>
          </div>
          {!useKeyboard ? (
            <>
              <div className="relative w-64 h-64 mx-auto mb-4">
                <div
                  ref={wheelRef}
                  className="relative w-full h-full rounded-full border-2 border-[#57F177]"
                  onWheel={(e) => handleWheelScroll(e)}
                  onTouchStart={(e) => handleTouchStart(selectedType, e)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={() => {}}
                >
                  {Array.from({ length: selectedType === 'hours' ? 24 : 60 }).map((_, i) => {
                    const angle = (i / (selectedType === 'hours' ? 24 : 60)) * 360;
                    const radius = 110;
                    const x = 120 + radius * Math.sin((angle * Math.PI) / 180);
                    const y = 120 - radius * Math.cos((angle * Math.PI) / 180);
                    const value = i;
                    const isSelected = selectedType === 'hours' ? i === hours : i === minutes;
                    return (
                      <div
                        key={i}
                        className="absolute w-8 h-8 flex items-center justify-center text-white text-sm"
                        style={{
                          transform: `translate(${x}px, ${y}px)`,
                          fontWeight: isSelected ? 'bold' : 'normal',
                          color: isSelected ? '#57F177' : '#ccc',
                        }}
                      >
                        {value.toString().padStart(2, '0')}
                      </div>
                    );
                  })}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#57F177] rounded-full"></div>
                  <div
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-12 bg-[#57F177]"
                    style={{ transform: `translateX(-50%) rotate(${selectedType === 'hours' ? (hours / 24) * 360 : (minutes / 60) * 360}deg)` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-center gap-4 mb-4">
                <button
                  className={`px-4 py-2 rounded ${selectedType === 'hours' ? 'bg-[#57F177]' : 'bg-zinc-800'} text-white`}
                  onClick={() => setSelectedType('hours')}
                >
                  Horas
                </button>
                <button
                  className={`px-4 py-2 rounded ${selectedType === 'minutes' ? 'bg-[#57F177]' : 'bg-zinc-800'} text-white`}
                  onClick={() => setSelectedType('minutes')}
                >
                  Minutos
                </button>
              </div>
              <button
                className="absolute bottom-4 left-4 text-white"
                onClick={() => setUseKeyboard(true)}
              >
                🔢
              </button>
            </>
          ) : (
            <div className="mb-4">
              <input
                type="text"
                value={keyboardValue}
                onChange={handleKeyboardChange}
                className="w-full p-2 rounded-lg bg-zinc-800 text-white text-center text-2xl"
                maxLength={4}
                placeholder="HHMM"
              />
              <button
                className="absolute bottom-4 left-4 text-white"
                onClick={() => setUseKeyboard(false)}
              >
                🕙
              </button>
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-br from-[#57F177] to-[#4CB2D8] text-white rounded"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-20">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-[#1C3B4F] rounded-xl p-6 w-full max-w-md relative z-30">
        <h2 className="text-xl font-bold text-white mb-4">Adicionar Tarefa</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleAdd(); onClose(); }}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-white mb-2">Título</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 rounded-lg bg-zinc-800 text-white"
                placeholder="Ex: Aula GP"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TaskType)}
                className="w-full p-2 rounded-lg bg-zinc-800 text-white"
                required
                aria-required="true"
              >
                {Object.entries(typeLabels).map(([key, label]) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white mb-2">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 rounded-lg bg-zinc-800 text-white [color-scheme:dark]"
                required
                aria-required="true"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-white mb-2">Início</label>
                <button
                  type="button"
                  onClick={() => setShowStartTimePicker(true)}
                  className="w-full p-2 rounded-lg bg-zinc-800 text-white text-left hover:bg-zinc-700"
                >
                  {startTime}
                </button>
                {showStartTimePicker && (
                  <TimePicker
                    time={startTime}
                    setTime={(newTime) => {
                      setStartTime(newTime);
                      updateEndTime(newTime);
                    }}
                    onClose={() => setShowStartTimePicker(false)}
                  />
                )}
              </div>
              <div className="flex-1">
                <label className="block text-white mb-2">Fim</label>
                <button
                  type="button"
                  onClick={() => setShowEndTimePicker(true)}
                  className="w-full p-2 rounded-lg bg-zinc-800 text-white text-left hover:bg-zinc-700"
                >
                  {endTime}
                </button>
                {showEndTimePicker && (
                  <TimePicker
                    time={endTime}
                    setTime={setEndTime}
                    onClose={() => setShowEndTimePicker(false)}
                  />
                )}
              </div>
            </div>
            <div>
              <label htmlFor="repeat" className="block text-white mb-2">Repetir</label>
              <select
                id="repeat"
                value={repeat}
                onChange={(e) => setRepeat(e.target.value as RepeatType)}
                className="w-full p-2 rounded-lg bg-zinc-800 text-white"
              >
                <option value="Nunca">Nunca</option>
                <option value="Todos os dias">Todos os dias</option>
                <option value="Todas as semanas">Todas as semanas</option>
                <option value="Todos os meses">Todos os meses</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-br from-[#57F177] to-[#4CB2D8] text-white"
              >
                Adicionar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Página Principal
export default function TasksPage() {
  const { tasks, addTask, toggleTask } = useTasks();
  const [showAddModal, setShowAddModal] = useState(false);
  const handleAddTask = (taskData: Omit<Task, 'id' | 'completed' | 'duration'>) => {
    const duration = taskData.startTime && taskData.endTime
      ? (new Date(`1970-01-01T${taskData.endTime}:00`).getTime() - new Date(`1970-01-01T${taskData.startTime}:00`).getTime()) / (1000 * 60 * 60)
      : 0;
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      type: taskData.type,
      date: taskData.date,
      startTime: taskData.startTime,
      endTime: taskData.endTime,
      repeat: taskData.repeat,
      duration: Math.max(0, duration),
      completed: false,
    };
    addTask(newTask);
  };
  const groupedTasks = tasks.reduce<Record<TaskType, Task[]>>((acc, task) => {
    if (!acc[task.type]) acc[task.type] = [];
    acc[task.type].push(task);
    return acc;
  }, {} as Record<TaskType, Task[]>);
  return (
    <div className="flex min-h-screen flex-col pb-20" style={{ background: 'var(--background)' }}>
      <div className="p-4">
        <p className="text-teal-400 text-sm" aria-live="polite">
          {new Date().toLocaleDateString('pt-PT', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
      </div>
      <div className="flex px-4 gap-2 mb-4 overflow-x-auto pb-2" role="tablist" aria-label="Filtros de tarefas">
        {Object.entries(typeColors).map(([key, color]) => (
          <div
            key={key}
            className={`px-4 py-1 rounded-full text-sm font-medium ${color} whitespace-nowrap`}
            role="tab"
            aria-selected={groupedTasks[key as TaskType]?.length > 0}
            style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}
          >
            {typeLabels[key as TaskType]}
          </div>
        ))}
      </div>

      <div className="flex-1 px-4 space-y-3 mb-16">
        {tasks.length > 0 ? (
          Object.entries(groupedTasks).map(([type, tasks]) => (
            <div key={type} className="space-y-2" role="region" aria-label={`${typeLabels[type as TaskType]} (${tasks.length})`}>
              {tasks.map(task => (
                <TaskItem key={task.id} task={task} toggleTask={toggleTask} />
              ))}
            </div>
          ))
        ) : (
          <div className="text-center text-zinc-400 py-8">
            <p>Nenhuma tarefa registada.</p>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-6 w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#57F177] to-[#4CB2D8] text-white shadow-lg z-10"
        aria-label="Adicionar nova tarefa"
      >
        <FiPlus className="text-xl" aria-hidden="true" />
      </button>
      {showAddModal && (
        <AddTaskModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddTask}
        />
      )}
    </div>
  );
}

