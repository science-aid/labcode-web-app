// export type RunStatus = '完了' | '進行中' | 'not started' | 'キャンセル';
export type RunStatus = 'completed' | 'running' | 'not started' | 'error';

export interface DataItem {
  id: string;
  project_id: number;
  project_name: string;
  file_name: string;
  user_id: number;
  added_at: string;      // ISO 8601形式の日時文字列
  started_at: string | null;
  finished_at: string | null;
  status: RunStatus;
  storage_address: string;
}

export interface User {
  name: string;
  email: string;
  picture: string;
}