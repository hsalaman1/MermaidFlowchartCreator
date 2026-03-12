'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { SavedChart } from '@/lib/flowchartTypes';

interface SaveModalProps {
  chartName: string;
  onChangeName: (name: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export function SaveModal({ chartName, onChangeName, onSave, onClose }: SaveModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700">
        <h2 className="text-lg font-bold mb-4">Save Flowchart</h2>
        <input
          type="text"
          value={chartName}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="Flowchart name"
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-4"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

interface LoadModalProps {
  charts: SavedChart[];
  onLoad: (chart: SavedChart) => void;
  onDelete: (chartName: string) => void;
  onClose: () => void;
}

export function LoadModal({ charts, onLoad, onDelete, onClose }: LoadModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700">
        <h2 className="text-lg font-bold mb-4">Load Flowchart</h2>
        {charts.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No saved flowcharts yet.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {charts.map(chart => (
              <div
                key={chart.name}
                className="flex items-center justify-between p-3 bg-slate-700 rounded-lg"
              >
                <div>
                  <p className="font-medium">{chart.name}</p>
                  <p className="text-xs text-slate-400">
                    {chart.nodes?.length || 0} nodes &bull;{' '}
                    {new Date(chart.savedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onLoad(chart)}
                    className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 rounded text-sm transition"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => onDelete(chart.name)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
