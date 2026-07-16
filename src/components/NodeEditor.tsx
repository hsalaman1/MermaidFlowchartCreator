'use client';

import React from 'react';
import { Link, Trash2, Unlink } from 'lucide-react';
import { NODE_TYPES, PRESET_COLORS, FlowchartNode, Connection } from '@/lib/flowchartTypes';

interface NodeEditorProps {
  node: FlowchartNode;
  actors: string[];
  connections: Connection[];
  nodes: FlowchartNode[];
  onUpdate: (updates: Partial<FlowchartNode>) => void;
  onDelete: () => void;
  onStartConnection: () => void;
  onDeleteConnection: (from: string, to: string) => void;
}

export default function NodeEditor({
  node,
  actors,
  connections,
  nodes,
  onUpdate,
  onDelete,
  onStartConnection,
  onDeleteConnection,
}: NodeEditorProps) {
  const outgoing = connections.filter(c => c.from === node.id);

  return (
    <div className="flowchart-editor border-t border-slate-700 p-4 md:p-5">
      <h3 className="flowchart-editor-title text-2xl font-semibold text-slate-300 mb-5">Edit Node</h3>

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Text</label>
          <textarea
            value={node.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Type</label>
          <select
            value={node.type}
            onChange={(e) => onUpdate({ type: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {Object.entries(NODE_TYPES).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Actor/Swimlane</label>
          <select
            value={node.actor}
            onChange={(e) => onUpdate({ actor: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {actors.map(actor => (
              <option key={actor} value={actor}>{actor}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Color</label>
          <div className="flex flex-wrap gap-1">
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                onClick={() => onUpdate({ color })}
                className={`w-6 h-6 rounded border-2 transition ${
                  node.color === color ? 'border-white scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="flowchart-editor-actions flex gap-2 pt-2">
          <button
            onClick={onStartConnection}
            className="flowchart-connect flex-1 flex items-center justify-center gap-1 px-2 py-2.5 rounded text-sm transition"
          >
            <Link size={14} /> Connect
          </button>
          <button
            onClick={onDelete}
            className="flowchart-delete flex-1 flex items-center justify-center gap-1 px-2 py-2.5 rounded text-sm transition"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      <div className="flowchart-connections mt-5 pt-4">
        <h4 className="text-xs font-semibold text-slate-400 mb-2">Connections</h4>
        {outgoing.length === 0 ? (
          <p className="text-xs text-slate-500">No outgoing connections</p>
        ) : (
          outgoing.map(conn => {
            const toNode = nodes.find(n => n.id === conn.to);
            return (
              <div
                key={`${conn.from}-${conn.to}`}
                className="flex items-center justify-between text-xs py-1"
              >
                <span className="text-slate-300">
                  → {toNode?.text.substring(0, 20) || conn.to}
                  {conn.label && (
                    <span className="text-cyan-400 ml-1">({conn.label})</span>
                  )}
                </span>
                <button
                  onClick={() => onDeleteConnection(conn.from, conn.to)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Unlink size={12} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
