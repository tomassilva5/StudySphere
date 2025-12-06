// TaskContext.tsx
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
export type TaskType = 'Universidade' | 'Estudo Individual' | 'Estudo de Grupo' | 'Eventos Pessoais' | 'Lazer';
export type RepeatType = 'Nunca' | 'Todos os dias' | 'Todas as semanas' | 'Todos os meses';
export type TaskRepetition = RepeatType; // Alias for compatibility
export type Task = {
  id: string;
  title: string;
  type: TaskType;
  startTime: string;
  endTime: string;
  repeat: RepeatType;
  duration: number; // Duration in hours
  completed: boolean;
};
type TaskContextType = {
  tasks: Task[];
  addTask: (task: Task) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
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
  const addTask = (task: Task) => setTasks((prev) => [...prev, task]);
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