/**
 * ストレージ関連の型定義
 */

/** ファイルアイテム */
export interface FileItem {
  name: string;
  type: 'file';
  path: string;
  size: number | null;
  last_modified: string | null;
  extension: string | null;
}

/** ディレクトリアイテム */
export interface DirectoryItem {
  name: string;
  type: 'directory';
  path: string;
}

/** ページネーション情報 */
export interface PaginationInfo {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

/** ファイル一覧レスポンス */
export interface StorageListResponse {
  files: FileItem[];
  directories: DirectoryItem[];
  pagination: PaginationInfo;
}

/** プレビューレスポンス */
export interface StoragePreviewResponse {
  content: string;
  content_type: 'text' | 'json' | 'yaml' | 'binary';
  size: number;
  last_modified: string;
  truncated: boolean;
}

/** ダウンロードURLレスポンス */
export interface StorageDownloadResponse {
  download_url: string;
  expires_at: string;
}

/** ソート対象 */
export type SortBy = 'name' | 'size' | 'last_modified';

/** ソート順 */
export type SortOrder = 'asc' | 'desc';

// ========================================
// HAL (Hybrid Access Layer) v2 API用の型定義
// ========================================

/** v2 APIのコンテンツアイテム */
export interface ContentItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: number;
  lastModified: string | null;
  contentType: string;
  source: 'file' | 'db' | 'virtual';
  backend?: 's3' | 'local';  // どのバックエンドからのデータか
}

/** v2 APIのコンテンツ一覧レスポンス */
export interface ListContentsResponse {
  run_id: number;
  prefix: string;
  items: ContentItem[];
}

/** v2 APIのコンテンツ取得レスポンス */
export interface ContentResponse {
  content: string;
  encoding: 'utf-8' | 'base64';
}

/** v2 APIのダウンロードURLレスポンス */
export interface DownloadUrlResponse {
  url: string;
  run_id: number;
  path: string;
}

/** v2 APIのストレージ情報 */
export interface StorageInfoV2 {
  mode: 's3' | 'local' | 'unknown';
  storage_address: string;
  full_path: string;
  data_sources: {
    logs: string;
    yaml: string;
    data: string;
  };
  warning?: string;  // storage_mode未設定時の警告メッセージ
  inferred?: boolean;  // モードが推論されたかどうか
  isHybrid?: boolean;  // ハイブリッドモードかどうか
  s3Path?: string;     // S3パス（ハイブリッド時）
  localPath?: string;  // ローカルパス（ハイブリッド時）
}
