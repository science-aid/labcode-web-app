import React, { useState } from 'react';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { DataItem } from '../types/data';

interface DataTableProps {
  data: DataItem[];
}

interface Filters {
  projectId: string;
  projectName: string;
  id: string;
  protocolName: string;
  registeredAt: string;
  startAt: string;
  endAt: string;
  status: string;
  contentMd5: string;
  protocolUrl: string;
}

const columns = [
  { key: 'projectId' as const, label: 'プロジェクトID' },
  { key: 'projectName' as const, label: 'プロジェクト名' },
  { key: 'id' as const, label: 'ID' },
  { key: 'protocolName' as const, label: 'プロトコル名' },
  { key: 'registeredAt' as const, label: '登録日時' },
  { key: 'startAt' as const, label: '開始日時' },
  { key: 'endAt' as const, label: '終了日時' },
  { key: 'status' as const, label: 'ステータス' },
  { key: 'contentMd5' as const, label: 'Content MD5' },
  { key: 'protocolUrl' as const, label: 'プロトコルURL' },
];

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [sortField, setSortField] = useState<keyof DataItem>('registeredAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<Filters>({
    projectId: '',
    projectName: '',
    id: '',
    protocolName: '',
    registeredAt: '',
    startAt: '',
    endAt: '',
    status: '',
    contentMd5: '',
    protocolUrl: '',
  });

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