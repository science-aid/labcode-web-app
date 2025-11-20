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

// プロセス一覧とエッジを取得（Bug-4, Bug-5対応, 操作ID→プロセスID変換対応）
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

    // ProcessEdge形式に変換（プロセスIDを使用）
    const edges: ProcessEdge[] = filteredEdges.map(e => ({
      id: `e${e.from_process_id}-${e.to_process_id}`,
      source: e.from_process_id!.toString(),
      target: e.to_process_id!.toString(),
    }));

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