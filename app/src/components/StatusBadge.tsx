import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { RunStatus } from '../types/data';

interface StatusBadgeProps {
  status: RunStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = (status: RunStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'not started':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getStatusIcon = (status: RunStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'running':
        return <Clock className="w-4 h-4" />;
      case 'not started':
        return <Clock className="w-4 h-4" />;
      case 'error':
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