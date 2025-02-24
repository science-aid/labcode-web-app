import React, { useMemo } from 'react';
import { formatDateTime } from '../../utils/dateFormatter';

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
      <div className="p-4 border rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">{node.name}</h3>
        { /*<h3 className="text-lg font-semibold text-gray-900">TODO: ラベルを記載する</h3>*/}
        <span className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${statusStyles}`}>
          {node.status}
        </span>
      </div>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Operation ID</h4>
          <p className="mt-1 text-sm text-gray-900">{node.id}</p>
        </div>

        <div className="p-4 border rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Start datetime</h4>
          <p className="mt-1 text-sm text-gray-900">
            {node.started_at ? formatDateTime(node.started_at) : "Not started"}
          </p>
        </div>

        <div className="p-4 border rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Finish datetime</h4>
          <p className="mt-1 text-sm text-gray-900">
            {node.finished_at ? formatDateTime(node.finished_at) : "Not finished"}
          </p>
        </div>

        <div className="p-4 border rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Operation storage address</h4>
          <p className="mt-1 text-sm text-gray-900">{node.storage_address}</p>
        </div>

        <div className="p-4 border rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Process ID</h4>
          {/* <p className="mt-1 text-sm text-gray-900">{node.processId}</p> */}
          <p className="mt-1 text-sm text-gray-900">{node.process_name}</p>
        </div>

        <div className="p-4 border rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Process storage address</h4>
          <p className="mt-1 text-sm text-gray-900">{node.process_storage_address}</p>
        </div>

        <div className="p-4 border rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Log</h4>
          <p className="mt-1 text-sm text-gray-900">{node.log}</p>
        </div>
      </div>
    </div>
  );
};
