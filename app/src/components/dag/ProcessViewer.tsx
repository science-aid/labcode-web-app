import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  NodeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import ProcessNode from './ProcessNode'; // ★新規カスタムノード
import { ProcessDetails } from './ProcessDetails'; // ★新規詳細パネル
import { PortDetails } from './PortDetails'; // ★ポート詳細パネル
import { ProcessNode as ProcessNodeType } from '../../types/process'; // ★新規型定義
import { calculateVerticalLayout } from '../../utils/dagLayout'; // 既存関数を流用

interface ProcessViewerProps {
  nodes: ProcessNodeType[];
  edges: Edge[];
  onViewOperations?: (processId: number) => void;
}

// カスタムノードの登録
const nodeTypes = {
  process: ProcessNode, // ★プロセス用カスタムノード
};

export const ProcessViewer: React.FC<ProcessViewerProps> = ({ nodes, edges, onViewOperations }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null); // ★エッジ選択状態

  // ProcessNodeType[] → ReactFlowのNode[] に変換
  const reactFlowNodes = useMemo(() => {
    return nodes.map((node) => ({
      id: node.id,
      type: 'process', // ★カスタムノードタイプ指定
      position: { x: 0, y: 0 },
      data: {
        label: node.name,
        type: node.type, // ★プロセスタイプ
        status: node.status,
        ports: node.ports, // ★ポート情報
        selected: node.id === selectedNodeId,
      },
    }));
  }, [nodes, selectedNodeId]);

  // レイアウト計算後のノード
  const layoutedNodes: Node[] = useMemo(() => {
    const positionedNodes = calculateVerticalLayout(reactFlowNodes, edges);
    return positionedNodes.map((posNode) => ({
      ...posNode,
      data: {
        ...reactFlowNodes.find((n) => n.id === posNode.id)?.data,
      },
    }));
  }, [reactFlowNodes, edges]);

  // ノードクリック時の選択制御
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
      setSelectedEdge(null); // ★エッジ選択を解除
    },
    []
  );

  // エッジクリック時の選択制御
  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      setSelectedEdge(edge);
      setSelectedNodeId(null); // ★ノード選択を解除
    },
    []
  );

  const onNodesChange = useCallback((_: NodeChange[]) => {}, []);

  // 選択ノードの情報
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  return (
    <div className="flex h-[calc(100vh-12rem)]">
      <div className="flex-1 border-r border-gray-200">
        <ReactFlow
          nodes={layoutedNodes}
          edges={edges}
          nodeTypes={nodeTypes} // ★カスタムノード登録
          onNodesChange={onNodesChange}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick} // ★エッジクリックハンドラー
          fitView // ★自動フィット
          className="bg-gray-50"
          defaultEdgeOptions={{
            type: 'smoothstep', // ★曲線エッジ
            animated: true, // ★アニメーション
            style: { stroke: '#94a3b8', strokeWidth: 2 },
          }}
          nodesDraggable={false} // ★ドラッグ無効（レイアウト崩れ防止）
        >
          <Background /> {/* ★背景グリッド */}
          <Controls /> {/* ★ズーム/パンコントロール */}
        </ReactFlow>
      </div>
      <div className="w-96 bg-white overflow-y-auto">
        {/* ★条件分岐: エッジ選択時はPortDetails、ノード選択時はProcessDetails */}
        {selectedEdge ? (
          <PortDetails edge={selectedEdge} processes={nodes} />
        ) : (
          <ProcessDetails process={selectedNode} onViewOperations={onViewOperations} />
        )}
      </div>
    </div>
  );
};
