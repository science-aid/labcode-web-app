import React, { useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { DataTable } from '../components/DataTable';
import { UserProfile } from '../components/UserProfile';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { VisibilityToggle } from '../components/VisibilityToggle';
import { SelectionControls } from '../components/SelectionControls';
import { BulkVisibilityControls } from '../components/BulkVisibilityControls';
import { BatchDownloadButton } from '../components/BatchDownloadButton';
import { useAuth } from '../contexts/AuthContext';
// import { mockData } from '../data/mockData';
import { fetchRuns, updateRunVisibility } from '../api/api';
// import { RunsResponse } from '../types/api';
import { APIError } from '../api/api';
import { DataItem } from '../types/data';
import { FEATURES } from '../config/features';
// import { mockData } from '../data/mockData';

export const RunListPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = React.useState<DataItem[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [showHidden, setShowHidden] = React.useState<boolean>(false);
  const [selectedRunIds, setSelectedRunIds] = React.useState<string[]>([]);
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
          if (!user) return;  // null check

          try {
            const result = await fetchRuns(user.email, showHidden);
            setData(result);
          } catch (err) {
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
      }, [user, showHidden, navigate]);
  const handleHelp = () => {
    console.log('Help clicked');
  };

  const handleSelectAll = () => {
    setSelectedRunIds(data.map(item => item.id));
  };

  const handleDeselectAll = () => {
    setSelectedRunIds([]);
  };

  const handleToggleVisibility = () => {
    setShowHidden(!showHidden);
  };

  const handleShowSelected = async () => {
    if (selectedRunIds.length === 0) return;

    setIsProcessing(true);
    try {
      // Update all selected runs to visible
      await Promise.all(
        selectedRunIds.map(runId => updateRunVisibility(runId, true))
      );

      // Refetch data to reflect changes
      const result = await fetchRuns(user!.email, showHidden);
      setData(result);

      // Clear selection
      setSelectedRunIds([]);
    } catch (err) {
      if (err instanceof APIError) {
        setError(`API Error: ${err.message}`);
        alert(`表示処理に失敗しました: ${err.message}`);
      } else {
        setError(`Unexpected error: ${(err as Error).message}`);
        alert('表示処理に失敗しました');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleHideSelected = async () => {
    if (selectedRunIds.length === 0) return;

    setIsProcessing(true);
    try {
      // Update all selected runs to hidden
      await Promise.all(
        selectedRunIds.map(runId => updateRunVisibility(runId, false))
      );

      // Refetch data to reflect changes
      const result = await fetchRuns(user!.email, showHidden);
      setData(result);

      // Clear selection
      setSelectedRunIds([]);
    } catch (err) {
      if (err instanceof APIError) {
        setError(`API Error: ${err.message}`);
        alert(`非表示処理に失敗しました: ${err.message}`);
      } else {
        setError(`Unexpected error: ${(err as Error).message}`);
        alert('非表示処理に失敗しました');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"> */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Run list</h1>
                {FEATURES.ADMIN_PANEL && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-purple-600 bg-purple-50 rounded-full hover:bg-purple-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin
                  </Link>
                )}
              </div>
              <Breadcrumbs />
            </div>
            <div className="w-64">
              <UserProfile onHelp={handleHelp} />
            </div>
          </div>
        </div>
      </header>
      {/* <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> */}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <VisibilityToggle
          showHidden={showHidden}
          onToggle={handleToggleVisibility}
        />

        <BulkVisibilityControls
          selectedCount={selectedRunIds.length}
          onShowSelected={handleShowSelected}
          onHideSelected={handleHideSelected}
          isProcessing={isProcessing}
        />

        {/* バッチダウンロードボタン */}
        <div className="mb-4">
          <BatchDownloadButton
            selectedRunIds={selectedRunIds}
            isProcessing={isProcessing}
            onDownloadStart={() => setIsProcessing(true)}
            onDownloadComplete={() => setIsProcessing(false)}
            onDownloadError={() => setIsProcessing(false)}
          />
        </div>

        {selectedRunIds.length > 0 && (
          <SelectionControls
            selectedCount={selectedRunIds.length}
            totalCount={data.length}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
          />
        )}

        <DataTable
          data={data}
          selectedIds={selectedRunIds}
          onSelectionChange={setSelectedRunIds}
        />
      </main>
    </div>
  );
};