import React, { useMemo } from 'react';
import { formatDateTime } from '../../utils/dateFormatter';

interface NodeDetailsProps {
  node: any; // 型を変更して柔軟に対応
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
      <div className="p-4 border rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">{node.label}</h3>
        <span className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${statusStyles}`}>
          {node.status}
        </span>
      </div>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">ID</h4>
          <p className="mt-1 text-sm text-gray-900">{node.id}</p>
        </div>

        <div className="p-4 border rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">開始時間</h4>
          <p className="mt-1 text-sm text-gray-900">
            {formatDateTime(node.startTime)}
          </p>
        </div>

        <div className="p-4 border rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">終了時間</h4>
          <p className="mt-1 text-sm text-gray-900">
            {formatDateTime(node.endTime)}
          </p>
        </div>

        <div className="p-4 border rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">入力</h4>
          <p className="mt-1 text-sm text-gray-900">{node.input}</p>
        </div>

        <div className="p-4 border rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">出力</h4>
          <p className="mt-1 text-sm text-gray-900">{node.output}</p>
        </div>

        <div className="p-4 border rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">ストレージアドレス</h4>
          <p className="mt-1 text-sm text-gray-900">{node.storage_address}</p>
        </div>

        <div className="p-4 border rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">プロセスID</h4>
          <p className="mt-1 text-sm text-gray-900">{node.processId}</p>
        </div>

        {/* <div className="p-4 border rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">輸送フラグ</h4>
          <p className="mt-1 text-sm text-gray-900">{node.isTransport ? 'はい' : 'いいえ'}</p>
        </div> */}
      </div>
    </div>
  );
};
