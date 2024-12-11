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
      },
    }))
  );
  const [selectedNode, setSelectedNode] = useState<DAGNode | null>(null);

  // Update nodes and selected node when initialNodes change
  useEffect(() => {
    setNodes(prevNodes => 
      prevNodes.map(node => {
        const updatedNode = initialNodes.find(n => n.id === node.id);
        if (updatedNode) {
          return {
            ...node,
            data: {
              ...node.data,
              label: updatedNode.label,
              status: updatedNode.status,
            },
          };
        }
        return node;
      })
    );

    // Update selected node if it exists in initialNodes
    if (selectedNode) {
      const updatedSelectedNode = initialNodes.find(n => n.id === selectedNode.id);
      if (updatedSelectedNode && JSON.stringify(updatedSelectedNode) !== JSON.stringify(selectedNode)) {
        setSelectedNode(updatedSelectedNode);
      }
    }
  }, [initialNodes, selectedNode]);

  // Apply vertical layout
  useLayoutEffect(() => {
    const layoutedNodes = calculateVerticalLayout(nodes, edges);
    setNodes(layoutedNodes);
  }, [edges]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const dagNode = initialNodes.find((n) => n.id === node.id);
      setSelectedNode(dagNode || null);
    },
    [initialNodes]
  );

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