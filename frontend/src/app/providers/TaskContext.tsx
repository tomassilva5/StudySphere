'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

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
  addTask: (task: Task) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => void;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
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
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Usar URL da API via variável de ambiente
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    // Só carregar tarefas se o utilizador estiver autenticado
    if (isAuthLoading) return;
    const mapEventToTask = (evento: any): Task => {
      const startDate = new Date(evento.data_inicio);
      const endDate = new Date(evento.data_fim);

      return {
        id: evento.id,
        title: evento.titulo,
        description: evento.descricao,
        type: dbToFrontendCategory(evento.categoria),
        startTime: startDate.toTimeString().slice(0, 5),
        endTime: endDate.toTimeString().slice(0, 5),
        date: startDate.toISOString().split('T')[0],
        repeat: evento.recorrencia,
        duration: calculateDuration(startDate.toTimeString().slice(0, 5), endDate.toTimeString().slice(0, 5)),
        completed: evento.estado === 'concluido',
        priority: evento.prioridade === 'BAIXA' ? 'LOW' : evento.prioridade === 'MEDIA' ? 'MEDIUM' : 'HIGH',
        status: (() => {
          switch (evento.estado) {
            case 'em_andamento':
              return 'ongoing';
            case 'concluido':
              return 'finished';
            case 'cancelado':
              return 'cancelled';
            default:
              return 'scheduled';
          }
        })(),
        startDate,
        endDate,
      };
    };

    const mapGoogleEventToTask = (gEvent: any): Task => {
      const startDate = new Date(gEvent.start.dateTime || gEvent.start.date);
      const endDate = new Date(gEvent.end.dateTime || gEvent.end.date);

      return {
        id: `google-${gEvent.id}`,
        title: gEvent.summary || 'Sem título',
        description: gEvent.description || '',
        type: 'Eventos Pessoais',
        startTime: startDate.toTimeString().slice(0, 5),
        endTime: endDate.toTimeString().slice(0, 5),
        date: startDate.toISOString().split('T')[0],
        duration: calculateDuration(startDate.toTimeString().slice(0, 5), endDate.toTimeString().slice(0, 5)),
        completed: false,
        priority: 'MEDIUM',
        status: 'scheduled',
        startDate,
        endDate,
      };
    };

    const fetchTasks = async () => {
      try {
        // Se não estiver autenticado, não carregar tarefas
        if (!isAuthenticated) {
          setIsLoading(false);
          return;
        }

        let allTasks: Task[] = [];

        // Fetch regular events from database
        try {
          const eventsResponse = await fetch(`${API_URL}/api/v1/events/today`, {
            credentials: 'include',
          });

          if (eventsResponse.ok) {
            const eventos = await eventsResponse.json();
            allTasks = eventos.map(mapEventToTask);
          } else if (eventsResponse.status === 401) {
            console.log('Utilizador não autenticado');
            setTasks([]);
            setIsLoading(false);
            return;
          }
        } catch (eventsError) {
          console.error('Erro ao carregar eventos:', eventsError);
        }

        // Try to fetch Google Calendar events (will fail gracefully if not connected)
        try {
          const googleResponse = await fetch(`${API_URL}/api/v1/google/calendar/events`, {
            credentials: 'include',
          });

          if (googleResponse.ok) {
            const googleEvents = await googleResponse.json();
            const googleTasks = googleEvents.map(mapGoogleEventToTask);
            allTasks = [...allTasks, ...googleTasks];
          }
        } catch (googleError) {
          console.log('Google Calendar não conectado ou erro ao carregar eventos');
        }

        setTasks(allTasks);
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        const stored = localStorage.getItem('tasks');
        if (stored) setTasks(JSON.parse(stored));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [API_URL, isAuthenticated, isAuthLoading]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const taskStatusToBackend = (status: TaskStatus) => {
    switch (status) {
      case 'ongoing':
        return 'em_andamento';
      case 'finished':
        return 'concluido';
      case 'cancelled':
        return 'cancelado';
      default:
        return 'agendado';
    }
  };

  const taskPriorityToBackend = (priority: TaskPriority) => {
    switch (priority) {
      case 'LOW':
        return 'BAIXA';
      case 'MEDIUM':
        return 'MEDIA';
      default:
        return 'ALTA';
    }
  };

  const addTask = async (task: Task) => {
    try {
      const payload = {
        titulo: task.title,
        descricao: task.description,
        data_inicio: new Date(`${task.date}T${task.startTime}:00`).toISOString(),
        data_fim: new Date(`${task.date}T${task.endTime}:00`).toISOString(),
        e_virtual: false,
        prioridade: taskPriorityToBackend(task.priority),
        categoria: frontendToDbCategory(task.type),
        estado: taskStatusToBackend(task.status),
      };
      
      const response = await fetch(`${API_URL}/api/v1/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const created = await response.json();
        setTasks(prev => [...prev, { ...task, id: created.id }]);
      }
    } catch (error) {
      console.error('Erro ao criar evento', error);
    }
  };

  const removeTask = async (id: string) => {
    // Don't allow deleting Google Calendar events
    if (id.startsWith('google-')) {
      console.warn('Cannot delete Google Calendar events from this interface');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/events/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setTasks(tasks.filter(t => t.id !== id));
      } else {
        console.error('Falha ao apagar evento');
      }
    } catch (error) {
      console.error('Erro ao apagar evento', error);
    }
  };

  const toggleTask = (id: string) => {
    // Don't allow toggling Google Calendar events
    if (id.startsWith('google-')) {
      return;
    }

    setTasks(tasks.map(t =>
      t.id === id
        ? { ...t, completed: !t.completed, status: !t.completed ? 'finished' : 'scheduled' }
        : t
    ));
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const original = tasks.find(t => t.id === id);
      const merged = { ...original, ...updates } as Task;
      const payload: any = {
        titulo: merged.title,
        descricao: merged.description,
        data_inicio: new Date(`${merged.date}T${merged.startTime}:00`).toISOString(),
        data_fim: new Date(`${merged.date}T${merged.endTime}:00`).toISOString(),
        prioridade: taskPriorityToBackend(merged.priority),
        categoria: frontendToDbCategory(merged.type),
        estado: taskStatusToBackend(merged.status),
      };

      const response = await fetch(`${API_URL}/api/v1/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setTasks(prev => prev.map(t => (t.id === id ? merged : t)));
      } else {
        console.error('Falha ao atualizar evento');
      }
    } catch (error) {
      console.error('Erro ao atualizar evento', error);
    }
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
