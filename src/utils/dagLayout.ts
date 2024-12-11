interface Position {
  x: number;
  y: number;
}

interface Node {
  id: string;
  position: Position;
}

export const calculateVerticalLayout = (nodes: Node[], edges: { source: string; target: string }[]) => {
  // Create a map of node levels (depth from root)
  const levels = new Map<string, number>();
  const processed = new Set<string>();

  // Find root nodes (nodes with no incoming edges)
  const incomingEdges = new Map<string, number>();
  edges.forEach(edge => {
    incomingEdges.set(edge.target, (incomingEdges.get(edge.target) || 0) + 1);
  });

  const rootNodes = nodes.filter(node => !incomingEdges.has(node.id));

  // Calculate levels using BFS
  const queue = rootNodes.map(node => ({ id: node.id, level: 0 }));
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (processed.has(current.id)) continue;

    levels.set(current.id, current.level);
    processed.add(current.id);

    // Find children
    const children = edges
      .filter(edge => edge.source === current.id)
      .map(edge => edge.target);

    children.forEach(childId => {
      if (!processed.has(childId)) {
        queue.push({ id: childId, level: current.level + 1 });
      }
    });
  }

  // Calculate x positions for each level
  const nodesPerLevel = new Map<number, number>();
  levels.forEach((level) => {
    nodesPerLevel.set(level, (nodesPerLevel.get(level) || 0) + 1);
  });

  const VERTICAL_SPACING = 200;
  const HORIZONTAL_SPACING = 250;

  return nodes.map(node => {
    const level = levels.get(node.id) || 0;
    const nodesInLevel = nodesPerLevel.get(level) || 1;
    const nodeIndex = Array.from(levels.entries())
      .filter(([, l]) => l === level)
      .findIndex(([id]) => id === node.id);

    // Center nodes horizontally within their level
    const x = (nodeIndex - (nodesInLevel - 1) / 2) * HORIZONTAL_SPACING;
    const y = level * VERTICAL_SPACING;

    return {
      ...node,
      position: { x, y }
    };
  });
};