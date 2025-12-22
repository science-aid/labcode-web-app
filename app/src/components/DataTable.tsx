import React, { useState, useEffect } from 'react';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { DataItem } from '../types/data';
import { RunStatus } from '../types/data';

interface DataTableProps {
  data: readonly DataItem[];
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}


interface Filters {
  id?: number | null;
  project_id?: number | null;
  project_name?: string | null;
  file_name?: string | null;
  user_id?: number | null;
  added_at?: string | null;
  started_at?: string | null;
  finished_at?: string | null;
  status?: RunStatus;
  storage_mode?: string | null;
}
// interface Filters {
//   id: number;
//   project_id: number;
//   project_name: string;
//   protocol_id: number;
//   user_id: number;
//   added_at: string;      // ISO 8601形式の日時文字列
//   started_at: string | null;
//   finished_at: string | null;
//   status: RunStatus;
//   storage_address: string;
// }

const columns = [
  { key: 'id' as const, label: 'Run ID' },
  { key: 'project_id' as const, label: 'Project ID' },
  { key: 'project_name' as const, label: 'Project name' },
  { key: 'file_name' as const, label: 'protocol name' },
  { key: 'user_id' as const, label: 'user ID' },
  { key: 'added_at' as const, label: 'Add datetime' },
  { key: 'started_at' as const, label: 'Start datetime' },
  { key: 'finished_at' as const, label: 'finish datetime' },
  { key: 'status' as const, label: 'status' },
  { key: 'storage_mode' as const, label: 'Storage' },
];

export const DataTable: React.FC<DataTableProps> = ({
  data,
  selectedIds = [],
  onSelectionChange
}) => {
  const [sortField, setSortField] = useState<keyof DataItem>('added_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<Filters>({});

  const [internalSelected, setInternalSelected] = useState<Set<string>>(
    new Set(selectedIds)
  );

  // Sync internal selection state when parent's selectedIds changes
  useEffect(() => {
    setInternalSelected(new Set(selectedIds));
  }, [selectedIds]);

  const handleSort = (field: keyof DataItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredData = data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      const itemValue = item[key as keyof DataItem].toString().toLowerCase();
      return itemValue.includes(value.toLowerCase());
    });
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : 1;
    } else {
      return aValue > bValue ? -1 : 1;
    }
  });

  const handleToggleRow = (id: string) => {
    const newSelected = new Set(internalSelected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setInternalSelected(newSelected);
    onSelectionChange?.(Array.from(newSelected));
  };

  const handleSelectAll = () => {
    const allIds = new Set(sortedData.map(item => item.id));
    setInternalSelected(allIds);
    onSelectionChange?.(Array.from(allIds));
  };

  const handleDeselectAll = () => {
    setInternalSelected(new Set());
    onSelectionChange?.([]);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {onSelectionChange && (
                <th scope="col" className="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={internalSelected.size === sortedData.length && sortedData.length > 0}
                    onChange={(e) => e.target.checked ? handleSelectAll() : handleDeselectAll()}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </th>
              )}

              {columns.map((column) => (
                <TableHeader
                  key={column.key}
                  column={column}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  filterValue={filters[column.key]}
                  onSort={handleSort}
                  onFilterChange={(value) => handleFilterChange(column.key, value)}
                />
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((item) => (
              <TableRow
                key={item.id}
                item={item}
                selected={onSelectionChange ? internalSelected.has(item.id) : undefined}
                onSelect={onSelectionChange ? handleToggleRow : undefined}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};