'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type TaskType = 'Universidade' | 'Estudo Individual' | 'Estudo de Grupo' | 'Eventos Pessoais' | 'Lazer';
export type TaskStatus = 'scheduled' | 'ongoing' | 'finished' | 'cancelled';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type RepeatType = 'Nunca' | 'Todos os dias' | 'Todas as semanas' | 'Todos os meses';

export type Task = {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  startTime: string;
  endTime: string;
  date: string;
  repeat?: RepeatType;
  duration: number;
  completed: boolean;
  priority: TaskPriority;
  status: TaskStatus;
  startDate?: Date;
  endDate?: Date;
};

type TaskContextType = {
  tasks: Task[];
  addTask: (task: Task) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
};

const calculateDuration = (startTime: string, endTime: string): number => {
  const startDate = new Date(`1970-01-01T${startTime}:00`);
  const endDate = new Date(`1970-01-01T${endTime}:00`);
  const diffInMs = endDate.getTime() - startDate.getTime();
  return Math.abs(diffInMs / (1000 * 60 * 60)); // Convert milliseconds to hours
};

// Mapping functions for database enum conversion
const dbToFrontendCategory = (dbCategory: string): TaskType => {
  const mapping: Record<string, TaskType> = {
    'Universidade': 'Universidade',
    'Estudo_Individual': 'Estudo Individual',
    'Estudo_Grupo': 'Estudo de Grupo',
    'Eventos_Pessoais': 'Eventos Pessoais',
    'Lazer': 'Lazer'
  };
  return mapping[dbCategory] || 'Universidade';
};

const frontendToDbCategory = (frontendCategory: TaskType): string => {
  const mapping: Record<TaskType, string> = {
    'Universidade': 'Universidade',
    'Estudo Individual': 'Estudo_Individual',
    'Estudo de Grupo': 'Estudo_Grupo',
    'Eventos Pessoais': 'Eventos_Pessoais',
    'Lazer': 'Lazer'
  };
  return mapping[frontendCategory] || 'Universidade';
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('authToken='))
          ?.split('=')[1];

        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/eventos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const eventos = await response.json();
          const mappedTasks: Task[] = eventos.map((evento: any) => ({
            id: evento.id,
            title: evento.title,
            description: evento.description,
            type: dbToFrontendCategory(evento.category),
            startTime: new Date(evento.startDate).toTimeString().slice(0, 5),
            endTime: new Date(evento.endDate).toTimeString().slice(0, 5),
            date: new Date(evento.startDate).toISOString().split('T')[0],
            repeat: evento.recurrence,
            duration: calculateDuration(
              new Date(evento.startDate).toTimeString().slice(0, 5),
              new Date(evento.endDate).toTimeString().slice(0, 5)
            ),
            completed: evento.status === 'finished',
            priority: evento.priority,
            status: evento.status,
            startDate: new Date(evento.startDate),
            endDate: new Date(evento.endDate),
          }));
          setTasks(mappedTasks);
        }
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        const stored = localStorage.getItem('tasks');
        if (stored) setTasks(JSON.parse(stored));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t =>
      t.id === id
        ? { ...t, completed: !t.completed, status: !t.completed ? 'finished' : 'scheduled' }
        : t
    ));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, ...updates } : t
    ));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, removeTask, toggleTask, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
}
