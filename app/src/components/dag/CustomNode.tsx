import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeStatus } from '../../types/dag';

interface CustomNodeProps {
  data: {
    id: string;
    label: string;
    status: NodeStatus;
    selected?: boolean;
    is_transport?: boolean;
  };
  selected: boolean;
}

const statusColors: Record<NodeStatus, { bg: string; border: string; hoverBg: string }> = {
  'completed': { bg: 'bg-green-100', border: 'border-green-500', hoverBg: 'hover:bg-green-200' },
  'running': { bg: 'bg-blue-100', border: 'border-blue-500', hoverBg: 'hover:bg-blue-200' },
  'not started': { bg: 'bg-gray-100', border: 'border-gray-500', hoverBg: 'hover:bg-gray-200' },
  'error': { bg: 'bg-red-100', border: 'border-red-500', hoverBg: 'hover:bg-red-200' }
};

const CustomNode: React.FC<CustomNodeProps> = memo(({ data, selected }) => {
  const colors = statusColors[data.status];
  const shapeClass = data.is_transport ? 'rounded-full' : 'rounded-lg'; // 丸か四角を決定

  return (
    <div className="relative group">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-2 h-2 !bg-gray-400 group-hover:!bg-gray-600 transition-colors" 
      />
      <div 
        className={`
          px-4 py-2 border-2 transition-all duration-200 
          ${colors.bg} ${colors.border} ${colors.hoverBg}
          ${shapeClass} // 形状クラスを適用
          ${selected ? 'shadow-lg ring-2 ring-blue-400 ring-opacity-50 scale-105' : 'shadow-md hover:scale-105'}
        `}
      >
        <div className="w-32 h-32 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700 text-center">
            {data.label}
          </span>
        </div>
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-2 h-2 !bg-gray-400 group-hover:!bg-gray-600 transition-colors" 
      />
    </div>
  );
});

export default CustomNode;

