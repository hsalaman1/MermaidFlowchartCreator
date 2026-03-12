'use client';

import React, { useState } from 'react';
import { NODE_TYPES, PRESET_COLORS, FlowchartNode, Connection } from '@/lib/flowchartTypes';

interface NodeWizardProps {
  nodes: FlowchartNode[];
  actors: string[];
  onFinish: (node: Omit<FlowchartNode, 'id'>, connection?: Omit<Connection, 'to'>) => void;
  onCancel: () => void;
}

export default function NodeWizard({ nodes, actors, onFinish, onCancel }: NodeWizardProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<{
    type?: string;
    text?: string;
    branches?: string[];
    connectFrom?: string;
    connectionLabel?: string;
    actor?: string;
    color?: string;
  }>({});

  const handleNext = (update: Partial<typeof data>) => {
    const merged = { ...data, ...update };
    setData(merged);

    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (merged.type === 'decision') {
        setStep(3);
      } else {
        setStep(4);
      }
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      const finalData = { ...merged, ...update };
      const nodeType = finalData.type || 'process';
      onFinish(
        {
          type: nodeType,
          text: finalData.text || '',
          color: finalData.color || NODE_TYPES[nodeType].color,
          actor: finalData.actor || 'Default',
        },
        finalData.connectFrom && finalData.connectFrom !== 'none'
          ? { from: finalData.connectFrom, label: finalData.connectionLabel || '' }
          : undefined
      );
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-900/90 z-10 flex items-center justify-center p-8">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700 shadow-2xl">
        <h2 className="text-lg font-bold mb-4">Add New Node — Step {step} of 4</h2>

        {step === 1 && (
          <div>
            <p className="text-slate-400 mb-4">What type of node do you want to add?</p>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(NODE_TYPES).map(([key, val]) => {
                const Icon = val.icon;
                return (
                  <button
                    key={key}
                    onClick={() => handleNext({ type: key })}
                    className="flex items-center gap-3 p-4 rounded-lg border border-slate-600 hover:border-cyan-500 hover:bg-cyan-500/10 transition text-left"
                  >
                    <Icon size={24} style={{ color: val.color }} />
                    <span className="font-medium">{val.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-slate-400 mb-4">
              Enter the text for this {NODE_TYPES[data.type!].label.toLowerCase()} node:
            </p>
            <textarea
              autoFocus
              placeholder={
                data.type === 'decision'
                  ? 'e.g., "Is behavior appropriate?"'
                  : 'e.g., "Provide reinforcement"'
              }
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              rows={3}
              value={data.text || ''}
              onChange={(e) => setData(prev => ({ ...prev, text: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (data.text) handleNext({});
                }
              }}
            />
            <button
              onClick={() => handleNext({})}
              disabled={!data.text}
              className="mt-4 w-full py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg font-medium transition"
            >
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="text-slate-400 mb-4">This is a decision node. How many branches?</p>
            <div className="space-y-3">
              <button
                onClick={() => handleNext({ branches: ['Yes', 'No'] })}
                className="w-full p-4 rounded-lg border border-slate-600 hover:border-cyan-500 hover:bg-cyan-500/10 transition text-left"
              >
                <span className="font-medium">Yes / No</span>
                <span className="block text-sm text-slate-400 mt-1">Two-way decision</span>
              </button>
              <button
                onClick={() => {
                  const count = prompt('How many branches? (2-5)', '3');
                  const num = parseInt(count || '3') || 3;
                  const branches = Array.from(
                    { length: Math.min(5, Math.max(2, num)) },
                    (_, i) => `Option ${i + 1}`
                  );
                  handleNext({ branches });
                }}
                className="w-full p-4 rounded-lg border border-slate-600 hover:border-cyan-500 hover:bg-cyan-500/10 transition text-left"
              >
                <span className="font-medium">Multiple Options</span>
                <span className="block text-sm text-slate-400 mt-1">3 or more branches</span>
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <p className="text-slate-400 mb-4">What should this node connect from?</p>

            <select
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-3"
              onChange={(e) => setData(prev => ({ ...prev, connectFrom: e.target.value }))}
              value={data.connectFrom || 'none'}
            >
              <option value="none">No connection (start fresh)</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>
                  {NODE_TYPES[node.type].label}: {node.text.substring(0, 30)}
                </option>
              ))}
            </select>

            {data.connectFrom && data.connectFrom !== 'none' && (
              <input
                type="text"
                placeholder="Connection label (optional, e.g., 'Yes')"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-3"
                value={data.connectionLabel || ''}
                onChange={(e) => setData(prev => ({ ...prev, connectionLabel: e.target.value }))}
              />
            )}

            <div className="mb-3">
              <label className="block text-sm text-slate-400 mb-2">Actor/Swimlane (optional)</label>
              <select
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                onChange={(e) => setData(prev => ({ ...prev, actor: e.target.value }))}
                value={data.actor || 'Default'}
              >
                {actors.map(actor => (
                  <option key={actor} value={actor}>{actor}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setData(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-lg border-2 transition ${
                      data.color === color ? 'border-white scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => handleNext({})}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium transition"
            >
              Create Node
            </button>
          </div>
        )}

        <button
          onClick={onCancel}
          className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
