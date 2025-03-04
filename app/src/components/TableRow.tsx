import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { formatDateTime } from '../utils/dateFormatter';
import { DataItem } from '../types/data';
import { ExternalLink } from 'lucide-react';

interface TableRowProps {
  item: DataItem;
}

export const TableRow: React.FC<TableRowProps> = ({ item }) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800">
        <Link to={`/protocol_list/${item.id}`} className="hover:underline">
        {item.id}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {item.project_id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {item.project_name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {item.file_name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {item.user_id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDateTime(item.added_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {item.started_at === null ? '' : formatDateTime(item.started_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {item.finished_at === null ? '' : formatDateTime(item.finished_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={item.status} />
      </td>
      {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
        {item.storage_address}
      </td> */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <a
          href={item.storage_address}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
        >
          <span>URL</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </td>
    </tr>
  );
}