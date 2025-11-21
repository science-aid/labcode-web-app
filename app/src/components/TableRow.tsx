import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { formatDateTime } from '../utils/dateFormatter';
import { DataItem } from '../types/data';
import { ExternalLink } from 'lucide-react';

interface TableRowProps {
  item: DataItem;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export const TableRow: React.FC<TableRowProps> = ({ item, selected, onSelect }) => {
  const navigate = useNavigate();

  const handleViewOperations = () => {
    navigate(`/operations?run_id=${item.id}`);
  };

  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' || // checkbox
      target.tagName === 'BUTTON' || // View Operations button
      target.tagName === 'A' || // external link
      target.closest('a') || // clicked inside a link
      target.closest('button') // clicked inside a button
    ) {
      return;
    }
    navigate(`/runs/${item.id}`);
  };

  // Determine background color based on selection and visibility
  const getRowClassName = () => {
    if (selected) return 'bg-blue-50 cursor-pointer';
    if (!item.display_visible) return 'bg-gray-100 hover:bg-blue-100 transition-colors cursor-pointer';
    return 'hover:bg-blue-50 transition-colors cursor-pointer';
  };

  return (
    <tr className={getRowClassName()} onClick={handleRowClick}>
      {onSelect && (
        <td className="px-6 py-4">
          <input
            type="checkbox"
            checked={selected || false}
            onChange={() => onSelect(item.id)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </td>
      )}

      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800">
        <Link to={`/runs/${item.id}`} className="hover:underline">
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
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <button
          onClick={handleViewOperations}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          View Operations
        </button>
      </td>
    </tr>
  );
}