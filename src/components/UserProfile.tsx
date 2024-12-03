import React from 'react';
import { User, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoginButton } from './LoginButton';

interface UserProfileProps {
  onHelp?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  onHelp = () => alert('ヘルプページを開きます'),
}) => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="w-64">
        <LoginButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-3 bg-white rounded-lg shadow px-4 py-2 w-full">
        <div className="relative">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-6 h-6 text-gray-500" />
            </div>
          )}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-gray-900 text-left">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>
      <button
        onClick={onHelp}
        className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors shadow w-full"
      >
        <HelpCircle className="w-5 h-5" />
        <span className="hidden sm:inline">ヘルプ</span>
      </button>
      <button
        onClick={logout}
        className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 bg-white hover:bg-red-50 rounded-lg transition-colors shadow w-full"
      >
        <LogOut className="w-5 h-5" />
        <span className="hidden sm:inline">ログアウト</span>
      </button>
    </div>
  );
};