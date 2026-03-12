import { FlowchartNode, Connection, NODE_TYPES } from './flowchartTypes';

interface ParseResult {
  nodes: FlowchartNode[];
  connections: Connection[];
}

export function parseMermaidCode(code: string): ParseResult {
  const lines = code.split('\n').filter(l => l.trim());
  const nodes: FlowchartNode[] = [];
  const connections: Connection[] = [];
  const nodeMap: Record<string, FlowchartNode> = {};

  lines.forEach(line => {
    const trimmed = line.trim();

    // Skip flowchart declaration, subgraph lines, end, style
    if (
      trimmed.startsWith('flowchart') ||
      trimmed.startsWith('subgraph') ||
      trimmed === 'end' ||
      trimmed.startsWith('style')
    ) {
      return;
    }

    // Parse node definitions: id[text], id{text}, id([text])
    const nodeMatch = trimmed.match(/^(\w+)([\[\(\{])["']?(.+?)["']?([\]\)\}])$/);
    if (nodeMatch) {
      const [, id, openShape, text, closeShape] = nodeMatch;
      let type = 'process';
      if (openShape === '(' && closeShape === ')') type = 'start';
      else if (openShape === '{' && closeShape === '}') type = 'decision';

      if (!nodeMap[id]) {
        const node: FlowchartNode = {
          id,
          type,
          text: text.replace(/<br\/?>/gi, '\n'),
          color: NODE_TYPES[type].color,
          actor: 'Default',
        };
        nodes.push(node);
        nodeMap[id] = node;
      }
    }

    // Parse connections: A --> B or A -->|label| B
    const connMatch = trimmed.match(/^(\w+)\s*-->\s*(?:\|["']?(.+?)["']?\|)?\s*(\w+)$/);
    if (connMatch) {
      const [, from, label, to] = connMatch;

      if (!nodeMap[from]) {
        const node: FlowchartNode = {
          id: from,
          type: 'process',
          text: from,
          color: NODE_TYPES.process.color,
          actor: 'Default',
        };
        nodes.push(node);
        nodeMap[from] = node;
      }
      if (!nodeMap[to]) {
        const node: FlowchartNode = {
          id: to,
          type: 'process',
          text: to,
          color: NODE_TYPES.process.color,
          actor: 'Default',
        };
        nodes.push(node);
        nodeMap[to] = node;
      }

      connections.push({ from, to, label: label || '' });
    }
  });

  return { nodes, connections };
}
