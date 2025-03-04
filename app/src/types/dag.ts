// export type NodeStatus = '完了' | '進行中' | '未開始' | 'エラー';
export type NodeStatus = 'completed' | 'running' | 'not started' | 'error';

export interface DAGNode {
  id: string; // データベースで管理されるoperation.id。db内でユニーク
  status: NodeStatus;
  name: string;
  started_at?: string;
  finished_at?: string;
  input?: string;
  output?: string;
  storage_address?: string;
  // processId: string;
  process_id: number;
  parent_id: string | null;
  is_transport: boolean;
}

export interface DAGEdge {
  id: string;
  source: string;
  target: string;
}

export interface EdgeResponse {
  id: number;
  run_id: number;
  from_id: number;
  to_id: number;
}


// export interface Node {
//   id: string;
//   process_id: string;
//   parent_id: string | null;
//   started_at: string | null;
//   finished_at: string | null;
//   status: string;
//   storage_address: string;
//   process_storage_address: string;
// }

// export interface Edge {
//   id: string;
//   source: string;
//   target: string;
// }


// export interface Dag {
//   nodes: Node[];
//   edges: Edge[];
// }
export interface Dag {
  nodes: DAGNode[];
  edges: DAGEdge[];
}