// プロセスノード型
export interface ProcessNode {
  id: string;
  run_id: number;
  name: string;
  type: string;
  status: ProcessStatus;
  ports?: {
    input?: Port[];
    output?: Port[];
  };
  created_at: string;
  updated_at: string;
  started_at?: string;
  finished_at?: string;
}

// Process型のエイリアス（後方互換性のため）
export type Process = ProcessNode;

// ポート型
export interface Port {
  id: string;
  name: string;
  data_type: string; // データ型、オブジェクト型、プロセス型
  connected_to?: string; // 接続先ポートID（出力ポート用）
  connected_from?: string; // 接続元ポートID（入力ポート用）
}

// プロセスステータス型
export type ProcessStatus = 'pending' | 'running' | 'completed' | 'failed';

// プロセスDAG型
export interface ProcessDag {
  nodes: ProcessNode[];
  edges: ProcessEdge[];
}

// プロセスエッジ型
export interface ProcessEdge {
  id: string;
  source: string; // プロセスID
  target: string; // プロセスID
  sourcePort?: string; // ポートID
  targetPort?: string; // ポートID
  label?: string;
  data_type?: string; // データ型情報
}
