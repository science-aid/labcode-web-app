import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { OperationDataTable } from '../components/operation/OperationDataTable';
import { UserProfile } from '../components/UserProfile';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useAuth } from '../contexts/AuthContext';
import { fetchAllOperations } from '../api/api';
import { OperationDataItem } from '../types/operation';
import { APIError } from '../api/api';

export const OperationListPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<OperationDataItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URLパラメータから初期フィルタを取得
  const initialRunId = searchParams.get('run_id');
  const initialProcessId = searchParams.get('process_id');

  // デバッグログ: URLパラメータの取得確認
  console.log('[OperationListPage] URL Parameters:', {
    initialRunId,
    initialProcessId,
    fullURL: window.location.href
  });

  // ヘルプボタンのハンドラー
  const handleHelp = () => {
    console.log('Help clicked');
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return; // user null チェック

      try {
        const result = await fetchAllOperations(user.email);
        setData(result);
      } catch (err: any) { // 型アサーション
        if (err instanceof APIError) {
          setError(`API Error: ${err.message} (Status: ${err.status || 'unknown'})`);
          navigate('/internal_server_error', { replace: true });
        } else {
          setError(`Unexpected error: ${(err as Error).message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Operation list</h1>
              <Breadcrumbs />
            </div>
            <div className="w-64">
              <UserProfile onHelp={handleHelp} />
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : (
          <>
            {/* デバッグログ: initialFiltersの確認 */}
            {console.log('[OperationListPage] Passing initialFilters to OperationDataTable:', {
              run_id: initialRunId ? parseInt(initialRunId) : undefined,
              process_id: initialProcessId ? parseInt(initialProcessId) : undefined
            })}
            <OperationDataTable
              data={data}
              initialFilters={{
                run_id: initialRunId ? parseInt(initialRunId) : undefined,
                process_id: initialProcessId ? parseInt(initialProcessId) : undefined
              }}
            />
          </>
        )}
      </main>
    </div>
  );
};
