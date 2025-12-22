import React, { useState, useEffect, useCallback } from 'react';
import {
  Folder,
  File,
  Eye,
  Download,
  ChevronRight,
  Home,
  ArrowUp,
  ArrowDown,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { fetchStorageList, fetchStorageDownloadUrl } from '../../api/api';
import { FileItem, DirectoryItem, SortBy, SortOrder } from '../../types/storage';

interface FileBrowserProps {
  /** 初期パス（S3プレフィックス） */
  initialPath: string;
  /** ファイル選択時のコールバック */
  onFileSelect?: (file: FileItem) => void;
  /** ダウンロードボタン表示 */
  showDownload?: boolean;
  /** プレビューボタン表示 */
  showPreview?: boolean;
}

/**
 * S3ストレージ内のファイル・フォルダを表示するブラウザコンポーネント
 */
export const FileBrowser: React.FC<FileBrowserProps> = ({
  initialPath,
  onFileSelect,
  showDownload = true,
  showPreview = true,
}) => {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [directories, setDirectories] = useState<DirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ファイル一覧を取得
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchStorageList(currentPath, sortBy, sortOrder, page);
      setFiles(response.files);
      setDirectories(response.directories);
      setTotalPages(response.pagination.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ファイル一覧の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [currentPath, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // ディレクトリクリック
  const handleDirectoryClick = (path: string) => {
    setCurrentPath(path);
    setPage(1);
  };

  // プレビュークリック
  const handlePreviewClick = (file: FileItem) => {
    onFileSelect?.(file);
  };

  // ダウンロードクリック
  const handleDownloadClick = async (file: FileItem) => {
    try {
      const response = await fetchStorageDownloadUrl(file.path);
      window.open(response.download_url, '_blank');
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  // ソートクリック
  const handleSortClick = (column: SortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setPage(1);
  };

  // パンくずリストの生成
  const breadcrumbs = currentPath.split('/').filter(Boolean);

  // サイズのフォーマット
  const formatSize = (bytes: number | null): string => {
    if (bytes === null) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // 日付のフォーマット
  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ソートアイコン
  const SortIcon: React.FC<{ column: SortBy }> = ({ column }) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-4 h-4 ml-1 inline" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1 inline" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">読み込み中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <span className="ml-2 text-red-600">{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* パンくずリスト */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <button
            onClick={() => {
              setCurrentPath('');
              setPage(1);
            }}
            className="flex items-center hover:text-blue-600 transition-colors"
          >
            <Home className="w-4 h-4" />
          </button>
          {breadcrumbs.map((crumb, index) => {
            const path = breadcrumbs.slice(0, index + 1).join('/') + '/';
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={path}>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                {isLast ? (
                  <span className="font-medium text-gray-900">{crumb}</span>
                ) : (
                  <button
                    onClick={() => handleDirectoryClick(path)}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {crumb}
                  </button>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* ファイル一覧テーブル */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                Type
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSortClick('name')}
              >
                Name
                <SortIcon column="name" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSortClick('size')}
              >
                Size
                <SortIcon column="size" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSortClick('last_modified')}
              >
                Last Modified
                <SortIcon column="last_modified" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* ディレクトリ */}
            {directories.map((dir) => (
              <tr
                key={dir.path}
                onClick={() => handleDirectoryClick(dir.path)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <Folder className="w-5 h-5 text-yellow-500" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {dir.name}/
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </td>
              </tr>
            ))}
            {/* ファイル */}
            {files.map((file) => (
              <tr
                key={file.path}
                onClick={() => handlePreviewClick(file)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <File className="w-5 h-5 text-gray-400" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {file.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatSize(file.size)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(file.last_modified)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    {showPreview && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviewClick(file);
                        }}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-5 h-5 text-blue-600" />
                      </button>
                    )}
                    {showDownload && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadClick(file);
                        }}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5 text-green-600" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {/* 空の場合 */}
            {files.length === 0 && directories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  このディレクトリにファイルはありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
