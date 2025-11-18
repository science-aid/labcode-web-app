import React from 'react';
import { ArrowUpDown, ChevronUp, ChevronDown, Search } from 'lucide-react';

// Generic TableHeader component that works with any data type
interface TableHeaderProps<T> {
  column: { key: keyof T; label: string };
  sortField: keyof T;
  sortDirection: 'asc' | 'desc';
  filterValue: string;
  onSort: (field: keyof T) => void;
  onFilterChange: (value: string) => void;
}

// Helper function to get placeholder examples for different column types
const getPlaceholderExample = (columnKey: string): string => {
  const examples: Record<string, string> = {
    id: '1',
    name: 'process name',
    status: 'completed',
    process_id: '65',
    run_id: '10',
    added_at: '2024/01/15',
    started_at: '2024/01/15',
    finished_at: '2024/01/15',
    storage_address: '/path/to/storage',
    is_transport: 'Yes',
    is_data: 'No'
  };
  return examples[columnKey] || 'search...';
}; 

export const TableHeader = <T,>({
  column,
  sortField,
  sortDirection,
  filterValue,
  onSort,
  onFilterChange,
}: TableHeaderProps<T>) => {
  // デバッグログ: filterValueの受け取り確認
  if (column.key === 'process_id' || column.key === 'run_id') {
    console.log(`[TableHeader] Rendering ${column.key} with filterValue:`, filterValue, 'type:', typeof filterValue);
  }

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
            placeholder={`e.g., ${getPlaceholderExample(column.key as string)}`}
            className="w-full text-sm border border-gray-300 rounded-md px-3 py-1 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>
    </th>
  );
};