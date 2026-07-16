'use client';

import React from 'react';
import { NODE_TYPES, FlowchartNode, Connection } from '@/lib/flowchartTypes';

interface NodeListProps {
  nodes: FlowchartNode[];
  connections: Connection[];
  selectedNodeId: string | null;
  connectionMode: { active: boolean; fromNode: string | null };
  onSelectNode: (node: FlowchartNode) => void;
  onConnectTo: (nodeId: string) => void;
}

export default function NodeList({
  nodes,
  connections,
  selectedNodeId,
  connectionMode,
  onSelectNode,
  onConnectTo,
}: NodeListProps) {
  if (nodes.length === 0) {
    return (
      <p className="text-slate-500 text-sm text-center py-8">
        No nodes yet. Click &quot;Add Flowchart Node&quot; to start building your flowchart.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {nodes.map(node => {
        const nodeType = NODE_TYPES[node.type];
        if (!nodeType) return null;
        const NodeIcon = nodeType.icon;
        const isSelected = selectedNodeId === node.id;
        const nodeConnections = connections.filter(
          c => c.from === node.id || c.to === node.id
        );
        const isConnectionTarget =
          connectionMode.active && connectionMode.fromNode !== node.id;

        return (
          <div
            key={node.id}
            className={`flow-node p-3 rounded-lg border cursor-pointer transition ${
              isSelected
                ? 'flow-node-selected'
                : isConnectionTarget
                  ? 'border-green-500 bg-green-500/10 hover:bg-green-500/20'
                  : 'border-slate-600 bg-slate-700/50 hover:bg-slate-700'
            }`}
            onClick={() => {
              if (isConnectionTarget) {
                onConnectTo(node.id);
              } else {
                onSelectNode(node);
              }
            }}
          >
            <div className="flex items-start gap-2">
              <div
                className="flow-node-icon p-1.5 rounded"
                style={{ backgroundColor: node.color + '30' }}
              >
                <NodeIcon size={16} style={{ color: node.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="flow-node-type text-xs font-medium text-slate-400">
                    {nodeType.label}
                  </span>
                  {node.actor !== 'Default' && (
                    <span className="flow-node-actor text-xs px-1.5 py-0.5 bg-slate-600 rounded-full">
                      {node.actor}
                    </span>
                  )}
                </div>
                <p className="flow-node-text text-sm mt-1 truncate">{node.text}</p>
                {nodeConnections.length > 0 && (
                  <p className="flow-node-connections text-xs text-slate-500 mt-1">
                    {nodeConnections.length} connection
                    {nodeConnections.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
