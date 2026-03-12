import { FlowchartNode, Connection, NODE_TYPES } from './flowchartTypes';

export function generateMermaidCode(nodes: FlowchartNode[], connections: Connection[]): string {
  if (nodes.length === 0) return '';

  let code = 'flowchart TD\n';

  const uniqueActors = Array.from(new Set(nodes.map(n => n.actor || 'Default')));
  const useSubgraphs = uniqueActors.length > 1 && uniqueActors.some(a => a !== 'Default');

  if (useSubgraphs) {
    uniqueActors.forEach(actor => {
      const actorNodes = nodes.filter(n => (n.actor || 'Default') === actor);
      if (actorNodes.length > 0) {
        code += `    subgraph ${actor.replace(/\s+/g, '_')}["${actor}"]\n`;
        actorNodes.forEach(node => {
          const nodeType = NODE_TYPES[node.type];
          const text = node.text.replace(/"/g, "'").replace(/\n/g, '<br/>');
          code += `        ${node.id}${nodeType.shape}"${text}"${nodeType.closeShape}\n`;
        });
        code += `    end\n`;
      }
    });
  } else {
    nodes.forEach(node => {
      const nodeType = NODE_TYPES[node.type];
      const text = node.text.replace(/"/g, "'").replace(/\n/g, '<br/>');
      code += `    ${node.id}${nodeType.shape}"${text}"${nodeType.closeShape}\n`;
    });
  }

  connections.forEach(conn => {
    if (conn.label) {
      code += `    ${conn.from} -->|"${conn.label}"| ${conn.to}\n`;
    } else {
      code += `    ${conn.from} --> ${conn.to}\n`;
    }
  });

  nodes.forEach(node => {
    if (node.color && node.color !== NODE_TYPES[node.type]?.color) {
      code += `    style ${node.id} fill:${node.color},stroke:#333,stroke-width:2px\n`;
    }
  });

  return code;
}
