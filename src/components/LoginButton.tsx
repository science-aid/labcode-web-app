import React from 'react';
import { LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LoginButton: React.FC = () => {
  const { login, isLoading } = useAuth();

  return (
    <button
      onClick={() => login()}
      disabled={isLoading}
      className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <LogIn className="w-5 h-5" />
      <span>{isLoading ? 'ログイン中...' : 'ログイン'}</span>
    </button>
  );
};