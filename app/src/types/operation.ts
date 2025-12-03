// operation.ts

/**
 * オペレーションのステータス型
 * 既存のRunStatusと同じ値を使用
 */
export type OperationStatus = 'not started' | 'running' | 'completed' | 'error';

/**
 * オペレーション一覧テーブルで使用するデータ項目
 */
export interface OperationDataItem {
  id: string;                    // Operation ID(文字列、React要件)
  process_id: number;            // Process ID
  run_id: number;                // Run ID
  name: string;                  // Operation Name
  status: OperationStatus;       // Status
  started_at: string | null;     // Start datetime (ISO 8601)
  finished_at: string | null;    // Finish datetime (ISO 8601)
  storage_address: string;       // Storage address
  is_transport: boolean;         // Is Transport flag
  is_data: boolean;              // Is Data flag
  parent_id?: string | null;     // Parent ID(オプション)
  log?: string | null;           // Log(オプション)
}

/**
 * バックエンドAPIからのオペレーションレスポンス型
 */
export interface OperationResponse {
  id: number;
  process_id: number;
  name: string;
  parent_id: number | null;
  started_at: string | null;
  finished_at: string | null;
  status: OperationStatus;
  storage_address: string;
  is_transport: boolean;
  is_data: boolean;
  log?: string | null;
}

/**
 * 拡張されたオペレーションレスポンス型(Run ID含む)
 * バックエンドのJOINクエリで取得される形式
 */
export interface OperationWithRunResponse extends OperationResponse {
  run_id: number;
}

/**
 * フィルタ条件の型
 * 全てのフィールドをstring型で統一(入力フォームの値)
 */
export interface OperationFilters {
  id?: string;
  name?: string;
  status?: string;
  process_id?: string;
  run_id?: string;
  started_at?: string;
  finished_at?: string;
  storage_address?: string;
  is_transport?: string;
  is_data?: string;
}
