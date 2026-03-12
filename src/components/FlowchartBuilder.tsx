'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Plus, Trash2, Upload, Save, FolderOpen,
  ChevronRight, Users, Copy, FileText, Image as ImageIcon, RefreshCw, FileDown,
} from 'lucide-react';
import mermaid from 'mermaid';

import { FlowchartNode, Connection, SavedChart, generateId } from '@/lib/flowchartTypes';
import { generateMermaidCode } from '@/lib/generateMermaid';
import { loadCharts, saveChart as saveChartToStorage, deleteChart as deleteChartFromStorage } from '@/lib/storage';
import { exportPng } from '@/lib/exportPng';
import { exportPdf } from '@/lib/exportPdf';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

import NodeWizard from './NodeWizard';
import NodeList from './NodeList';
import NodeEditor from './NodeEditor';
import ActorModal from './ActorModal';
import ImportModal from './ImportModal';
import { SaveModal, LoadModal } from './SaveLoadModals';

let renderCounter = 0;

export default function FlowchartBuilder() {
  const [nodes, setNodes] = useState<FlowchartNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [actors, setActors] = useState<string[]>(['Default']);
  const [selectedNode, setSelectedNode] = useState<FlowchartNode | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [showWizard, setShowWizard] = useState(false);
  const [connectionMode, setConnectionMode] = useState<{ active: boolean; fromNode: string | null }>({
    active: false,
    fromNode: null,
  });

  const [mermaidCode, setMermaidCode] = useState('');
  const [mermaidSvg, setMermaidSvg] = useState('');
  const [currentChartName, setCurrentChartName] = useState('Untitled Flowchart');
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>([]);

  const [showImportModal, setShowImportModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showActorModal, setShowActorModal] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  // Initialize mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
    });
    setSavedCharts(loadCharts());
  }, []);

  // Generate code when nodes/connections change
  useEffect(() => {
    setMermaidCode(generateMermaidCode(nodes, connections));
  }, [nodes, connections]);

  // Debounce then render
  const debouncedCode = useDebouncedValue(mermaidCode, 300);

  const renderMermaid = useCallback(async () => {
    if (!debouncedCode) {
      setMermaidSvg('');
      return;
    }
    try {
      renderCounter++;
      const { svg } = await mermaid.render(`mermaid-diagram-${renderCounter}`, debouncedCode);
      setMermaidSvg(svg);
    } catch (e) {
      console.error('Mermaid render error:', e);
      setMermaidSvg(
        '<div style="color: #ef4444; padding: 20px;">Error rendering diagram. Please check your flowchart structure.</div>'
      );
    }
  }, [debouncedCode]);

  useEffect(() => {
    renderMermaid();
  }, [renderMermaid]);

  // Keep selectedNode in sync with nodes
  useEffect(() => {
    if (selectedNode) {
      const updated = nodes.find(n => n.id === selectedNode.id);
      if (updated) setSelectedNode(updated);
      else {
        setSelectedNode(null);
        setEditMode(false);
      }
    }
  }, [nodes, selectedNode]);

  // --- Handlers ---

  const handleWizardFinish = (
    nodeData: Omit<FlowchartNode, 'id'>,
    connection?: { from: string; label: string }
  ) => {
    const newNode: FlowchartNode = { ...nodeData, id: generateId() };
    setNodes(prev => [...prev, newNode]);
    if (connection) {
      setConnections(prev => [...prev, { from: connection.from, to: newNode.id, label: connection.label }]);
    }
    setShowWizard(false);
  };

  const handleSelectNode = (node: FlowchartNode) => {
    setSelectedNode(node);
    setEditMode(true);
    setShowWizard(false);
  };

  const handleUpdateNode = (updates: Partial<FlowchartNode>) => {
    if (!selectedNode) return;
    setNodes(prev => prev.map(n => (n.id === selectedNode.id ? { ...n, ...updates } : n)));
  };

  const handleDeleteNode = () => {
    if (!selectedNode) return;
    setNodes(prev => prev.filter(n => n.id !== selectedNode.id));
    setConnections(prev => prev.filter(c => c.from !== selectedNode.id && c.to !== selectedNode.id));
    setSelectedNode(null);
    setEditMode(false);
  };

  const handleStartConnection = () => {
    if (selectedNode) {
      setConnectionMode({ active: true, fromNode: selectedNode.id });
    }
  };

  const handleConnectTo = (toNodeId: string) => {
    if (!connectionMode.fromNode || toNodeId === connectionMode.fromNode) return;
    const exists = connections.some(
      c => c.from === connectionMode.fromNode && c.to === toNodeId
    );
    if (!exists) {
      const label = prompt('Connection label (leave empty for none):') || '';
      setConnections(prev => [...prev, { from: connectionMode.fromNode!, to: toNodeId, label }]);
    }
    setConnectionMode({ active: false, fromNode: null });
  };

  const handleDeleteConnection = (from: string, to: string) => {
    setConnections(prev => prev.filter(c => !(c.from === from && c.to === to)));
  };

  const handleImport = (importedNodes: FlowchartNode[], importedConnections: Connection[]) => {
    setNodes(importedNodes);
    setConnections(importedConnections);
    setShowImportModal(false);
  };

  const handleSave = () => {
    const chart: SavedChart = {
      name: currentChartName,
      nodes,
      connections,
      actors,
      savedAt: new Date().toISOString(),
    };
    const updated = saveChartToStorage(chart, savedCharts);
    setSavedCharts(updated);
    setShowSaveModal(false);
  };

  const handleLoad = (chart: SavedChart) => {
    setNodes(chart.nodes);
    setConnections(chart.connections);
    setActors(chart.actors || ['Default']);
    setCurrentChartName(chart.name);
    setShowLoadModal(false);
    setSelectedNode(null);
    setEditMode(false);
  };

  const handleDeleteChart = (name: string) => {
    const updated = deleteChartFromStorage(name, savedCharts);
    setSavedCharts(updated);
  };

  const handleExportMermaid = () => {
    if (!mermaidCode) return;
    const blob = new Blob([mermaidCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentChartName.replace(/\s+/g, '_')}.mermaid`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    if (!mermaidCode) return;
    navigator.clipboard.writeText(mermaidCode);
  };

  const handleExportPng = () => {
    if (previewRef.current) exportPng(previewRef.current);
  };

  const handleExportPdf = () => {
    if (previewRef.current) exportPdf(previewRef.current);
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to clear the entire flowchart?')) {
      setNodes([]);
      setConnections([]);
      setSelectedNode(null);
      setEditMode(false);
      setShowWizard(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100 font-sans">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Flowchart Builder
          </h1>
          <input
            type="text"
            value={currentChartName}
            onChange={(e) => setCurrentChartName(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm transition"
          >
            <Upload size={16} /> Import
          </button>
          <button
            onClick={handleExportMermaid}
            disabled={!mermaidCode}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm transition disabled:opacity-50"
          >
            <FileText size={16} /> Mermaid
          </button>
          <button
            onClick={handleExportPng}
            disabled={!mermaidSvg}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm transition disabled:opacity-50"
          >
            <ImageIcon size={16} /> PNG
          </button>
          <button
            onClick={handleExportPdf}
            disabled={!mermaidSvg}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm transition disabled:opacity-50"
          >
            <FileDown size={16} /> PDF
          </button>
          <button
            onClick={handleCopyCode}
            disabled={!mermaidCode}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm transition disabled:opacity-50"
          >
            <Copy size={16} /> Copy Code
          </button>
          <div className="w-px h-6 bg-slate-600 mx-2" />
          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 rounded text-sm transition"
          >
            <Save size={16} /> Save
          </button>
          <button
            onClick={() => setShowLoadModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm transition"
          >
            <FolderOpen size={16} /> Load
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <aside className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-700 space-y-2">
            <button
              onClick={() => { setShowWizard(true); setEditMode(false); setSelectedNode(null); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium transition"
            >
              <Plus size={20} /> Add Node
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setShowActorModal(true)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm transition"
              >
                <Users size={16} /> Actors
              </button>
              <button
                onClick={clearAll}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-red-900/50 hover:bg-red-800 rounded text-sm transition"
              >
                <Trash2 size={16} /> Clear All
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-sm font-semibold text-slate-400 mb-3">
              Nodes ({nodes.length})
            </h3>
            <NodeList
              nodes={nodes}
              connections={connections}
              selectedNodeId={selectedNode?.id ?? null}
              connectionMode={connectionMode}
              onSelectNode={handleSelectNode}
              onConnectTo={handleConnectTo}
            />
          </div>

          {editMode && selectedNode && (
            <NodeEditor
              node={selectedNode}
              actors={actors}
              connections={connections}
              nodes={nodes}
              onUpdate={handleUpdateNode}
              onDelete={handleDeleteNode}
              onStartConnection={handleStartConnection}
              onDeleteConnection={handleDeleteConnection}
            />
          )}

          {connectionMode.active && (
            <div className="border-t border-green-500 p-3 bg-green-500/10">
              <p className="text-sm text-green-400 text-center">
                Click a node to connect to it, or{' '}
                <button
                  onClick={() => setConnectionMode({ active: false, fromNode: null })}
                  className="underline"
                >
                  cancel
                </button>
              </p>
            </div>
          )}
        </aside>

        {/* Right Panel */}
        <main className="flex-1 flex flex-col bg-slate-900 overflow-hidden relative">
          {showWizard && (
            <NodeWizard
              nodes={nodes}
              actors={actors}
              onFinish={handleWizardFinish}
              onCancel={() => setShowWizard(false)}
            />
          )}

          <div className="flex-1 overflow-auto p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-300">Preview</h2>
              <button
                onClick={renderMermaid}
                className="flex items-center gap-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm transition"
              >
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

            <div
              ref={previewRef}
              className="bg-white rounded-xl p-8 min-h-96 flex items-center justify-center"
              dangerouslySetInnerHTML={{
                __html: mermaidSvg || '<p style="color: #94a3b8;">Your flowchart will appear here</p>',
              }}
            />
          </div>

          <div className="border-t border-slate-700 bg-slate-800">
            <details className="group">
              <summary className="px-4 py-2 cursor-pointer text-sm text-slate-400 hover:text-slate-300 flex items-center gap-2">
                <ChevronRight size={16} className="group-open:rotate-90 transition-transform" />
                View Mermaid Code
              </summary>
              <pre className="px-4 pb-4 text-xs text-slate-300 overflow-x-auto max-h-40 overflow-y-auto bg-slate-900/50 mx-4 mb-4 p-3 rounded-lg">
                {mermaidCode || 'No code generated yet'}
              </pre>
            </details>
          </div>
        </main>
      </div>

      {/* Modals */}
      {showImportModal && (
        <ImportModal onImport={handleImport} onClose={() => setShowImportModal(false)} />
      )}
      {showSaveModal && (
        <SaveModal
          chartName={currentChartName}
          onChangeName={setCurrentChartName}
          onSave={handleSave}
          onClose={() => setShowSaveModal(false)}
        />
      )}
      {showLoadModal && (
        <LoadModal
          charts={savedCharts}
          onLoad={handleLoad}
          onDelete={handleDeleteChart}
          onClose={() => setShowLoadModal(false)}
        />
      )}
      {showActorModal && (
        <ActorModal
          actors={actors}
          onAddActor={(name) => setActors(prev => [...prev, name])}
          onRemoveActor={(name) => setActors(prev => prev.filter(a => a !== name))}
          onClose={() => setShowActorModal(false)}
        />
      )}
    </div>
  );
}
