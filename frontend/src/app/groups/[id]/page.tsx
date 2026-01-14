'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { HiCheckCircle, HiChevronLeft, HiUserGroup, HiPaperAirplane, HiPlus, HiXMark } from "react-icons/hi2";
import { FiCheckSquare, FiClock, FiTrash2, FiEdit2 } from 'react-icons/fi';
import HeaderDate from '../../components/HeaderDate';
import Modal from '../../components/Modal';
import ButtonAdd from '../../components/ButtonAdd';
import { io, Socket } from 'socket.io-client';
import { useUI } from '@/app/providers/UIContext';

type Task = {
  id: string;
  titulo: string;
  responsavel: string;
  data: string;
  completed: boolean;
};

type Message = {
  id: string;
  autor: {
    id: string;
    nome_utilizador: string;
    nome_completo: string | null;
  };
  autor_id: string;
  mensagem: string;
  criado_em: string;
};

type GroupDetails = {
  id: string;
  nome: string;
  descricao: string;
  membros: Array<{
    utilizador: {
      id: string;
      nome_utilizador: string;
      nome_completo: string | null;
    };
  }>;
};

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;
  const { hideBottomTabs, showBottomTabs } = useUI();
  
  const [activeTab, setActiveTab] = useState<'tasks' | 'chat'>('tasks');
  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Controlar visibilidade do BottomTabs baseado na tab ativa e modais
  useEffect(() => {
    if (activeTab === 'chat' || showTaskModal || taskToDelete) {
      hideBottomTabs();
    } else {
      showBottomTabs();
    }
    
    return () => {
      showBottomTabs();
    };
  }, [activeTab, showTaskModal, taskToDelete, hideBottomTabs, showBottomTabs]);

  // Scroll automático para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Carregar detalhes do grupo e ID do usuário
  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        
        // Carregar ID do usuário atual
        const userResponse = await fetch(`${apiUrl}/api/v1/users/me`, {
          credentials: 'include',
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setCurrentUserId(userData.id);
        }

        const response = await fetch(`${apiUrl}/api/v1/groups/${groupId}`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setGroup(data);
          
          // Carregar tarefas do grupo
          const tasksData: Task[] = data.eventos_grupo?.map((eg: any) => ({
            id: eg.evento.id,
            titulo: eg.evento.titulo,
            responsavel: eg.evento.proprietario?.nome_utilizador || 'Desconhecido',
            data: new Date(eg.evento.data_fim).toLocaleDateString('pt-PT', {
              day: 'numeric',
              month: 'short'
            }),
            completed: eg.evento.estado === 'concluido',
          })) || [];
          
          setTasks(tasksData);
        }
      } catch (error) {
        console.error('Erro ao carregar grupo:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  // Carregar mensagens do chat e configurar WebSocket
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/api/v1/groups/${groupId}/messages`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
      }
    };

    if (activeTab === 'chat') {
      fetchMessages();
      
      // Conectar WebSocket - usa URL configurada em env
      const socketUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
      
      const socket = io(socketUrl, {
        withCredentials: true,
      });

      socket.on('connect', () => {
        console.log('WebSocket conectado');
        setIsSocketConnected(true);
        socket.emit('join_room', `group_${groupId}`);
      });

      socket.on('disconnect', () => {
        console.log('WebSocket desconectado');
        setIsSocketConnected(false);
      });

      socket.on('receive_message', (data: any) => {
        console.log('Mensagem recebida via WebSocket:', data);
        const newMessage: Message = {
          id: Date.now().toString(),
          autor: {
            id: data.senderId,
            nome_utilizador: data.autor || 'Desconhecido',
            nome_completo: null,
          },
          autor_id: data.senderId,
          mensagem: data.content,
          criado_em: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, newMessage]);
      });

      socketRef.current = socket;

      return () => {
        socket.disconnect();
        socketRef.current = null;
      };
    }
  }, [groupId, activeTab]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    const messageText = messageInput;
    setMessageInput(''); // Limpar imediatamente para melhor UX

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      // SEMPRE salvar na BD primeiro
      const response = await fetch(`${apiUrl}/api/v1/groups/${groupId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ mensagem: messageText }),
      });

      if (response.ok) {
        const savedMessage = await response.json();
        
        // Atualizar UI localmente
        setMessages(prev => [...prev, savedMessage]);

        // Se WebSocket conectado, notificar outros usuários em tempo real
        if (isSocketConnected && socketRef.current) {
          console.log('Notificando outros usuários via WebSocket');
          socketRef.current.emit('send_message', {
            chatId: `group_${groupId}`,
            content: messageText,
            autor: savedMessage.autor.nome_utilizador,
            messageId: savedMessage.id,
          });
        }
      } else {
        console.error('Erro ao enviar mensagem');
        setMessageInput(messageText); // Restaurar mensagem em caso de erro
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setMessageInput(messageText); // Restaurar mensagem em caso de erro
    }
  };

  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = !task.completed;
    
    // Atualização otimista
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, completed: newStatus } : t
    ));
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/v1/events/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          estado: newStatus ? 'concluido' : 'agendado' 
        }),
      });

      if (!response.ok) {
        // Reverter em caso de erro
        setTasks(tasks.map(t => 
          t.id === taskId ? { ...t, completed: !newStatus } : t
        ));
        console.error('Erro ao atualizar tarefa');
      }
    } catch (error) {
      // Reverter em caso de erro
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, completed: !newStatus } : t
      ));
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const handleDeleteTask = async (task: Task) => {
    setTaskToDelete(task);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    
    const taskId = taskToDelete.id;
    
    // Fechar modal imediatamente
    setTaskToDelete(null);
    
    // Remover da lista otimisticamente
    const previousTasks = [...tasks];
    setTasks(tasks.filter(t => t.id !== taskId));
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/v1/events/${taskId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        // Se falhar, restaurar tasks
        setTasks(previousTasks);
        console.error('Erro ao eliminar tarefa');
        alert('Erro ao eliminar tarefa. Tente novamente.');
      }
    } catch (error) {
      // Restaurar tasks em caso de erro
      setTasks(previousTasks);
      console.error('Erro ao eliminar tarefa:', error);
      alert('Erro ao eliminar tarefa. Tente novamente.');
    }
  };

  const handleCancelDelete = () => {
    setTaskToDelete(null);
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const payload = {
        titulo: taskData.titulo,
        descricao: taskData.descricao || '',
        data_inicio: taskData.data_inicio,
        data_fim: taskData.data_fim,
        e_virtual: false,
        categoria: 'Estudo_Grupo',
        estado: 'agendado',
        grupo_id: groupId
      };

      const response = await fetch(`${apiUrl}/api/v1/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const createdEvent = await response.json();
        
        // Adicionar evento ao grupo
        const linkResponse = await fetch(`${apiUrl}/api/v1/events/${createdEvent.id}/groups`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ grupo_id: groupId }),
        });

        if (linkResponse.ok) {
          // Adicionar à lista local
          const newTask: Task = {
            id: createdEvent.id,
            titulo: createdEvent.titulo,
            responsavel: 'Você',
            data: new Date(createdEvent.data_fim).toLocaleDateString('pt-PT', {
              day: 'numeric',
              month: 'short'
            }),
            completed: false,
          };
          
          setTasks([...tasks, newTask]);
        }
      }
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      alert('Erro ao criar tarefa');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#57F177]"></div>
          <p className="text-gray-400 mt-4">A carregar grupo...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <p className="text-gray-400">Grupo não encontrado</p>
      </div>
    );
  }

  const containerClass = activeTab === 'chat'
    ? 'h-screen overflow-hidden flex flex-col'
    : 'min-h-screen pb-24 flex flex-col';

  const contentWrapperClass = activeTab === 'chat'
    ? 'flex-1 overflow-hidden px-6'
    : 'px-6';

  return (
    <div className={containerClass} style={{ background: 'var(--background)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-[#06141F] via-[#06141F] to-transparent pt-6 pb-4 px-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.back()} className="text-white">
            <HiChevronLeft className="text-3xl" />
          </button>
          <button className="w-12 h-12 rounded-full bg-gradient-to-br from-[#57F177] to-[#4CB2D8] flex items-center justify-center">
            <HiUserGroup className="text-[#06141F] text-xl" />
          </button>
        </div>

        <h1 className="text-white text-2xl font-bold mb-1">{group.nome}</h1>
        <p className="text-gray-400 text-sm mb-4">{group.descricao}</p>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex -space-x-2">
            {group.membros.slice(0, 3).map((membro, index) => (
              <div 
                key={index} 
                className="w-9 h-9 rounded-full bg-[#0B161E] border-2 border-[#06141F] flex items-center justify-center text-xs text-white font-medium"
              >
                {membro.utilizador.nome_utilizador.substring(0, 2).toUpperCase()}
              </div>
            ))}
          </div>
          <span className="text-gray-400 text-sm">{group.membros.length} membros</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-3 rounded-2xl font-medium transition-all ${
              activeTab === 'tasks'
                ? 'bg-gradient-to-br from-[#57F177] to-[#4CB2D8] text-[#06141F]'
                : 'bg-[#1C3B4F]/40 text-gray-400'
            }`}
          >
            Tarefas
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 rounded-2xl font-medium transition-all ${
              activeTab === 'chat'
                ? 'bg-gradient-to-br from-[#57F177] to-[#4CB2D8] text-[#06141F]'
                : 'bg-[#1C3B4F]/40 text-gray-400'
            }`}
          >
            Chat
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={contentWrapperClass}>
        {activeTab === 'tasks' ? (
          <div className="relative pb-20">
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">Nenhuma tarefa criada</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`rounded-xl p-3 border border-zinc-800 transition-all ${
                      task.completed ? 'bg-[#1C3B4F]/70 opacity-80' : 'bg-[#1C3B4F]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FiCheckSquare
                        onClick={() => handleToggleTask(task.id)}
                        className={`text-xl cursor-pointer transition-colors ${
                          task.completed ? 'text-green-400' : 'text-zinc-500'
                        }`}
                        aria-label={task.completed ? 'Desmarcar' : 'Marcar'}
                        role="button"
                      />
                      <div className="flex-1">
                        <h3 className={`font-medium ${task.completed ? 'text-zinc-400 line-through' : 'text-white'}`}>
                          {task.titulo}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs flex items-center gap-1 ${task.completed ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            {task.responsavel}
                          </span>
                          <span className={`text-xs ${task.completed ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            • {task.data}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          type="button" 
                          aria-label="Eliminar" 
                          className="hover:text-red-400 transition-colors"
                          onClick={() => handleDeleteTask(task)}
                        >
                          <FiTrash2 className="text-red-500/80" size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="fixed bottom-20 right-6 z-40">
              <ButtonAdd onClick={() => setShowTaskModal(true)} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Indicador de status WebSocket */}
            <div className="flex items-center justify-center gap-2 mb-4 py-2 px-4 rounded-lg bg-[#1C3B4F]/40">
              <div className={`w-2 h-2 rounded-full ${isSocketConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-xs text-gray-400">
                {isSocketConnected ? 'Chat em tempo real' : 'Modo offline'}
              </span>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pb-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">Nenhuma mensagem ainda</p>
                  <p className="text-gray-500 text-sm mt-2">Seja o primeiro a enviar uma mensagem!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isCurrentUser = msg.autor_id === currentUserId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isCurrentUser && (
                        <div className="w-10 h-10 rounded-full bg-[#0B161E] border border-gray-600 flex items-center justify-center text-xs text-white font-medium mr-2 flex-shrink-0">
                          {msg.autor.nome_utilizador.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className={`max-w-[70%] ${isCurrentUser ? 'flex items-end gap-3 flex-row-reverse' : ''}`}>
                        {isCurrentUser && (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#57F177] to-[#4CB2D8] flex items-center justify-center text-xs text-[#06141F] font-bold flex-shrink-0 ml-2">
                            {msg.autor.nome_utilizador.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          {!isCurrentUser && (
                            <p className="text-gray-400 text-xs mb-1">{msg.autor.nome_utilizador}</p>
                          )}
                          <div
                            className={`rounded-2xl p-3 ${
                              isCurrentUser
                                ? 'bg-gradient-to-br from-[#57F177] to-[#4CB2D8] text-[#06141F]'
                                : 'bg-[#1C3B4F]/60 text-white'
                            }`}
                          >
                            <p>{msg.mensagem}</p>
                          </div>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(msg.criado_em).toLocaleTimeString('pt-PT', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {/* Elemento invisível para scroll automático */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Escreva uma mensagem..."
                className="flex-1 px-4 py-3 rounded-2xl bg-[#1C3B4F]/60 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#57F177]"
              />
              <button
                onClick={handleSendMessage}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#57F177] to-[#4CB2D8] flex items-center justify-center text-[#06141F] hover:opacity-90 transition-opacity"
              >
                <HiPaperAirplane className="text-xl" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal para criar tarefa */}
      {showTaskModal && (
        <Modal onClose={() => setShowTaskModal(false)}>
          <AddTaskForm onClose={() => setShowTaskModal(false)} onCreate={handleCreateTask} />
        </Modal>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {taskToDelete && (
        <Modal onClose={handleCancelDelete}>
          <div className="p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-red-900/30 flex items-center justify-center">
                <FiTrash2 className="w-10 h-10 text-red-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Apagar Tarefa?
            </h3>
            <p className="text-zinc-400 mb-8">
              Tem a certeza que deseja apagar<br />
              &quot;{taskToDelete.titulo}&quot;?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmDelete}
                className="w-full px-6 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
              >
                Sim, apagar tarefa
              </button>
              <button
                onClick={handleCancelDelete}
                className="w-full px-6 py-4 border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 rounded-xl font-bold uppercase tracking-wider transition-colors"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Formulário de adicionar tarefa
function AddTaskForm({ onClose, onCreate }: { onClose: () => void, onCreate: (data: any) => void }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  

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
    const dataInicio = new Date(`${date}T${startTime}`);
    const dataFim = new Date(`${date}T${endTime}`);

    onCreate({
      titulo,
      descricao,
      data_inicio: dataInicio.toISOString(),
      data_fim: dataFim.toISOString(),
      // prioridade removed
    });
    setTitulo('');
    setDescricao('');
    onClose();
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
      <h2 className="text-xl font-bold text-white mb-4">Nova Tarefa do Grupo</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="titulo" className="block text-white mb-2 text-sm">Título</label>
          <input
            id="titulo"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-[#57F177] outline-none transition-colors"
            placeholder="Ex: Preparar apresentação"
            required
          />
        </div>
        <div>
          <label htmlFor="descricao" className="block text-white mb-2 text-sm">Descrição (opcional)</label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={2}
            className="w-full p-2.5 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-[#57F177] outline-none transition-colors resize-none"
            placeholder="Ex: Criar slides sobre o tema do projeto"
          />
        </div>
        {/* Prioridade removed for group task form */}
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
              style={{ colorScheme: 'light' }}
            />
          </div>
          <div className="flex-1">
            <label className="block text-white mb-2 text-sm">Fim</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-zinc-800 text-white border border-zinc-700 outline-none"
              style={{ colorScheme: 'light' }}
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