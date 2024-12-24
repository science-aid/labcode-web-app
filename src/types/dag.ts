export type NodeStatus = '完了' | '進行中' | '未開始' | 'エラー';

export interface DAGNode {
  id: string; // データベースで管理されるoperation.id。db内でユニーク
  status: NodeStatus;
  label: string;
  startTime?: string;
  endTime?: string;
  input?: string;
  output?: string;
  storage_address?: string;
  processId: string;
  isTransport: boolean;
}

export interface DAGEdge {
  id: string;
  source: string;
  target: string;
}