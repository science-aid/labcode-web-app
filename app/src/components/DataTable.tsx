import React, { useState } from 'react';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { DataItem } from '../types/data';
import { RunStatus } from '../types/data';

interface DataTableProps {
  data: readonly DataItem[];
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
  storage_address?: string | null;
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
  { key: 'storage_address' as const, label: 'storage address' },
  // { key: 'projectId' as const, label: 'プロジェクトID' },
  // { key: 'projectName' as const, label: 'プロジェクト名' },
  // { key: 'id' as const, label: 'ID' },
  // { key: 'protocolName' as const, label: 'プロトコル名' },
  // { key: 'registeredAt' as const, label: '登録日時' },
  // { key: 'startAt' as const, label: '開始日時' },
  // { key: 'endAt' as const, label: '終了日時' },
  // { key: 'status' as const, label: 'ステータス' },
  // { key: 'contentMd5' as const, label: 'Content MD5' },
  // { key: 'protocolUrl' as const, label: 'プロトコルURL' },
];

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [sortField, setSortField] = useState<keyof DataItem>('added_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<Filters>({});

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

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
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
              {/* ★ 新規: Actions ヘッダー */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((item) => (
              <TableRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};