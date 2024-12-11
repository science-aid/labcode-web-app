export type NodeStatus = '完了' | '進行中' | '未開始' | 'エラー';

export interface DAGNode {
  id: string;
  label: string;
  status: NodeStatus;
  details: {
    description: string;
    startTime?: string;
    endTime?: string;
    parameters?: Record<string, string>;
    output?: string;
  };
}

export interface DAGEdge {
  id: string;
  source: string;
  target: string;
}