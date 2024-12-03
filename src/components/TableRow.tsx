import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { formatDateTime } from '../utils/dateFormatter';
import { DataItem } from '../types/data';

interface TableRowProps {
  item: DataItem;
}

export const TableRow: React.FC<TableRowProps> = ({ item }) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800">
        <Link to={`/protocols/${item.id}`} className="hover:underline">
          {item.id}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDateTime(item.registeredAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDateTime(item.startAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDateTime(item.endAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={item.status} />
      </td>
    </tr>
  );
};