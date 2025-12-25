'use client';

import { useState, useCallback } from 'react';
import { FiCheckSquare, FiClock, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { useTasks, TaskType, type Task } from '@/app/providers/TaskContext';

// 1. IMPORTAR OS COMPONENTES REUTILIZÁVEIS
import ButtonAdd from '../components/ButtonAdd';
import Modal from '../components/Modal';
import HeaderDate from '../components/HeaderDate'; // Importação do componente global de data

// Tipos Globais
type RepeatType = 'Nunca' | 'Todos os dias' | 'Todas as semanas' | 'Todos os meses';

// Constantes Globais de Estilo
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
      className={`rounded-xl p-3 border border-zinc-800 transition-all ${
        task.completed ? 'bg-[#1C3B4F]/70 opacity-80' : 'bg-[#1C3B4F]'
      }`}
    >
      <div className="flex items-center gap-3">
        <FiCheckSquare
          onClick={() => toggleTask(task.id)}
          className={`text-xl cursor-pointer transition-colors ${
            task.completed ? 'text-green-400' : 'text-zinc-500'
          }`}
          aria-label={task.completed ? 'Desmarcar' : 'Marcar'}
          role="button"
        />
        <div className="flex-1">
          <h3 className={`font-medium ${task.completed ? 'text-zinc-400 line-through' : 'text-white'}`}>
            {task.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase ${typeColors[task.type]} ${task.completed ? 'opacity-50' : ''}`}>
              {typeLabels[task.type]}
            </span>
            <span className={`text-xs flex items-center gap-1 ${task.completed ? 'text-zinc-500' : 'text-zinc-400'}`}>
              <FiClock size={12} aria-hidden="true" />
              {task.startTime} - {task.endTime}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" aria-label="Editar" className="hover:text-white transition-colors">
            <FiEdit2 className="text-zinc-400" size={16} aria-hidden="true" />
          </button>
          <button type="button" aria-label="Excluir" className="hover:text-red-400 transition-colors">
            <FiTrash2 className="text-red-500/80" size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. FORMULÁRIO DE ADICIONAR TAREFA
function AddTaskForm({
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
    onAdd({ title, type, date, startTime, endTime, repeat, priority: 'MEDIUM', status: 'scheduled' });
    setTitle('');
    onClose();
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
      <h2 className="text-xl font-bold text-white mb-4">Adicionar Tarefa</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-white mb-2 text-sm">Título</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-[#57F177] outline-none transition-colors"
            placeholder="Ex: Aula de SIR"
            required
          />
        </div>
        <div>
          <label className="block text-white mb-2 text-sm">Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TaskType)}
            className="w-full p-2.5 rounded-lg bg-zinc-800 text-white border border-zinc-700 outline-none"
            required
          >
            {Object.entries(typeLabels).map(([key, label]) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-white mb-2 text-sm">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-zinc-800 text-white [color-scheme:dark] border border-zinc-700 outline-none"
            required
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-white mb-2 text-sm">Início</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                updateEndTime(e.target.value);
              }}
              className="w-full p-2.5 rounded-lg bg-zinc-800 text-white border border-zinc-700 outline-none"
              style={{ colorScheme: 'dark' }}
            />
          </div>
          <div className="flex-1">
            <label className="block text-white mb-2 text-sm">Fim</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-zinc-800 text-white border border-zinc-700 outline-none"
              style={{ colorScheme: 'dark' }}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-gradient-to-br from-[#57F177] to-[#4CB2D8] text-[#06141F] font-bold text-sm shadow-lg active:scale-95 transition-all"
          >
            Adicionar
          </button>
        </div>
      </div>
    </form>
  );
}

// PÁGINA PRINCIPAL DE TAREFAS
export default function TasksPage() {
  const { tasks, addTask, toggleTask } = useTasks();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddTask = useCallback((taskData: Omit<Task, 'id' | 'completed' | 'duration'>) => {
    const start = new Date(`1970-01-01T${taskData.startTime}:00`);
    const end = new Date(`1970-01-01T${taskData.endTime}:00`);
    let duration = (end.getTime() - start.getTime()) / 3600000;
    if (duration < 0) duration += 24;

    const newTask: Task = {
      id: Date.now().toString(),
      completed: false,
      duration,
      ...taskData,
    };
    addTask(newTask);
  }, [addTask]);

  const groupedTasks = tasks.reduce<Record<TaskType, Task[]>>((acc, task) => {
    if (!acc[task.type]) acc[task.type] = [];
    acc[task.type].push(task);
    return acc;
  }, {} as Record<TaskType, Task[]>);

  Object.keys(groupedTasks).forEach(type => {
    groupedTasks[type as TaskType].sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  return (
    <div className="flex min-h-screen flex-col pb-24" style={{ background: 'var(--background)' }}>
      
      {/* 3. SUBSTITUIÇÃO DA DATA MANUAL PELO COMPONENTE GLOBAL */}
      <HeaderDate />

      {/* Filtros / Tabs */}
      <div className="flex px-4 gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide" role="tablist">
        {Object.entries(typeColors).map(([key, color]) => (
          <div
            key={key}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-white shadow-sm transition-all ${color} whitespace-nowrap`}
            role="tab"
            aria-selected={groupedTasks[key as TaskType]?.length > 0}
            style={{ border: '1px solid rgba(255, 255, 255, 0.15)' }}
          >
            {typeLabels[key as TaskType]}
          </div>
        ))}
      </div>

      {/* Lista de Tarefas */}
      <div className="flex-1 px-4 space-y-3 mb-16">
        {tasks.length > 0 ? (
          Object.entries(groupedTasks).map(([type, tasks]) => (
            <div key={type} className="space-y-3">
              {tasks.map(task => (
                <TaskItem key={task.id} task={task} toggleTask={toggleTask} />
              ))}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-500 py-16">
            <p className="text-sm">Nenhuma tarefa registada.</p>
          </div>
        )}
      </div>

      {/* Botão Flutuante Reutilizável */}
      <ButtonAdd onClick={() => setShowAddModal(true)} />

      {/* Modal Reutilizável com o Formulário */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <AddTaskForm onClose={() => setShowAddModal(false)} onAdd={handleAddTask} />
        </Modal>
      )}

    </div>
  );
}