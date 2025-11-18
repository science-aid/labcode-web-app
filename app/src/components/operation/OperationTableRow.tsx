import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../StatusBadge';
import { OperationDataItem } from '../../types/operation';
import { formatDateTime } from '../../utils/dateFormatter';

interface OperationTableRowProps {
  item: OperationDataItem;
}

export const OperationTableRow: React.FC<OperationTableRowProps> = ({ item }) => {
  const navigate = useNavigate();

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {item.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {item.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={item.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <button
          onClick={() => navigate(`/runs/${item.run_id}/processes?process_id=${item.process_id}`)}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {item.process_id}
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <button
          onClick={() => navigate(`/protocol_list`)}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {item.run_id}
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {item.started_at ? formatDateTime(item.started_at) : 'Not started'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {item.finished_at ? formatDateTime(item.finished_at) : 'Not finished'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {item.storage_address}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {item.is_transport ? 'Yes' : 'No'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {item.is_data ? 'Yes' : 'No'}
      </td>
    </tr>
  );
};
