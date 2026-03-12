'use client';

import React, { useState } from 'react';
import { parseMermaidCode } from '@/lib/parseMermaid';
import { FlowchartNode, Connection } from '@/lib/flowchartTypes';

interface ImportModalProps {
  onImport: (nodes: FlowchartNode[], connections: Connection[]) => void;
  onClose: () => void;
}

export default function ImportModal({ onImport, onClose }: ImportModalProps) {
  const [code, setCode] = useState('');

  const handleImport = () => {
    try {
      const { nodes, connections } = parseMermaidCode(code);
      onImport(nodes, connections);
    } catch {
      alert('Error parsing Mermaid code. Please check the format.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-slate-700">
        <h2 className="text-lg font-bold mb-4">Import Mermaid Code</h2>
        <p className="text-sm text-slate-400 mb-4">Paste your Mermaid flowchart code below:</p>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`flowchart TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Action 1]\n    B -->|No| D[Action 2]`}
          className="w-full h-64 bg-slate-900 border border-slate-600 rounded-lg p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!code.trim()}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 rounded-lg transition"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
