'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface ActorModalProps {
  actors: string[];
  onAddActor: (name: string) => void;
  onRemoveActor: (name: string) => void;
  onClose: () => void;
}

export default function ActorModal({ actors, onAddActor, onRemoveActor, onClose }: ActorModalProps) {
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    if (newName.trim() && !actors.includes(newName.trim())) {
      onAddActor(newName.trim());
      setNewName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700">
        <h2 className="text-lg font-bold mb-4">Manage Actors/Swimlanes</h2>
        <p className="text-sm text-slate-400 mb-4">
          Actors create swimlanes to show &quot;who does what&quot; in your flowchart.
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New actor name (e.g., Teacher, RBT)"
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button
            onClick={handleAdd}
            disabled={!newName.trim()}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 rounded-lg transition"
          >
            Add
          </button>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
          {actors.map(actor => (
            <div key={actor} className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <span>{actor}</span>
              {actor !== 'Default' && (
                <button
                  onClick={() => onRemoveActor(actor)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
        >
          Done
        </button>
      </div>
    </div>
  );
}
