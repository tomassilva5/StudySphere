'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type TaskType = 'Universidade' | 'Estudo Individual' | 'Estudo de Grupo' | 'Eventos Pessoais' | 'Lazer';
export type RepeatType = 'Nunca' | 'Todos os dias' | 'Todas as semanas' | 'Todos os meses';

export type Task = {
  id: string;
  title: string;
  type: TaskType;
  date: string; // Adicionado campo para a data
  startTime: string;
  endTime: string;
  repeat: RepeatType;
  duration: number; // Duration in hours
  completed: boolean;
};

type TaskContextType = {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'duration' | 'completed'>) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
};

const calculateDuration = (startTime: string, endTime: string): number => {
  const startDate = new Date(`1970-01-01T${startTime}:00`);
  const endDate = new Date(`1970-01-01T${endTime}:00`);
  const diffInMs = endDate.getTime() - startDate.getTime();
  return diffInMs / (1000 * 60 * 60); // Convert milliseconds to hours
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('tasks');
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id' | 'duration' | 'completed'>) => {
    const duration = calculateDuration(task.startTime, task.endTime);
    const newTask = {
      ...task,
      id: Date.now().toString(),
      duration,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const removeTask = (id: string) => setTasks((prev) => prev.filter((task) => task.id !== id));

  const toggleTask = (id: string) => setTasks((prev) =>
    prev.map((task) => task.id === id ? { ...task, completed: !task.completed } : task)
  );

  return (
    <TaskContext.Provider value={{ tasks, addTask, removeTask, toggleTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
}
