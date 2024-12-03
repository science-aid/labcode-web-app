import React from 'react';
import { Navigate } from 'react-router-dom';
import { DataTable } from '../components/DataTable';
import { UserProfile } from '../components/UserProfile';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useAuth } from '../contexts/AuthContext';
import { mockData } from '../data/mockData';

export const ProtocolListPage: React.FC = () => {
  const { user } = useAuth();
  const handleHelp = () => {
    console.log('Help clicked');
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">プロトコル一覧</h1>
              <Breadcrumbs />
            </div>
            <div className="w-64">
              <UserProfile onHelp={handleHelp} />
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DataTable data={mockData} />
      </main>
    </div>
  );
};