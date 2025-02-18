import React from 'react';
import { Navigate } from 'react-router-dom';
import { LoginButton } from '../components/LoginButton';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/protocol_list" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Experiment tracking system</h1>
          <p className="mt-2 text-gray-600">Login to continue</p>
        </div>
        <div className="mt-8">
          <LoginButton />
        </div>
      </div>
    </div>
  );
};