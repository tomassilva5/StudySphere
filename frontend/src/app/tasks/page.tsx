'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiCheckSquare, FiClock, FiTrash2, FiEdit2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useTasks, TaskType, TaskPriority, TaskStatus, type Task } from '@/app/providers/TaskContext';
import { useUI } from '@/app/providers/UIContext';

// 1. IMPORTAR OS COMPONENTES REUTILIZÁVEIS
import ButtonAdd from '../components/ButtonAdd';
import Modal from '../components/Modal';
import StickyHeaderDate from '../components/StickyHeaderDate'; // Importação do componente global de data sticky

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
function TaskItem({ 
  task, 
  toggleTask, 
  onDelete,
  onEdit
}: { 
  task: Task; 
  toggleTask: (id: string) => void;
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
}) {
  const isGoogleEvent = task.id.startsWith('google-');
  
  return (
    <div
      className={`rounded-xl p-3 border border-zinc-800 transition-all ${
        task.completed ? 'bg-[#1C3B4F]/70 opacity-80' : 'bg-[#1C3B4F]'
      } ${isGoogleEvent ? 'border-l-4 border-l-blue-500' : ''}`}
    >
      <div className="flex items-center gap-3">
        <FiCheckSquare
          onClick={() => !isGoogleEvent && toggleTask(task.id)}
          className={`text-xl transition-colors ${
            isGoogleEvent ? 'text-zinc-600 cursor-not-allowed' :
            task.completed ? 'text-green-400 cursor-pointer' : 'text-zinc-500 cursor-pointer'
          }`}
          aria-label={task.completed ? 'Desmarcar' : 'Marcar'}
          role="button"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`font-medium ${task.completed ? 'text-zinc-400 line-through' : 'text-white'}`}>
              {task.title}
            </h3>
            {isGoogleEvent && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium">
                Google
              </span>
            )}
          </div>
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
          {!isGoogleEvent && (
            <>
              <button 
                type="button" 
                aria-label="Editar" 
                className="hover:text-white transition-colors"
                onClick={() => onEdit(task)}
              >
                <FiEdit2 className="text-zinc-400" size={16} aria-hidden="true" />
              </button>
              <button 
                type="button" 
                aria-label="Excluir" 
                className="hover:text-red-400 transition-colors"
                onClick={() => onDelete(task)}
              >
                <FiTrash2 className="text-red-500/80" size={16} aria-hidden="true" />
              </button>
            </>
          )}
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
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TaskType>('Universidade');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [repeat, setRepeat] = useState<RepeatType>('Nunca');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [status, setStatus] = useState<TaskStatus>('scheduled');

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
    onAdd({ title, description, type, date, startTime, endTime, repeat, priority, status });
    setTitle('');
    setDescription('');
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
          <label htmlFor="description" className="block text-white mb-2 text-sm">Descrição (opcional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full p-2.5 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-[#57F177] outline-none transition-colors resize-none"
            placeholder="Ex: Sala 3.14, Trazer portátil"
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-2 text-sm">Prioridade</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full p-2.5 rounded-lg bg-zinc-800 text-white border border-zinc-700 outline-none"
              required
            >
              <option value="LOW">Baixa</option>
              <option value="MEDIUM">Média</option>
              <option value="HIGH">Alta</option>
            </select>
          </div>
          <div>
            <label className="block text-white mb-2 text-sm">Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full p-2.5 rounded-lg bg-zinc-800 text-white border border-zinc-700 outline-none"
              required
            >
              <option value="scheduled">Agendado</option>
              <option value="ongoing">Em andamento</option>
              <option value="finished">Concluído</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-white mb-2 text-sm">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-zinc-800 text-white border border-zinc-700 outline-none"
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
              style={{ colorScheme: 'light ' }}
            />
          </div>
          <div className="flex-1">
            <label className="block text-white mb-2 text-sm">Fim</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-zinc-800 text-white border border-zinc-700 outline-none"
              style={{ colorScheme: 'light'}}
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
            className="px-6 py-2 rounded-lg bg-linear-to-r from-[#57F177] to-[#4CB2D8] text-[#06141F] font-bold text-sm shadow-lg active:scale-95 transition-all"
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
  const router = useRouter();
  const { tasks, addTask, toggleTask, removeTask } = useTasks();
  const { hideBottomTabs, showBottomTabs } = useUI();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<TaskType | 'Todas'>('Todas');
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Controlar visibilidade do BottomTabs quando modal abre/fecha
  useEffect(() => {
    if (showAddModal || taskToDelete) {
      hideBottomTabs();
    } else {
      showBottomTabs();
    }
  }, [showAddModal, taskToDelete, hideBottomTabs, showBottomTabs]);

  const handleAddTask = useCallback(async (taskData: Omit<Task, 'id' | 'completed' | 'duration'>) => {
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
    await addTask(newTask);
  }, [addTask]);

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
  };

  const handleEditTask = (task: Task) => {
    // Guardar tarefa no localStorage para edição
    localStorage.setItem('editingTask', JSON.stringify(task));
    router.push('/development');
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      await removeTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setTaskToDelete(null);
  };

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  // Filtrar tarefas baseado no dia selecionado e no filtro de tipo
  const tasksForSelectedDate = tasks.filter(task => {
    const taskDate = new Date(task.date);
    return taskDate.toDateString() === selectedDate.toDateString();
  });

  const filteredTasks = selectedFilter === 'Todas' 
    ? tasksForSelectedDate 
    : tasksForSelectedDate.filter(task => task.type === selectedFilter);

  const groupedTasks = filteredTasks.reduce<Record<TaskType, Task[]>>((acc, task) => {
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
      <StickyHeaderDate />

      {/* Container fixo para filtros, seletor de data e botão */}
      <div className="sticky top-14 z-30 pb-2" style={{ background: 'var(--background)' }}>
        {/* Filtros / Tabs */}
        <div className="flex px-4 gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide pt-2" role="tablist">
          {/* Botão "Todas" */}
          <button
            onClick={() => setSelectedFilter('Todas')}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm transition-all whitespace-nowrap ${
              selectedFilter === 'Todas' 
                ? 'bg-gradient-to-r from-[#57F177] to-[#4CB2D8] text-[#06141F]' 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
            role="tab"
            aria-selected={selectedFilter === 'Todas'}
          >
            Todas ({tasksForSelectedDate.length})
          </button>
          
          {/* Botões de filtro por tipo */}
          {Object.entries(typeColors).map(([key, color]) => {
            const taskCount = tasksForSelectedDate.filter(t => t.type === key).length;
            const isSelected = selectedFilter === key;
            
            return (
              <button
                key={key}
                onClick={() => setSelectedFilter(key as TaskType)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm transition-all whitespace-nowrap ${
                  isSelected 
                    ? `${color} text-white ring-2 ring-white/50` 
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
                role="tab"
                aria-selected={isSelected}
              >
                {typeLabels[key as TaskType]} ({taskCount})
              </button>
            );
          })}
        </div>

        {/* Seletor de Dia */}
        <div className="px-4 mb-2">
          <div className="bg-[#1C3B4F]/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 flex items-center justify-between">
            <button
              onClick={goToPreviousDay}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Dia anterior"
            >
              <FiChevronLeft className="text-white text-lg" />
            </button>
            
            <div className="text-center flex-1">
              <p className="text-white font-bold text-base">
                {new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'long' }).format(selectedDate)}
              </p>
            </div>
            
            <button
              onClick={goToNextDay}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Próximo dia"
            >
              <FiChevronRight className="text-white text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Tarefas */}
      <div className="flex-1 px-4 space-y-3 mb-16">
        {filteredTasks.length > 0 ? (
          Object.entries(groupedTasks).map(([type, tasks]) => (
            <div key={type} className="space-y-3">
              {tasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  toggleTask={toggleTask}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                />
              ))}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-500 py-16">
            <p className="text-sm">
              {selectedFilter === 'Todas' 
                ? 'Nenhuma tarefa registada.' 
                : `Nenhuma tarefa de ${typeLabels[selectedFilter as TaskType]}.`}
            </p>
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

      {/* Modal de Confirmação de Exclusão (usando mesmo estilo do modal de Terminar Sessão) */}
      {taskToDelete && (
        <Modal onClose={handleCancelDelete}>
          <div className="text-center">
            <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="text-red-500" size={32} />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Apagar Tarefa?</h3>
            <p className="text-gray-400 mb-8 text-sm px-2">Tem a certeza que deseja apagar "{taskToDelete.title}"?</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleConfirmDelete} 
                className="w-full rounded-xl py-3.5 text-base font-bold text-red-500 shadow-lg bg-red-500/10 border border-red-500/50 hover:bg-red-500/20 transition-all"
              >
                Sim, apagar tarefa
              </button>
              <button
                type="button"
                onClick={handleCancelDelete}
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