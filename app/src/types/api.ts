import { RunStatus } from "./data";
// src/types/api.ts
export interface RunsResponse {
  // APIレスポンスの型を定義
  // 例: 実際のレスポンス構造に合わせて修正してください
  id: number;
  name: string;
  data: any; // 具体的な型に置き換えることを推奨
}

export interface UserResponse {
    id: number;
    email: string;
}

export interface RunResponse {
  id: number;
  project_id: number;
  protocol_id: number;
  user_id: number;
  added_at: string;
  started_at: string | null;
  finished_at: string | null;
  status: RunStatus;
  storage_address: string;
  storage_mode?: 's3' | 'local' | null;  // ★追加: Run作成時のストレージモード
}