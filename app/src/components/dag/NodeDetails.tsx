import React, { useMemo } from 'react';
import { formatDateTime } from '../../utils/dateFormatter';
import { StatusBadge } from '../StatusBadge';
import { ExternalLink } from 'lucide-react';

interface NodeDetailsProps {
  node: any; // 型を変更して柔軟に対応
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'running':
      return 'bg-blue-100 text-blue-800';
    case 'error':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const NodeDetails: React.FC<NodeDetailsProps> = ({ node }) => {
  const statusStyles = useMemo(() => 
    node ? getStatusStyles(node.status) : '',
    [node?.status]
  );

  if (!node) {
    return (
      <div className="p-4 text-gray-500">
        Select node...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Property
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {label: "Operation name", value: node.name},
                  {label: "Status", value: <StatusBadge status={node.status} />},
                  { label: "Operation ID", value: node.id },
                  { label: "Start datetime", value: node.started_at ? formatDateTime(node.started_at) : "Not started" },
                  { label: "Finish datetime", value: node.finished_at ? formatDateTime(node.finished_at) : "Not finished" },
                  { label: "Operation storage address", value: <a href={node.storage_address} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline" > <span>{node.storage_address}</span> <ExternalLink className="w-4 h-4" /> </a> },
                  { label: "Process ID", value: node.process_name },
                  { label: "Process storage address", value: <a href={node.process_storage_address} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline" > <span>{node.process_storage_address}</span> <ExternalLink className="w-4 h-4" /> </a> },
                  { label: "Log", value: node.log }
                ].map((item, index) => (
                  <tr key={index} className="border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">{item.label}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
    </div>
  );
};
