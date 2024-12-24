import React, { useState, useCallback, useLayoutEffect, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  NodeChange,
  applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import { NodeDetails } from './NodeDetails';
import { DAGNode } from '../../types/dag';
import { calculateVerticalLayout } from '../../utils/dagLayout';

interface DAGViewerProps {
  nodes: DAGNode[];
  edges: Edge[];
}

const nodeTypes = {
  custom: CustomNode,
};

export const DAGViewer: React.FC<DAGViewerProps> = ({ nodes: initialNodes, edges }) => {
  const [nodes, setNodes] = useState<Node[]>(
    initialNodes.map((node) => ({
      id: node.id,
      type: 'custom',
      position: { x: 0, y: 0 },
      data: {
        label: node.label,
        status: node.status,
        isTransport: node.isTransport,
        selected: false, // 初期選択状態をfalseに
      },
    }))
  );

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialNodes[0]?.id || null);

  // ノードの選択状態を更新
  useEffect(() => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          selected: node.id === selectedNodeId,
        },
      }))
    );
  }, [selectedNodeId]);

  // 初期レイアウト適用
  useLayoutEffect(() => {
    const layoutedNodes = calculateVerticalLayout(nodes, edges).map((node) => ({
      ...node,
      data: nodes.find((n) => n.id === node.id)?.data || {}, // 元のdataを維持
    }));
    setNodes(layoutedNodes);
  }, [edges]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id); // 選択されているノードのIDのみを更新
    },
    []
  );

  const selectedNode = initialNodes.find((n) => n.id === selectedNodeId) || null;

  return (
    <div className="flex h-[calc(100vh-12rem)]">
      <div className="flex-1 border-r border-gray-200">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#94a3b8', strokeWidth: 2 },
          }}
          nodesDraggable={false}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <div className="w-96 bg-white overflow-y-auto">
        <NodeDetails node={selectedNode} />
      </div>
    </div>
  );
};
