import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { Status } from '../types/data';

interface StatusBadgeProps {
  status: Status;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = (status: Status) => {
    switch (status) {
      case '完了':
        return 'bg-green-100 text-green-800 border-green-200';
      case '進行中':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '未開始':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'キャンセル':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case '完了':
        return <CheckCircle className="w-4 h-4" />;
      case '進行中':
        return <Clock className="w-4 h-4" />;
      case '未開始':
        return <Clock className="w-4 h-4" />;
      case 'キャンセル':
        return <XCircle className="w-4 h-4" />;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyles(status)}`}>
      {getStatusIcon(status)}
      {status}
    </span>
  );
};