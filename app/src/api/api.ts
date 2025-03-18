// src/api/proxyService.ts
import axios, { AxiosError } from 'axios';
import { DataItem } from '../types/data';
import { RunResponse, UserResponse } from '../types/api';
// import { Edge } from '../types/dag';
import { DAGNode } from '../types/dag';
import { DAGEdge } from '../types/dag';
import { EdgeResponse } from '../types/dag';
import { Dag } from '../types/dag';

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

export const fetchRuns = async (user_email: string): Promise<DataItem[]> => {
  try {
    const data = {params:{email: user_email}}
    const user_response = await axios.get<UserResponse>(`${API_BASE_URL}/users/`, data);
    const response = await axios.get<DataItem[]>(`${API_BASE_URL}/users/${user_response.data.id}/runs`);
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