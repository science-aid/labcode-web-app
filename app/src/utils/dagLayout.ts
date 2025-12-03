import dagre from 'dagre';

interface Position {
  x: number;
  y: number;
}

interface Node {
  id: string;
  position: Position;
}

export const calculateVerticalLayout = (nodes: Node[], edges: { source: string; target: string }[]) => {
  // エッジが0件の場合、単純な垂直レイアウトを返す（防御的対策）
  if (edges.length === 0) {
    return nodes.map((node, index) => ({
      ...node,
      position: {
        x: 100,  // 固定X座標
        y: index * 150  // 垂直に等間隔で配置
      }
    }));
  }

  // Create a new dagre graph
  const g = new dagre.graphlib.Graph();

  // Set graph options
  g.setGraph({
    rankdir: 'TB',     // Top to Bottom layout
    nodesep: 80,       // 同じランク内のノード間の水平間隔
    ranksep: 100,      // ランク間の垂直間隔
    marginx: 40,       // グラフ全体の水平マージン
    marginy: 40,       // グラフ全体の垂直マージン
  });

  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(() => ({}));

  // Add nodes to the graph. The first argument is the node id. The second is
  // metadata about the node. In this case we're going to add labels to each of
  // our nodes.
  nodes.forEach((node) => {
    g.setNode(node.id, {
      width: 180,  // ノードの幅
      height: 100   // ノードの高さ
    });
  });

  // Add edges to the graph
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  // Compute the layout
  dagre.layout(g);

  // Get the positioned nodes
  return nodes.map(node => {
    const nodeWithPosition = g.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWithPosition.width / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2
      }
    };
  });
};