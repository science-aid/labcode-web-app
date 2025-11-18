import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { UserProfile } from '../components/UserProfile';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useAuth } from '../contexts/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { formatDateTime } from '../utils/dateFormatter';
import { fetchRun, fetchUser } from '../api/api';
import { RunResponse } from '../types/api';


export const ProtocolDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [run, setRun] = useState<RunResponse>(
    {
      id: 0,
      project_id: 0,
      protocol_id: 0,
      user_id: 0,
      added_at: "",
      started_at: "",
      finished_at: "",
      status: "completed",
      storage_address: ""
    }
  ); 

  useEffect(() => {
    const id_num = id ? parseInt(id, 10) : NaN;

    const fetchRunData = async () => {
      try {
        const result = await fetchRun(id_num);
        const user_info = await fetchUser(user.email);
        if (result.user_id != user_info.id) {
          navigate('/forbidden', { replace: true });
        }
        setRun(result);
      } catch (err) {
        if (err.status == 404) {
          navigate('/not_found', { replace: true });
        }
        console.error(err);
      }
    }

    fetchRunData();
  }, []);

  if (!user) {
    return <Navigate to="/" replace />;
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"> */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Run detail</h1>
              <Breadcrumbs />
            </div>
            <div className="w-64">
              <UserProfile onHelp={() => {}} />
            </div>
          </div>
        </div>
      </header>
      {/* <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6"> */}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Run ID: {run.id}
              {/* プロトコル {protocol.id} */}
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
          <div className="px-6 py-5">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Actions
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/runs/${id}/processes`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                View Processes
              </button>
              <button
                onClick={() => navigate(`/operations?run_id=${id}`)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                View Operations
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};


