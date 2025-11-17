import React from 'react';
import { Edge } from 'reactflow';
import { ProcessNode, Port } from '../../types/process';
import { ArrowRight } from 'lucide-react';

interface PortDetailsProps {
  edge: Edge | null;
  processes: ProcessNode[];
}

export const PortDetails: React.FC<PortDetailsProps> = ({ edge, processes }) => {
  if (!edge) {
    return (
      <div className="p-4 text-gray-500">
        エッジを選択してください
      </div>
    );
  }

  // エッジの接続元・接続先プロセスを取得
  const sourceProcess = processes.find(p => p.id === edge.source);
  const targetProcess = processes.find(p => p.id === edge.target);

  // エッジのデータから出力ポート・入力ポートを取得
  const sourcePort = edge.data?.sourcePort || edge.sourceHandle;
  const targetPort = edge.data?.targetPort || edge.targetHandle;

  // プロセスのポート情報から詳細を取得
  const sourcePortDetails = sourceProcess?.ports?.output?.find(
    (p: Port) => p.id === sourcePort || p.name === sourcePort
  );
  const targetPortDetails = targetProcess?.ports?.input?.find(
    (p: Port) => p.id === targetPort || p.name === targetPort
  );

  return (
    <div className="p-6 space-y-6">
      {/* エッジ基本情報 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Port Connection</h3>
        <div className="text-sm text-gray-600">
          Edge ID: {edge.id}
        </div>
      </div>

      {/* データフロー視覚化 */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
        <div className="flex items-center justify-between space-x-4">
          {/* 接続元プロセス */}
          <div className="flex-1">
            <div className="text-xs font-medium text-gray-500 mb-1">From</div>
            <div className="bg-white border border-gray-300 rounded-md p-3">
              <p className="text-sm font-semibold text-gray-900">
                {sourceProcess?.name || 'Unknown Process'}
              </p>
              {sourcePortDetails && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Port:</span> {sourcePortDetails.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Type:</span> {sourcePortDetails.data_type}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 矢印 */}
          <div className="flex-shrink-0">
            <ArrowRight className="w-6 h-6 text-blue-500" />
          </div>

          {/* 接続先プロセス */}
          <div className="flex-1">
            <div className="text-xs font-medium text-gray-500 mb-1">To</div>
            <div className="bg-white border border-gray-300 rounded-md p-3">
              <p className="text-sm font-semibold text-gray-900">
                {targetProcess?.name || 'Unknown Process'}
              </p>
              {targetPortDetails && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Port:</span> {targetPortDetails.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Type:</span> {targetPortDetails.data_type}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* データ型詳細 */}
      {(sourcePortDetails || targetPortDetails) && (
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
                { label: "Source Process", value: sourceProcess?.name },
                { label: "Source Port", value: sourcePortDetails?.name },
                { label: "Data Type", value: sourcePortDetails?.data_type || targetPortDetails?.data_type },
                { label: "Target Process", value: targetProcess?.name },
                { label: "Target Port", value: targetPortDetails?.name },
              ].filter(item => item.value).map((item, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">{item.label}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
