/**
 * Admin API Client
 *
 * API functions for admin panel operations including:
 * - User management (list, create, delete)
 * - Project management (list, create, update, delete)
 * - Experiment execution
 */

import axios, { AxiosError } from 'axios';

const LOG_SERVER_API = '/log_server_api';
const SIM_API = '/sim_api';

// ============================================================
// Error Handling
// ============================================================

export class AdminAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'AdminAPIError';
  }
}

const handleError = (error: unknown, operation: string): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      throw new AdminAPIError(
        `${operation} failed`,
        axiosError.response.status,
        axiosError.response.data
      );
    } else if (axiosError.request) {
      throw new AdminAPIError(`No response received during ${operation}`);
    }
  }
  throw new AdminAPIError(`${operation} error: ${(error as Error).message}`);
};

// ============================================================
// Types
// ============================================================

export interface User {
  id: number;
  email: string;
}

export interface Project {
  id: number;
  name: string;
  user_id: number;
  owner_email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RunExperimentResult {
  run_id: number;
  storage_address: string;
  status: string;
}

// ============================================================
// User APIs
// ============================================================

/**
 * List all users
 * @param limit Maximum number of users to return
 * @param offset Number of users to skip
 * @returns Array of users
 */
export const listUsers = async (
  limit: number = 100,
  offset: number = 0
): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(`${LOG_SERVER_API}/users/list`, {
      params: { limit, offset }
    });
    return response.data;
  } catch (error) {
    return handleError(error, 'List users');
  }
};

/**
 * Create a new user
 * @param email User email address
 * @returns Created user
 */
export const createUser = async (email: string): Promise<User> => {
  try {
    const formData = new FormData();
    formData.append('email', email);
    const response = await axios.post<User>(`${LOG_SERVER_API}/users/`, formData);
    return response.data;
  } catch (error) {
    return handleError(error, 'Create user');
  }
};

/**
 * Delete a user
 * @param id User ID
 */
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${LOG_SERVER_API}/users/${id}`);
  } catch (error) {
    return handleError(error, 'Delete user');
  }
};

/**
 * Get projects for a specific user
 * @param userId User ID
 * @returns Array of projects
 */
export const getUserProjects = async (userId: number): Promise<Project[]> => {
  try {
    const response = await axios.get<Project[]>(`${LOG_SERVER_API}/users/${userId}/projects`);
    return response.data;
  } catch (error) {
    return handleError(error, 'Get user projects');
  }
};

// ============================================================
// Project APIs
// ============================================================

/**
 * List all projects with owner information
 * @param limit Maximum number of projects to return
 * @param offset Number of projects to skip
 * @returns Array of projects with owner email
 */
export const listProjects = async (
  limit: number = 100,
  offset: number = 0
): Promise<Project[]> => {
  try {
    const response = await axios.get<Project[]>(`${LOG_SERVER_API}/projects/list`, {
      params: { limit, offset }
    });
    return response.data;
  } catch (error) {
    return handleError(error, 'List projects');
  }
};

/**
 * Create a new project
 * @param name Project name
 * @param userId Owner user ID
 * @returns Created project
 */
export const createProject = async (
  name: string,
  userId: number
): Promise<Project> => {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('user_id', userId.toString());
    const response = await axios.post<Project>(`${LOG_SERVER_API}/projects/`, formData);
    return response.data;
  } catch (error) {
    return handleError(error, 'Create project');
  }
};

/**
 * Update a project
 * @param id Project ID
 * @param name Project name
 * @param userId Owner user ID
 * @returns Updated project
 */
export const updateProject = async (
  id: number,
  name: string,
  userId: number
): Promise<Project> => {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', '');
    formData.append('user_id', userId.toString());
    const response = await axios.put<Project>(`${LOG_SERVER_API}/projects/${id}`, formData);
    return response.data;
  } catch (error) {
    return handleError(error, 'Update project');
  }
};

/**
 * Delete a project
 * @param id Project ID
 */
export const deleteProject = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${LOG_SERVER_API}/projects/${id}`);
  } catch (error) {
    return handleError(error, 'Delete project');
  }
};

// ============================================================
// Experiment APIs
// ============================================================

/**
 * Run an experiment
 * @param projectId Project ID
 * @param protocolName Protocol name
 * @param userId User ID
 * @param protocolYaml Protocol YAML file
 * @param manipulateYaml Manipulate YAML file
 * @returns Experiment result
 */
export const runExperiment = async (
  projectId: number,
  protocolName: string,
  userId: number,
  protocolYaml: File,
  manipulateYaml: File
): Promise<RunExperimentResult> => {
  try {
    // Files are sent as FormData body, other params as query parameters
    const formData = new FormData();
    formData.append('protocol_yaml', protocolYaml);
    formData.append('manipulate_yaml', manipulateYaml);

    const response = await axios.post<RunExperimentResult>(
      `${SIM_API}/run_experiment`,
      formData,
      {
        params: {
          project_id: projectId,
          protocol_name: protocolName,
          user_id: userId,
        },
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 600000, // 10 minutes timeout
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error, 'Run experiment');
  }
};
