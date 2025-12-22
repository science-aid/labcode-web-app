import React, { useMemo } from 'react';
import { formatDateTime } from '../../utils/dateFormatter';
import { StatusBadge } from '../StatusBadge';
import { StorageAddressLink } from '../common/StorageAddressLink';
import { Process, Port } from '../../types/process';

interface ProcessDetailsProps {
  process: Process | null;
  onViewOperations?: (processId: number) => void;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'running':
      return 'bg-blue-100 text-blue-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const ProcessDetails: React.FC<ProcessDetailsProps> = ({ process, onViewOperations }) => {
  const statusStyles = useMemo(() =>
    process ? getStatusStyles(process.status) : '',
    [process?.status]
  );

  if (!process) {
    return (
      <div className="p-4 text-gray-500">
        プロセスを選択してください
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* プロセス基本情報 */}
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
              { label: "Process name", value: process.name },
              { label: "Process type", value: process.type },
              { label: "Status", value: <StatusBadge status={process.status} /> },
              { label: "Process ID", value: process.id },
              { label: "Start datetime", value: process.started_at ? formatDateTime(process.started_at) : "Not started" },
              { label: "Finish datetime", value: process.finished_at ? formatDateTime(process.finished_at) : "Not finished" },
              {
                label: "Storage address",
                value: <StorageAddressLink address={process.storage_address} showFullPath={true} />
              },
            ].map((item, index) => (
              <tr key={index} className="border border-gray-300">
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">{item.label}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ポート情報セクション */}
      {process.ports && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-2">
            Ports
          </h3>

          {/* 入力ポート */}
          {process.ports.input && process.ports.input.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Input Ports</h4>
              <div className="space-y-2">
                {process.ports.input.map((port: Port, index: number) => (
                  <div key={index} className="border border-gray-300 rounded-md p-3 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{port.name}</p>
                        <p className="text-xs text-gray-600">Type: {port.data_type}</p>
                      </div>
                      {port.connected_from && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          From: {port.connected_from}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 出力ポート */}
          {process.ports.output && process.ports.output.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Output Ports</h4>
              <div className="space-y-2">
                {process.ports.output.map((port: Port, index: number) => (
                  <div key={index} className="border border-gray-300 rounded-md p-3 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{port.name}</p>
                        <p className="text-xs text-gray-600">Type: {port.data_type}</p>
                      </div>
                      {port.connected_to && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          To: {port.connected_to}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* View Operations ボタン */}
      {onViewOperations && (
        <div className="pt-4 border-t border-gray-300">
          <button
            onClick={() => onViewOperations(parseInt(process.id))}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View Operations
          </button>
        </div>
      )}
    </div>
  );
};
