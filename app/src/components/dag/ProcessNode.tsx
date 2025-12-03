import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { ProcessStatus } from '../../types/process';

interface ProcessNodeProps {
  data: {
    id: string;
    label: string;
    type: string; // ★プロセスタイプ
    status: ProcessStatus;
    selected?: boolean;
    ports?: {
      input?: Array<{ id: string; name: string; data_type: string }>;
      output?: Array<{ id: string; name: string; data_type: string }>;
    }; // ★ポート情報
  };
  selected: boolean;
}

const statusColors: Record<ProcessStatus, { bg: string; border: string; hoverBg: string }> = {
  'pending': { bg: 'bg-gray-100', border: 'border-gray-500', hoverBg: 'hover:bg-gray-200' },
  'running': { bg: 'bg-blue-100', border: 'border-blue-500', hoverBg: 'hover:bg-blue-200' },
  'completed': { bg: 'bg-green-100', border: 'border-green-500', hoverBg: 'hover:bg-green-200' },
  'failed': { bg: 'bg-red-100', border: 'border-red-500', hoverBg: 'hover:bg-red-200' }
};

const ProcessNode: React.FC<ProcessNodeProps> = memo(({ data, selected }) => {
  const colors = statusColors[data.status];
  const shapeClass = 'rounded-lg'; // ★プロセスは基本的に四角形

  return (
    <div className="relative group">
      {/* 入力ポートのHandle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-gray-400 group-hover:!bg-gray-600 transition-colors"
      />

      <div
        className={`
          px-4 py-2 border-2 transition-all duration-200
          ${colors.bg} ${colors.border} ${colors.hoverBg}
          ${shapeClass}
          ${selected ? 'shadow-lg ring-2 ring-blue-400 ring-opacity-50 scale-105' : 'shadow-md hover:scale-105'}
        `}
      >
        {/* プロセス名 */}
        <div className="w-32 h-auto flex flex-col items-center justify-center space-y-2">
          <span className="text-sm font-medium text-gray-700 text-center">
            {data.label}
          </span>

          {/* プロセスタイプ */}
          <span className="text-xs text-gray-500">
            {data.type}
          </span>

          {/* ★ポート情報の表示（簡易版） */}
          {data.ports && (
            <div className="text-xs text-gray-500 space-y-1">
              {data.ports.input && data.ports.input.length > 0 && (
                <div>↓ {data.ports.input.length} inputs</div>
              )}
              {data.ports.output && data.ports.output.length > 0 && (
                <div>↑ {data.ports.output.length} outputs</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 出力ポートのHandle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-gray-400 group-hover:!bg-gray-600 transition-colors"
      />
    </div>
  );
});

export default ProcessNode;
