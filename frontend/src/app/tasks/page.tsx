'use client';

import { useState } from 'react';

export default function Tasks() {
  const [tasks, setTasks] = useState<Array<{ id: number; title: string; completed: boolean }>>([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), title: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div
      className="min-h-screen pb-24"
      style={{
        backgroundColor: '#06141F',
      }}
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Tarefas</h1>

        {/* Input para nova tarefa */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="Adicionar nova tarefa..."
            className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder-zinc-500"
          />
          <button
            onClick={addTask}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            Adicionar
          </button>
        </div>

        {/* Lista de tarefas */}
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-8 text-center">
              <p className="text-zinc-600 dark:text-zinc-400">
                Nenhuma tarefa. Comece adicionando uma nova!
              </p>
            </div>
          ) : (
            tasks.map(task => (
              <div
                key={task.id}
                className="bg-white dark:bg-zinc-900 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <span className={task.completed ? 'line-through text-zinc-400' : 'text-zinc-900 dark:text-zinc-50'}>
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="px-3 py-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition"
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
