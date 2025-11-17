import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { UserProfile } from '../components/UserProfile';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useAuth } from '../contexts/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { formatDateTime } from '../utils/dateFormatter';
import { ProcessViewer } from '../components/dag/ProcessViewer'; // ★新規コンポーネント
import { fetchProcesses, fetchRun, fetchUser } from '../api/api'; // ★fetchProcesses実装済み
import { RunResponse } from '../types/api';
import { ProcessNode, ProcessEdge } from '../types/process'; // ★新規型定義
import { Edge } from 'reactflow';

export const ProcessViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { runId } = useParams<{ runId: string }>(); // Run ID (RESTful準拠)
  const { user } = useAuth();
  const [nodes, setNodes] = useState<ProcessNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [run, setRun] = useState<RunResponse>({
    id: 0,
    project_id: 0,
    protocol_id: 0,
    user_id: 0,
    added_at: "",
    started_at: "",
    finished_at: "",
    status: "completed",
    storage_address: ""
  });

  useEffect(() => {
    const id_num = runId ? parseInt(runId, 10) : NaN;

    const updateDag = (newDagData: { nodes: ProcessNode[], edges: ProcessEdge[] }) => {
      setNodes([...newDagData.nodes]);
      setEdges([...newDagData.edges]);
    };

    const fetchData = async () => {
      try {
        const result = await fetchProcesses(id_num); // ★API呼び出し実装済み
        updateDag(result);
      } catch (err: any) {
        if (err.status == 404) {
          navigate('/not_found', { replace: true });
        }
        console.error(err);
      }
    };

    const fetchRunData = async () => {
      try {
        const result = await fetchRun(id_num);
        const user_info = await fetchUser(user.email);
        if (result.user_id != user_info.id) {
          navigate('/forbidden', { replace: true });
        }
        setRun(result);
      } catch (err: any) {
        if (err.status == 404) {
          navigate('/not_found', { replace: true });
        }
        console.error(err);
      }
    };

    fetchData();  // ★実行
    fetchRunData();
  }, [runId, navigate, user.email]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Process View</h1>
              <Breadcrumbs />
            </div>
            <div className="w-64">
              <UserProfile onHelp={() => {}} />
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Run ID: {run.id}
            </h2>
          </div>
          <div className="px-6 py-5 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <div className="mt-2">
                  <StatusBadge status={run.status} />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Add datetime</h3>
                <p className="mt-2 text-sm text-gray-900">
                  {formatDateTime(run.added_at)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Start datetime</h3>
                <p className="mt-2 text-sm text-gray-900">
                  {run.started_at ? formatDateTime(run.started_at): 'Not started'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Finish datetime</h3>
                <p className="mt-2 text-sm text-gray-900">
                  {run.finished_at ? formatDateTime(run.finished_at): 'Not finished'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Process Workflow
            </h2>
          </div>
          <ProcessViewer nodes={nodes} edges={edges} />
        </div>
      </main>
    </div>
  );
};
