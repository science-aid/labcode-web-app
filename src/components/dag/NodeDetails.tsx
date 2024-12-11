import React, { useMemo } from 'react';
import { DAGNode } from '../../types/dag';
import { formatDateTime } from '../../utils/dateFormatter';

interface NodeDetailsProps {
  node: DAGNode | null;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case '完了':
      return 'bg-green-100 text-green-800';
    case '進行中':
      return 'bg-blue-100 text-blue-800';
    case 'エラー':
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
        ノードを選択してください
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{node.label}</h3>
        <span className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${statusStyles}`}>
          {node.status}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">説明</h4>
          <p className="mt-1 text-sm text-gray-900">{node.details.description}</p>
        </div>

        {node.details.startTime && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">開始時間</h4>
            <p className="mt-1 text-sm text-gray-900">
              {formatDateTime(node.details.startTime)}
            </p>
          </div>
        )}

        {node.details.endTime && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">終了時間</h4>
            <p className="mt-1 text-sm text-gray-900">
              {formatDateTime(node.details.endTime)}
            </p>
          </div>
        )}

        {node.details.parameters && Object.keys(node.details.parameters).length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">パラメータ</h4>
            <dl className="mt-2 grid grid-cols-1 gap-2">
              {Object.entries(node.details.parameters).map(([key, value]) => (
                <div key={key} className="flex">
                  <dt className="text-sm font-medium text-gray-500 w-1/3">{key}:</dt>
                  <dd className="text-sm text-gray-900 w-2/3">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {node.details.output && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">出力</h4>
            <pre className="mt-1 text-sm text-gray-900 whitespace-pre-wrap overflow-x-auto">
              {typeof node.details.output === 'object' 
                ? JSON.stringify(node.details.output, null, 2) 
                : node.details.output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};