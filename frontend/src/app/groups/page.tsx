'use client';

import { useState } from 'react';

export default function Groups() {
  const [groups, setGroups] = useState<Array<{ id: number; name: string; members: number; description: string }>>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  const addGroup = () => {
    if (newGroupName.trim()) {
      setGroups([...groups, { id: Date.now(), name: newGroupName, members: 1, description: newGroupDescription }]);
      setNewGroupName('');
      setNewGroupDescription('');
    }
  };

  const deleteGroup = (id: number) => {
    setGroups(groups.filter(group => group.id !== id));
  };

  return (
    <div
      className="min-h-screen pb-24"
      style={{
        backgroundColor: '#06141F',
      }}
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Grupos</h1>

        {/* Input para novo grupo */}
        <div className="space-y-3 mb-6">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addGroup()}
            placeholder="Nome do grupo..."
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder-zinc-500"
          />
          <input
            type="text"
            value={newGroupDescription}
            onChange={(e) => setNewGroupDescription(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addGroup()}
            placeholder="Descrição (opcional)..."
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder-zinc-500"
          />
          <button
            onClick={addGroup}
            className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            Criar Grupo
          </button>
        </div>

        {/* Lista de grupos */}
        {groups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">Nenhum grupo criado ainda. Comece a criar!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <div key={group.id} className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{group.name}</h3>
                    {group.description && <p className="text-zinc-400 text-sm mt-1">{group.description}</p>}
                    <p className="text-zinc-500 text-xs mt-2">{group.members} {group.members === 1 ? 'membro' : 'membros'}</p>
                  </div>
                  <button
                    onClick={() => deleteGroup(group.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
