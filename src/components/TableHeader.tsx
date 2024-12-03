import React from 'react';
import { ArrowUpDown, ChevronUp, ChevronDown, Search } from 'lucide-react';
import { Status } from '../types/data';

interface Column {
  key: keyof DataItem;
  label: string;
}

interface DataItem {
  id: string;
  registeredAt: string;
  startAt: string;
  endAt: string;
  status: Status;
}

interface TableHeaderProps {
  column: Column;
  sortField: keyof DataItem;
  sortDirection: 'asc' | 'desc';
  filterValue: string;
  onSort: (field: keyof DataItem) => void;
  onFilterChange: (value: string) => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  column,
  sortField,
  sortDirection,
  filterValue,
  onSort,
  onFilterChange,
}) => {
  const isCurrentSort = sortField === column.key;
  const headerClasses = `
    text-xs font-medium uppercase tracking-wider cursor-pointer
    transition-colors flex items-center gap-2 px-2 py-1.5 rounded
    ${isCurrentSort ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}
  `;

  return (
    <th scope="col" className="px-6 py-3 text-left">
      <div className="space-y-2">
        <div className={headerClasses} onClick={() => onSort(column.key)}>
          {column.label}
          {isCurrentSort ? (
            sortDirection === 'asc' ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )
          ) : (
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            placeholder={`${column.label}を検索...`}
            className="w-full text-sm border border-gray-300 rounded-md px-3 py-1 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>
    </th>
  );
};