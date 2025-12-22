/**
 * Run固有のストレージサービス
 *
 * HAL (Hybrid Access Layer) v2 APIを使用して
 * 各Runのstorage_modeに基づいて適切なストレージにアクセス
 */

import {
  ContentItem,
  ListContentsResponse,
  ContentResponse,
  DownloadUrlResponse,
  StorageInfoV2,
} from '../types/storage';

// Viteプロキシ経由でlog_serverにアクセス
// vite.config.tsで /log_server_api -> http://log_server:8000/api に書き換え
const API_BASE = '/log_server_api/v2/storage';

/**
 * Run内のコンテンツ一覧を取得
 *
 * モードに関係なく統一的なインターフェースで取得可能
 */
export async function listContents(
  runId: number,
  prefix: string = ''
): Promise<ListContentsResponse> {
  const response = await fetch(
    `${API_BASE}/list/${runId}?prefix=${encodeURIComponent(prefix)}`
  );
  if (!response.ok) {
    throw new Error(`Failed to list contents: ${response.statusText}`);
  }
  return response.json();
}

/**
 * コンテンツを取得（プレビュー用）
 */
export async function loadContent(
  runId: number,
  path: string
): Promise<string> {
  const response = await fetch(
    `${API_BASE}/content/${runId}?path=${encodeURIComponent(path)}`
  );
  if (!response.ok) {
    throw new Error(`Failed to load content: ${response.statusText}`);
  }
  const data: ContentResponse = await response.json();
  if (data.encoding === 'base64') {
    // バイナリデータの場合はBase64デコード
    return atob(data.content);
  }
  return data.content;
}

/**
 * ダウンロードURLを取得
 *
 * S3モードの場合は事前署名URLを返す
 * ローカルモードの場合はプロキシ経由のURLに変換
 */
export async function getDownloadUrl(
  runId: number,
  path: string
): Promise<string> {
  const response = await fetch(
    `${API_BASE}/download/${runId}?path=${encodeURIComponent(path)}`
  );
  if (!response.ok) {
    throw new Error(`Failed to get download URL: ${response.statusText}`);
  }
  const data: DownloadUrlResponse = await response.json();

  // S3の事前署名URLはそのまま返す（https://で始まる場合）
  if (data.url.startsWith('https://') || data.url.startsWith('http://')) {
    return data.url;
  }

  // ローカルモードのURLはプロキシ経由に変換
  // /api/v2/... -> /log_server_api/v2/...
  if (data.url.startsWith('/api/')) {
    return data.url.replace('/api/', '/log_server_api/');
  }

  return data.url;
}

/**
 * Runのストレージ情報を取得
 */
export async function getStorageInfoV2(
  runId: number
): Promise<StorageInfoV2> {
  const response = await fetch(`${API_BASE}/info/${runId}`);
  if (!response.ok) {
    throw new Error(`Failed to get storage info: ${response.statusText}`);
  }
  return response.json();
}

/**
 * データソースに応じたアイコンを取得
 */
export function getSourceIcon(source: ContentItem['source']): string {
  switch (source) {
    case 'db':
      return '🗄️'; // DBアイコン
    case 'file':
      return '📁'; // ファイルアイコン
    case 'virtual':
      return '📂'; // 仮想ディレクトリアイコン
    default:
      return '📄';
  }
}

/**
 * コンテンツタイプに応じたアイコンを取得
 */
export function getContentTypeIcon(contentType: string): string {
  switch (contentType) {
    case 'operation_log':
      return '📝';
    case 'protocol_yaml':
      return '📋';
    case 'manipulate_yaml':
      return '⚙️';
    case 'process_data':
      return '📊';
    case 'measurement':
      return '📈';
    default:
      return '📄';
  }
}
