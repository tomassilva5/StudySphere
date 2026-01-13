'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useTasks } from './TaskContext';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'task' | 'group' | 'event' | 'summary';
  timestamp: Date;
  read: boolean;
  taskId?: string;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { tasks } = useTasks();

  useEffect(() => {
    const stored = localStorage.getItem('notifications');
    if (stored) {
      const parsed = JSON.parse(stored);
      setNotifications(parsed.map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp),
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const checkTaskReminders = () => {
      const settingsStr = localStorage.getItem('notificationSettings');
      if (!settingsStr) return;

      const notifSettings = JSON.parse(settingsStr);
      
      // Se "Pause All" estiver ativo ou "Reminders" desativado, não processa nada
      if (notifSettings.pauseAll || !notifSettings.taskReminders) return;

      const now = new Date();
      
      tasks.forEach(task => {
        if (task.completed) return;

        const taskStart = new Date(`${task.date}T${task.startTime}`);
        const diffMinutes = Math.floor((taskStart.getTime() - now.getTime()) / (1000 * 60));

        const alreadyNotified = notifications.some(n => n.taskId === task.id && !n.read);
        if (alreadyNotified) return;

        let shouldNotify = false;
        let minutesBefore = 0;

        if (notifSettings.taskBefore15min && diffMinutes === 15) {
          shouldNotify = true;
          minutesBefore = 15;
        } else if (notifSettings.taskBefore30min && diffMinutes === 30) {
          shouldNotify = true;
          minutesBefore = 30;
        } else if (notifSettings.taskBefore1hour && diffMinutes === 60) {
          shouldNotify = true;
          minutesBefore = 60;
        }

        if (shouldNotify) {
          addNotification({
            title: `Lembrete: ${task.title}`,
            message: `Começa em ${minutesBefore} minutos`,
            type: 'task',
            taskId: task.id,
          });

          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Lembrete: ${task.title}`, {
              body: `Começa em ${minutesBefore} minutos`,
              icon: '/Logo/Logo.jpg',
            });
          }
        }
      });
    };

    const interval = setInterval(checkTaskReminders, 60000); 
    return () => clearInterval(interval);
  }, [tasks, notifications]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount: notifications.filter(n => !n.read).length,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
}