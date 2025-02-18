import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { UserProfile } from '../components/UserProfile';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { mockData } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { formatDateTime } from '../utils/dateFormatter';
import { DAGViewer } from '../components/dag/DAGViewer';
import { mockNodes, mockEdges } from '../data/mockDagData';

export const ProtocolDetailPage: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const protocol = mockData.find(item => item.id === id);
  const [nodes, setNodes] = useState(mockNodes);
  const [edges, setEdges] = useState(mockEdges);

  useEffect(() => {
    // Create a module-specific update function
    const updateDAGData = (newModule: typeof import('../data/mockDagData')) => {
      setNodes(newModule.mockNodes);
      setEdges(newModule.mockEdges);
    };

    // Initial data
    import('../data/mockDagData').then(module => {
      updateDAGData(module);
    });

    // Hot module replacement setup
    if (import.meta.hot) {
      import.meta.hot.accept('../data/mockDagData', (newModule: any) => {
        if (newModule) {
          updateDAGData(newModule);
        }
      });
    }
  }, []);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!protocol) {
    return <Navigate to="/protocol_list" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              プロトコル {protocol.id}
            </h2>
          </div>
          <div className="px-6 py-5 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">ステータス</h3>
                <div className="mt-2">
                  <StatusBadge status={protocol.status} />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">登録日時</h3>
                <p className="mt-2 text-sm text-gray-900">
                  {formatDateTime(protocol.registeredAt)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">開始日時</h3>
                <p className="mt-2 text-sm text-gray-900">
                  {formatDateTime(protocol.startAt)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">終了日時</h3>
                <p className="mt-2 text-sm text-gray-900">
                  {formatDateTime(protocol.endAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              ワークフロー
            </h2>
          </div>
          <DAGViewer nodes={nodes} edges={edges} />
        </div>
      </main>
    </div>
  );
};