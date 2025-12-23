// src/api/proxyService.ts
import axios, { AxiosError } from 'axios';
import { DataItem } from '../types/data';
import { RunResponse, UserResponse } from '../types/api';
// import { Edge } from '../types/dag';
import { DAGNode } from '../types/dag';
import { DAGEdge } from '../types/dag';
import { EdgeResponse } from '../types/dag';
import { Dag } from '../types/dag';
import { ProcessNode, ProcessDag, ProcessEdge } from '../types/process';
import { OperationDataItem, OperationWithRunResponse } from '../types/operation';
import {
  StorageListResponse,
  StoragePreviewResponse,
  StorageDownloadResponse,
  SortBy,
  SortOrder
} from '../types/storage';

// const API_BASE_URL = 'http://0.0.0.0:8000';
const API_BASE_URL = '/log_server_api';

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const fetchUser = async (user_email: string): Promise<UserResponse> => {
  try {
    const data = {params:{email: user_email}}
    const response = await axios.get<UserResponse>(`${API_BASE_URL}/users/`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new APIError(
          'API request failed',
          axiosError.response.status,
          axiosError.response.data
        );
      } else if (axiosError.request) {
        throw new APIError('No response received from API');
      }
    }
    throw new APIError(`Request setup error: ${(error as Error).message}`);
  }
}

/**
 * ユーザーのラン一覧を取得
 *
 * @param user_email - ユーザーのメールアドレス
 * @param includeHidden - 非表示ランを含むか (デフォルト: false)
 * @returns ラン一覧
 */
export const fetchRuns = async (
  user_email: string,
  includeHidden: boolean = false
): Promise<DataItem[]> => {
  try {
    const data = {params:{email: user_email}}
    const user_response = await axios.get<UserResponse>(`${API_BASE_URL}/users/`, data);

    const response = await axios.get<DataItem[]>(
      `${API_BASE_URL}/users/${user_response.data.id}/runs`,
      { params: { include_hidden: includeHidden } }
    );

    // convert id to string
    response.data.forEach(item => {
      item.id = item.id.toString();
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new APIError(
          'API request failed',
          axiosError.response.status,
          axiosError.response.data
        );
      } else if (axiosError.request) {
        throw new APIError('No response received from API');
      }
    }
    throw new APIError(`Request setup error: ${(error as Error).message}`);
  }
};

/**
 * ランの表示・非表示を切り替える
 *
 * 注意: このAPIはFormDataを使用する既存のPATCHエンドポイントと統合されています。
 *
 * @param runId - 対象ランのID (string型)
 * @param visible - 表示するか (true: 表示, false: 非表示)
 */
export const updateRunVisibility = async (
  runId: string,
  visible: boolean
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append('attribute', 'display_visible');
    formData.append('new_value', visible ? 'true' : 'false');

    await axios.patch(
      `${API_BASE_URL}/runs/${runId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new APIError(
          'Failed to update run visibility',
          axiosError.response.status,
          axiosError.response.data
        );
      } else if (axiosError.request) {
        throw new APIError('No response received from API');
      }
    }
    throw new APIError(`Request setup error: ${(error as Error).message}`);
  }
};

export const fetchOperations = async (run_id: number): Promise<Dag> => {
  try {
    // APIからデータを取得
    const response = await axios.get<DAGNode[]>(`${API_BASE_URL}/runs/${run_id}/operations`);
    const nodes = response.data
    // idを文字列に変換
    nodes.forEach(item => {
      item.id = (item.id).toString();
      // なければnull
      item.parent_id = item.parent_id ? item.parent_id?.toString() : null;
    });

    // エッジを取得
    const edge_response = await axios.get<EdgeResponse[]>(`${API_BASE_URL}/edges/run/${run_id}`);
    const edges_from_api = edge_response.data;
    // idを文字列に変換
    const edges: DAGEdge[] = edges_from_api.map(item => ({
      id: item.id.toString(),
      source: item.from_id.toString(),
      target: item.to_id.toString()
    }));

    // ノードとエッジを返す
    return { nodes, edges };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new APIError(
          'API request failed',
          axiosError.response.status,
          axiosError.response.data
        );
      } else if (axiosError.request) {
        throw new APIError('No response received from API');
      }
    }
    throw new APIError(`Request setup error: ${(error as Error).message}`);
    // console.error('Error fetching data:', error);
    // return { nodes: [], edges: [] };
  }
}

export const fetchRun = async (run_id: number): Promise<RunResponse> => {
  try {
    // APIからデータを取得
    const response = await axios.get<RunResponse>(`${API_BASE_URL}/runs/${run_id}`);
    const run_data = response.data;

    return run_data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new APIError(
          'API request failed',
          axiosError.response.status,
          axiosError.response.data
        );
      } else if (axiosError.request) {
        throw new APIError('No response received from API');
      }
    }
    throw new APIError(`Request setup error: ${(error as Error).message}`);
  }
}

// プロセス一覧とエッジを取得（Bug-4, Bug-5対応, 操作ID→プロセスID変換対応, ポート情報対応）
export const fetchProcesses = async (runId: number): Promise<ProcessDag> => {
  try {
    // プロセス一覧を取得
    const processesResponse = await axios.get(`${API_BASE_URL}/runs/${runId}/processes`);
    const processes: ProcessNode[] = processesResponse.data;

    // プロセスノードのIDを文字列に変換（React Flow要件対応）
    processes.forEach(item => {
      item.id = (item.id as any).toString();
    });

    // 操作一覧を取得（操作ID → プロセスIDのマッピングを作成）
    const operationsResponse = await axios.get(`${API_BASE_URL}/runs/${runId}/operations`);
    const operations = operationsResponse.data;

    // 操作ID → プロセスIDのマッピングを作成
    const operationToProcessMap = new Map<number, number>();
    operations.forEach((op: any) => {
      operationToProcessMap.set(op.id, op.process_id);
    });

    // エッジ一覧を取得
    const edgesResponse = await axios.get<EdgeResponse[]>(`${API_BASE_URL}/edges/run/${runId}`);
    const allEdges: EdgeResponse[] = edgesResponse.data;

    // ポート接続情報を取得
    const connectionsResponse = await axios.get(`${API_BASE_URL}/runs/${runId}/connections`);
    const connections: Array<{
      connection_id: number;
      run_id: number;
      source_process_id: number;
      source_process_name: string;
      source_port_id: number;
      source_port_name: string;
      target_process_id: number;
      target_process_name: string;
      target_port_id: number;
      target_port_name: string;
    }> = connectionsResponse.data;

    // プロセスIDペア → ポート情報のマッピング
    const portConnectionMap = new Map<string, { sourcePortId: string; targetPortId: string }>();
    connections.forEach(conn => {
      const key = `${conn.source_process_id}-${conn.target_process_id}`;
      portConnectionMap.set(key, {
        sourcePortId: conn.source_port_id.toString(),
        targetPortId: conn.target_port_id.toString(),
      });
    });

    // プロセスIDのセットを作成（input/output除外済み）
    const processIds = new Set(processes.map(p => parseInt(p.id)));

    // エッジを操作IDからプロセスIDに変換してからフィルタリング
    const filteredEdges = allEdges
      .map(edge => ({
        ...edge,
        from_process_id: operationToProcessMap.get(edge.from_id),
        to_process_id: operationToProcessMap.get(edge.to_id),
      }))
      .filter(edge =>
        edge.from_process_id !== undefined &&
        edge.to_process_id !== undefined &&
        edge.from_process_id !== edge.to_process_id &&  // 自己ループ除外
        processIds.has(edge.from_process_id) &&
        processIds.has(edge.to_process_id)
      );

    // ProcessEdge形式に変換（プロセスIDとポート情報を使用）
    const edges: ProcessEdge[] = filteredEdges.map(e => {
      const portKey = `${e.from_process_id}-${e.to_process_id}`;
      const portInfo = portConnectionMap.get(portKey);

      return {
        id: `e${e.from_process_id}-${e.to_process_id}`,
        source: e.from_process_id!.toString(),
        target: e.to_process_id!.toString(),
        sourcePort: portInfo?.sourcePortId,
        targetPort: portInfo?.targetPortId,
      };
    });

    return { nodes: processes, edges };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new APIError(
          'API request failed',
          axiosError.response.status,
          axiosError.response.data
        );
      } else if (axiosError.request) {
        throw new APIError('No response received from API');
      }
    }
    throw new APIError(`Request setup error: ${(error as Error).message}`);
  }
}

export const fetchAllOperations = async (user_email: string): Promise<OperationDataItem[]> => {
  try {
    // ユーザー情報取得
    const user_response = await axios.get<UserResponse>(`${API_BASE_URL}/users/`, {
      params: { email: user_email }
    });

    // オペレーション一覧取得(バックエンドでJOIN済みなのでrun_idが含まれる)
    const response = await axios.get<OperationWithRunResponse[]>(`${API_BASE_URL}/operations`, {
      params: { user_id: user_response.data.id }
    });

    // データ変換
    const operations: OperationDataItem[] = response.data.map((op) => ({
      id: op.id.toString(),
      process_id: op.process_id,
      run_id: op.run_id, // バックエンドのJOINクエリで取得済み
      name: op.name,
      status: op.status,
      started_at: op.started_at,
      finished_at: op.finished_at,
      storage_address: op.storage_address,
      is_transport: op.is_transport,
      is_data: op.is_data,
    }));

    return operations;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new APIError(
          'API request failed',
          axiosError.response.status,
          axiosError.response.data
        );
      } else if (axiosError.request) {
        throw new APIError('No response received from API');
      }
    }
    throw new APIError(`Request setup error: ${(error as Error).message}`);
  }
};

// ==================== Storage Info APIs ====================

/**
 * ストレージ情報レスポンス型
 */
export interface StorageInfoResponse {
  mode: 's3' | 'local';
  bucket_name?: string;
  local_path?: string;
  db_path?: string;
}

/**
 * ストレージモード情報を取得
 *
 * @returns ストレージモード情報
 */
export const fetchStorageInfo = async (): Promise<StorageInfoResponse> => {
  try {
    const response = await axios.get<StorageInfoResponse>(
      `${API_BASE_URL}/storage/info`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new APIError(
          'Failed to fetch storage info',
          axiosError.response.status,
          axiosError.response.data
        );
      } else if (axiosError.request) {
        throw new APIError('No response received from API');
      }
    }
    throw new APIError(`Request setup error: ${(error as Error).message}`);
  }
};

// ==================== Storage APIs ====================

/**
 * S3ストレージ内のファイル・フォルダ一覧を取得
 *
 * @param prefix - S3プレフィックス（例: runs/1/）
 * @param sortBy - ソート対象（name, size, last_modified）
 * @param order - ソート順（asc, desc）
 * @param page - ページ番号
 * @param perPage - 1ページあたりの件数
 * @returns ファイル一覧レスポンス
 */
export const fetchStorageList = async (
  prefix: string,
  sortBy: SortBy = 'name',
  order: SortOrder = 'asc',
  page: number = 1,
  perPage: number = 50
): Promise<StorageListResponse> => {
  try {
    const response = await axios.get<StorageListResponse>(
      `${API_BASE_URL}/storage/list`,
      {
        params: {
          prefix,
          sort_by: sortBy,
          order,
          page,
          per_page: perPage
        }
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new APIError(
          'Failed to fetch storage list',
          axiosError.response.status,
          axiosError.response.data
        );
      } else if (axiosError.request) {
        throw new APIError('No response received from API');
      }
    }
    throw new APIError(`Request setup error: ${(error as Error).message}`);
  }
};

/**
 * テキストファイルの内容をプレビュー取得
 *
 * @param filePath - S3キー（例: runs/1/output.json）
 * @param maxLines - 最大行数（デフォルト: 1000）
 * @returns プレビューレスポンス
 */
export const fetchStoragePreview = async (
  filePath: string,
  maxLines: number = 1000
): Promise<StoragePreviewResponse> => {
  try {
    const response = await axios.get<StoragePreviewResponse>(
      `${API_BASE_URL}/storage/preview`,
      {
        params: {
          file_path: filePath,
          max_lines: maxLines
        }
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new APIError(
          'Failed to fetch file preview',
          axiosError.response.status,
          axiosError.response.data
        );
      } else if (axiosError.request) {
        throw new APIError('No response received from API');
      }
    }
    throw new APIError(`Request setup error: ${(error as Error).message}`);
  }
};

/**
 * ダウンロード用の事前署名URLを取得
 *
 * @param filePath - S3キー（例: runs/1/output.json）
 * @param expiresIn - 有効期限（秒）、デフォルト3600秒（1時間）
 * @returns ダウンロードURLレスポンス
 */
export const fetchStorageDownloadUrl = async (
  filePath: string,
  expiresIn: number = 3600
): Promise<StorageDownloadResponse> => {
  try {
    const response = await axios.get<StorageDownloadResponse>(
      `${API_BASE_URL}/storage/download`,
      {
        params: {
          file_path: filePath,
          expires_in: expiresIn
        }
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new APIError(
          'Failed to get download URL',
          axiosError.response.status,
          axiosError.response.data
        );
      } else if (axiosError.request) {
        throw new APIError('No response received from API');
      }
    }
    throw new APIError(`Request setup error: ${(error as Error).message}`);
  }
};

// ==================== Batch Download APIs ====================

/**
 * バッチダウンロードの推定サイズレスポンス型
 */
export interface BatchDownloadEstimate {
  run_count: number;
  estimated_size: number;
  estimated_size_mb: number;
  can_download: boolean;
  message?: string;
}

/**
 * バッチダウンロードの推定サイズを取得
 *
 * @param runIds - ダウンロード対象のランIDリスト
 * @returns 推定サイズ情報
 */
export const estimateBatchDownload = async (
  runIds: string[]
): Promise<BatchDownloadEstimate> => {
  try {
    const response = await axios.post<BatchDownloadEstimate>(
      `${API_BASE_URL}/storage/batch-download/estimate`,
      { run_ids: runIds.map(id => parseInt(id, 10)) }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new APIError(
          'Failed to estimate batch download size',
          axiosError.response.status,
          axiosError.response.data
        );
      } else if (axiosError.request) {
        throw new APIError('No response received from API');
      }
    }
    throw new APIError(`Request setup error: ${(error as Error).message}`);
  }
};

/**
 * 複数ランのファイルをZIP形式で一括ダウンロード
 *
 * @param runIds - ダウンロード対象のランIDリスト
 */
export const downloadRunsAsZip = async (
  runIds: string[]
): Promise<void> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/storage/batch-download`,
      { run_ids: runIds.map(id => parseInt(id, 10)) },
      { responseType: 'blob' }
    );

    // Content-Dispositionからファイル名を取得
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'labcode_runs.zip';
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^";\n]+)"?/);
      if (match) {
        filename = match[1];
      }
    }

    // Blobを作成してダウンロード
    const blob = new Blob([response.data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // Blobエラーレスポンスをテキストに変換
        if (axiosError.response.data instanceof Blob) {
          const text = await (axiosError.response.data as Blob).text();
          try {
            const errorData = JSON.parse(text);
            throw new APIError(
              errorData.detail || 'Failed to download files',
              axiosError.response.status,
              errorData
            );
          } catch {
            throw new APIError(
              'Failed to download files',
              axiosError.response.status
            );
          }
        }
        throw new APIError(
          'Failed to download files',
          axiosError.response.status,
          axiosError.response.data
        );
      } else if (axiosError.request) {
        throw new APIError('No response received from API');
      }
    }
    throw new APIError(`Request setup error: ${(error as Error).message}`);
  }
};

/**
 * 複数ランのファイルをZIP形式で一括ダウンロード（進捗コールバック付き）
 *
 * @param runIds - ダウンロード対象のランIDリスト
 * @param onProgress - 進捗コールバック（0-100%）
 */
export const downloadRunsAsZipWithProgress = async (
  runIds: string[],
  onProgress?: (progress: number) => void
): Promise<void> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/storage/batch-download`,
      { run_ids: runIds.map(id => parseInt(id, 10)) },
      {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          } else if (onProgress && progressEvent.loaded) {
            // Totalがない場合は不定進捗（ストリーミング）
            // 読み込みサイズから推定（最大500MBを想定）
            const estimatedTotal = 500 * 1024 * 1024;
            const progress = Math.min(Math.round((progressEvent.loaded * 100) / estimatedTotal), 99);
            onProgress(progress);
          }
        }
      }
    );

    // Content-Dispositionからファイル名を取得
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'labcode_runs.zip';
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^";\n]+)"?/);
      if (match) {
        filename = match[1];
      }
    }

    // Blobを作成してダウンロード
    const blob = new Blob([response.data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // 完了
    onProgress?.(100);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // Blobエラーレスポンスをテキストに変換
        if (axiosError.response.data instanceof Blob) {
          const text = await (axiosError.response.data as Blob).text();
          try {
            const errorData = JSON.parse(text);
            throw new APIError(
              errorData.detail || 'Failed to download files',
              axiosError.response.status,
              errorData
            );
          } catch {
            throw new APIError(
              'Failed to download files',
              axiosError.response.status
            );
          }
        }
        throw new APIError(
          'Failed to download files',
          axiosError.response.status,
          axiosError.response.data
        );
      } else if (axiosError.request) {
        throw new APIError('No response received from API');
      }
    }
    throw new APIError(`Request setup error: ${(error as Error).message}`);
  }
};

// ==================== Batch Download V2 APIs (HAL対応) ====================

/**
 * HAL対応バッチダウンロードの推定サイズレスポンス型
 */
export interface BatchDownloadV2Estimate {
  run_count: number;
  total_files: number;
  estimated_size_bytes: number;
  estimated_size_mb: number;
  can_download: boolean;
  message?: string;
  runs_detail: Array<{
    run_id: number;
    storage_mode?: string;
    file_count?: number;
    estimated_size?: number;
    error?: string;
  }>;
}

/**
 * HAL対応バッチダウンロードの推定サイズを取得
 * Storage Browser相当のフォルダ構成でのダウンロードサイズを推定
 *
 * @param runIds - ダウンロード対象のランIDリスト
 * @returns 推定サイズ情報
 */
export const estimateBatchDownloadV2 = async (
  runIds: string[]
): Promise<BatchDownloadV2Estimate> => {
  try {
    const response = await axios.post<BatchDownloadV2Estimate>(
      `${API_BASE_URL}/v2/storage/batch-download/estimate`,
      { run_ids: runIds.map(id => parseInt(id, 10)) }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new APIError(
          'Failed to estimate batch download size',
          axiosError.response.status,
          axiosError.response.data
        );
      } else if (axiosError.request) {
        throw new APIError('No response received from API');
      }
    }
    throw new APIError(`Request setup error: ${(error as Error).message}`);
  }
};

/**
 * HAL対応: 複数ランのファイルをZIP形式で一括ダウンロード
 * Storage Browser相当のフォルダ構成でダウンロード（全ストレージモード対応）
 *
 * @param runIds - ダウンロード対象のランIDリスト
 * @param onProgress - 進捗コールバック（0-100%）
 */
export const downloadRunsAsZipV2 = async (
  runIds: string[],
  onProgress?: (progress: number) => void
): Promise<void> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/v2/storage/batch-download`,
      { run_ids: runIds.map(id => parseInt(id, 10)) },
      {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          } else if (onProgress && progressEvent.loaded) {
            // Totalがない場合は不定進捗（ストリーミング）
            const estimatedTotal = 500 * 1024 * 1024;
            const progress = Math.min(Math.round((progressEvent.loaded * 100) / estimatedTotal), 99);
            onProgress(progress);
          }
        }
      }
    );

    // Content-Dispositionからファイル名を取得
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'labcode_runs.zip';
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^";\n]+)"?/);
      if (match) {
        filename = match[1];
      }
    }

    // Blobを作成してダウンロード
    const blob = new Blob([response.data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // 完了
    onProgress?.(100);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        if (axiosError.response.data instanceof Blob) {
          const text = await (axiosError.response.data as Blob).text();
          try {
            const errorData = JSON.parse(text);
            throw new APIError(
              errorData.detail || 'Failed to download files',
              axiosError.response.status,
              errorData
            );
          } catch {
            throw new APIError(
              'Failed to download files',
              axiosError.response.status
            );
          }
        }
        throw new APIError(
          'Failed to download files',
          axiosError.response.status,
          axiosError.response.data
        );
      } else if (axiosError.request) {
        throw new APIError('No response received from API');
      }
    }
    throw new APIError(`Request setup error: ${(error as Error).message}`);
  }
};

/**
 * 複数ランのメタデータダンプを一括ダウンロード
 * 各ランごとに個別の.dbファイルをZIPにまとめてダウンロード
 *
 * @param runIds - ダウンロード対象のランIDリスト
 * @param onProgress - 進捗コールバック（0-100%）
 */
export const downloadMetadataDumpsAsZip = async (
  runIds: string[],
  onProgress?: (progress: number) => void
): Promise<void> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/v2/storage/batch-dump`,
      { run_ids: runIds.map(id => parseInt(id, 10)) },
      {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          } else if (onProgress && progressEvent.loaded) {
            const estimatedTotal = 50 * 1024 * 1024;
            const progress = Math.min(Math.round((progressEvent.loaded * 100) / estimatedTotal), 99);
            onProgress(progress);
          }
        }
      }
    );

    // Content-Dispositionからファイル名を取得
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'labcode_metadata_dumps.zip';
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^";\n]+)"?/);
      if (match) {
        filename = match[1];
      }
    }

    // Blobを作成してダウンロード
    const blob = new Blob([response.data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // 完了
    onProgress?.(100);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        if (axiosError.response.data instanceof Blob) {
          const text = await (axiosError.response.data as Blob).text();
          try {
            const errorData = JSON.parse(text);
            throw new APIError(
              errorData.detail || 'Failed to download metadata dumps',
              axiosError.response.status,
              errorData
            );
          } catch {
            throw new APIError(
              'Failed to download metadata dumps',
              axiosError.response.status
            );
          }
        }
        throw new APIError(
          'Failed to download metadata dumps',
          axiosError.response.status,
          axiosError.response.data
        );
      } else if (axiosError.request) {
        throw new APIError('No response received from API');
      }
    }
    throw new APIError(`Request setup error: ${(error as Error).message}`);
  }
};