import { PlayCircle, StopCircle, Square, Diamond } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NodeType {
  label: string;
  icon: LucideIcon;
  shape: string;
  closeShape: string;
  color: string;
}

export interface FlowchartNode {
  id: string;
  type: string;
  text: string;
  color: string;
  actor: string;
}

export interface Connection {
  from: string;
  to: string;
  label: string;
}

export interface SavedChart {
  name: string;
  nodes: FlowchartNode[];
  connections: Connection[];
  actors: string[];
  savedAt: string;
}

export const NODE_TYPES: Record<string, NodeType> = {
  start: { label: 'Start', icon: PlayCircle, shape: '([', closeShape: '])', color: '#10b981' },
  end: { label: 'End', icon: StopCircle, shape: '([', closeShape: '])', color: '#ef4444' },
  process: { label: 'Process', icon: Square, shape: '[', closeShape: ']', color: '#3b82f6' },
  decision: { label: 'Decision', icon: Diamond, shape: '{', closeShape: '}', color: '#f59e0b' },
};

export const PRESET_COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
];

export const generateId = (): string =>
  `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
