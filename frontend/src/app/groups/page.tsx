'use client';

import { useState } from 'react';
import { HiUserGroup, HiPlus, HiXMark } from "react-icons/hi2";
import ButtonAdd from '../components/ButtonAdd';
import Modal from '../components/Modal';
import HeaderDate from '../components/HeaderDate';

// --- FORMULÁRIO DE ADICIONAR GRUPO ---
function AddGroupForm({ onClose, onCreate }: { onClose: () => void, onCreate: (data: any) => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState<string[]>([]);

  const handleAddMember = () => {
    if (memberInput.trim() && !members.includes(memberInput.trim())) {
      setMembers([...members, memberInput.trim()]);
      setMemberInput('');
    }
  };

  const removeMember = (mem: string) => {
    setMembers(members.filter(m => m !== mem));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onCreate({ name, description, members });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-white mb-4">Criar Novo Grupo</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-white mb-2">Nome do Grupo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Projeto III"
            className="w-full p-2 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#57F177]"
            required
          />
        </div>
        <div>
          <label className="block text-white mb-2">Descrição</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Blockchain"
            className="w-full p-2 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#57F177]"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Adicionar Membros</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={memberInput}
              onChange={(e) => setMemberInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMember())}
              placeholder="Email ou utilizador"
              className="w-full p-2 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#57F177]"
            />
            <button type="button" onClick={handleAddMember} className="px-3 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700">
              <HiPlus />
            </button>
          </div>
          {members.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {members.map((member, idx) => (
                <span key={idx} className="bg-[#1C3B4F] border border-zinc-600 text-gray-200 text-xs px-2 py-1 rounded-md flex items-center gap-2">
                  {member}
                  <button type="button" onClick={() => removeMember(member)} className="text-red-400">
                    <HiXMark />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-zinc-800 text-white">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-br from-[#57F177] to-[#4CB2D8] text-[#06141F] font-bold">
            Criar
          </button>
        </div>
      </div>
    </form>
  );
}

// --- PÁGINA PRINCIPAL ---
export default function GroupsPage() {
  const [showModal, setShowModal] = useState(false);
  const [groups, setGroups] = useState([
    { id: 1, title: 'Projeto III', subtitle: 'BlockChain', members: ['FF', 'MA'], totalMembers: 2, progress: 69, totalTasks: 50 },
    { id: 2, title: 'SIR', subtitle: 'StudySphere', members: ['FF', 'MA', 'TS'], totalMembers: 3, progress: 35, totalTasks: 30 }
  ]);

  const handleCreateGroup = (data: any) => {
    const initials = data.members.map((m: string) => m.substring(0, 2).toUpperCase());
    const newGroup = {
      id: Date.now(),
      title: data.name,
      subtitle: data.description || 'Sem descrição',
      members: initials.length > 0 ? initials : ['EU'],
      totalMembers: data.members.length + 1,
      progress: 0,
      totalTasks: 0
    };
    setGroups([...groups, newGroup]);
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--background)' }}>
      {/* 1. Header Global com o Fade Suave */}
      <HeaderDate />

      {/* 2. Resumo */}
      <div className="mx-6 bg-[#1C3B4F]/40 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-6 mb-6 flex justify-between items-start shadow-md">
        <div>
          <p className="text-white font-medium text-sm mb-1">Grupos Ativos</p>
          <p className="text-[#57F177] font-medium text-3xl">{groups.length}</p>
        </div>
        <div className="text-left min-w-[100px]">
          <p className="text-white font-medium text-sm mb-1">Total de Tarefas</p>
          <p className="text-[#4CB2D8] font-medium text-3xl">80</p>
        </div>
      </div>

      {/* 3. Lista de Grupos */}
      <div className="px-6 space-y-4">
        {groups.map((group) => (
          <div key={group.id} className="bg-[#1C3B4F]/40 backdrop-blur-sm border border-gray-700/30 rounded-3xl p-5 relative transition-all active:scale-[0.98]">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-white font-medium text-lg tracking-wide">{group.title}</h3>
                <p className="text-gray-400 text-sm mt-0.5">{group.subtitle}</p>
              </div>
              <div className="bg-gradient-to-br from-[#57F177] to-[#4CB2D8] p-[1px] rounded-full">
                 <div className="bg-[#1C3B4F] w-12 h-12 rounded-full flex items-center justify-center">
                    <HiUserGroup className="text-[#57F177] text-2xl" />
                 </div>
              </div>
            </div>
            <div className="flex items-center mb-8 mt-2">
              <div className="flex -space-x-2">
                {group.members.map((initials, index) => (
                  <div key={index} className="w-9 h-9 rounded-full bg-[#0B161E] border border-gray-600 flex items-center justify-center text-xs text-white font-medium z-10">
                    {initials}
                  </div>
                ))}
              </div>
              <span className="text-gray-500 text-sm ml-3">{group.totalMembers} membros</span>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-xs">◎ Progresso</span>
                <span className="text-[#57F177] text-sm font-medium">{group.progress}%</span>
              </div>
              <div className="w-full bg-[#0B161E] h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#57F177] to-[#4CB2D8] h-full rounded-full" style={{ width: `${group.progress}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ButtonAdd onClick={() => setShowModal(true)} />

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <AddGroupForm onClose={() => setShowModal(false)} onCreate={handleCreateGroup} />
        </Modal>
      )}
    </div>
  );
}