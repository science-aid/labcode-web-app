import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  NodeChange,
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

// カスタムノードの登録
const nodeTypes = {
  custom: CustomNode,
};

export const DAGViewer: React.FC<DAGViewerProps> = ({ nodes, edges }) => {
  // ノードの選択ID（レイアウト後のノードとは別で管理）
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    // nodes[0]?.id || null
    null
  );

  useEffect(() => {
      if (nodes.length > 0 && selectedNodeId === null) {
        setSelectedNodeId(nodes[0].id);
      }
    }, [nodes, selectedNodeId]);

  // DAGNode[] → ReactFlowのNode[] に変換（positionは一旦0,0に）
  const reactFlowNodes = useMemo(() => {
    return nodes.map((node) => ({
      id: node.id,
      type: 'custom',
      position: { x: 0, y: 0 }, // layout適用前の仮の位置
      data: {
        label: node.name,
        // label: "TODO: ラベルを記載する",
        status: node.status,
        isTransport: node.isTransport,
        // 選択状態を反映
        selected: node.id === selectedNodeId,
      },
    }));
  }, [nodes, selectedNodeId]);

  // レイアウト計算後のノード
  const layoutedNodes: Node[] = useMemo(() => {
    // calculateVerticalLayoutを用いて座標計算
    const positionedNodes = calculateVerticalLayout(reactFlowNodes, edges);

    // レイアウト計算後にもともとのdataを合体
    return positionedNodes.map((posNode) => ({
      ...posNode,
      data: {
        // ...posNode.data,
        ...reactFlowNodes.find((n) => n.id === posNode.id)?.data,
      },
    }));
  }, [reactFlowNodes, edges]);

  // ノード上クリック時の選択制御
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    []
  );

  // ノード変化（ドラッグなど）が起きても、今回は特にステート管理しない
  const onNodesChange = useCallback((_: NodeChange[]) => {
    // ドラッグ不可等にしたい場合は無視できる
  }, []);

  // 選択ノードの情報（親コンポーネントから受け取ったオリジナルの nodes の中を参照）
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  return (
    <div className="flex h-[calc(100vh-12rem)]">
      <div className="flex-1 border-r border-gray-200">
        <ReactFlow
          nodes={layoutedNodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onNodeClick={onNodeClick}
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
