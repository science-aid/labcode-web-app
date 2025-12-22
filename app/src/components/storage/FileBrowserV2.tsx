/**
 * FileBrowserV2 - HAL対応ファイルブラウザ
 *
 * Run IDベースでファイル/DBデータを統一的に表示するコンポーネント。
 * S3モードとローカルモードの両方に対応。
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Folder,
  FolderOpen,
  File,
  FileText,
  FileCode,
  Database,
  Download,
  ChevronRight,
  Home,
  X,
  Loader2,
  AlertCircle,
  FolderUp,
  ScrollText,
  Settings,
  BarChart3,
  LineChart,
  AlertTriangle,
} from 'lucide-react';
import { ContentItem, StorageInfoV2 } from '../../types/storage';
import {
  listContents,
  loadContent,
  getDownloadUrl,
  getStorageInfoV2,
} from '../../services/runStorageService';

interface FileBrowserV2Props {
  runId: number;
  initialPath?: string;
  onFileSelect?: (item: ContentItem) => void;
  onPreviewContent?: (content: string, item: ContentItem) => void;
}

export const FileBrowserV2: React.FC<FileBrowserV2Props> = ({
  runId,
  initialPath = '',
  onFileSelect,
  onPreviewContent,
}) => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<ContentItem | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [storageInfo, setStorageInfo] = useState<StorageInfoV2 | null>(null);

  // ファイル一覧を読み込み
  const loadContents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listContents(runId, currentPath);
      // ディレクトリを先に、ファイルを後に並べる
      const sorted = [...result.items].sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        }
        return a.type === 'directory' ? -1 : 1;
      });
      setItems(sorted);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load contents');
    } finally {
      setLoading(false);
    }
  }, [runId, currentPath]);

  useEffect(() => {
    loadContents();
  }, [loadContents]);

  // ストレージ情報を取得
  useEffect(() => {
    const fetchStorageInfo = async () => {
      try {
        const info = await getStorageInfoV2(runId);
        setStorageInfo(info);
      } catch (e) {
        console.error('Failed to fetch storage info:', e);
      }
    };
    fetchStorageInfo();
  }, [runId]);

  // ディレクトリクリック
  const handleDirectoryClick = (item: ContentItem) => {
    setCurrentPath(item.path);
    setPreviewItem(null);
    setPreviewContent(null);
  };

  // ファイルクリック
  const handleFileClick = async (item: ContentItem) => {
    // 外部コールバックを呼び出し（設定されている場合）
    if (onFileSelect) {
      onFileSelect(item);
    }

    // 内部プレビューを表示（常に実行）
    setPreviewItem(item);
    setPreviewLoading(true);
    setPreviewContent(null);

    try {
      const content = await loadContent(runId, item.path);
      setPreviewContent(content);
      if (onPreviewContent) {
        onPreviewContent(content, item);
      }
    } catch (e) {
      setPreviewContent(`Error loading content: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setPreviewLoading(false);
    }
  };

  // ダウンロード
  const handleDownload = async (item: ContentItem) => {
    try {
      const url = await getDownloadUrl(runId, item.path);
      window.open(url, '_blank');
    } catch (e) {
      alert(`Download failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  };

  // 親ディレクトリに移動
  const handleGoUp = () => {
    if (!currentPath) return;
    const parts = currentPath.replace(/\/$/, '').split('/');
    parts.pop();
    const newPath = parts.length > 0 ? parts.join('/') + '/' : '';
    setCurrentPath(newPath);
    setPreviewItem(null);
    setPreviewContent(null);
  };

  // パンくずリスト生成
  const breadcrumbs = currentPath
    ? currentPath.replace(/\/$/, '').split('/').filter(Boolean)
    : [];

  // ファイルサイズをフォーマット
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '-';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let size = bytes;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(1)} ${units[i]}`;
  };

  // ソースに応じたアイコンを取得
  const getSourceIcon = (source: ContentItem['source'], isOpen?: boolean) => {
    const iconClass = "w-5 h-5";
    switch (source) {
      case 'db':
        return <Database className={`${iconClass} text-purple-500`} />;
      case 'file':
        return isOpen
          ? <FolderOpen className={`${iconClass} text-yellow-500`} />
          : <Folder className={`${iconClass} text-yellow-500`} />;
      case 'virtual':
        return isOpen
          ? <FolderOpen className={`${iconClass} text-blue-400`} />
          : <Folder className={`${iconClass} text-blue-400`} />;
      default:
        return <Folder className={`${iconClass} text-gray-400`} />;
    }
  };

  // コンテンツタイプに応じたアイコンを取得
  const getContentTypeIcon = (contentType: string, source: ContentItem['source']) => {
    const iconClass = "w-5 h-5";

    // DBソースの場合は紫色系
    if (source === 'db') {
      switch (contentType) {
        case 'operation_log':
          return <ScrollText className={`${iconClass} text-purple-500`} />;
        default:
          return <FileText className={`${iconClass} text-purple-400`} />;
      }
    }

    // ファイルソースの場合
    switch (contentType) {
      case 'operation_log':
        return <ScrollText className={`${iconClass} text-green-500`} />;
      case 'protocol_yaml':
        return <FileCode className={`${iconClass} text-blue-500`} />;
      case 'manipulate_yaml':
        return <Settings className={`${iconClass} text-orange-500`} />;
      case 'process_data':
        return <BarChart3 className={`${iconClass} text-indigo-500`} />;
      case 'measurement':
        return <LineChart className={`${iconClass} text-teal-500`} />;
      default:
        return <File className={`${iconClass} text-gray-500`} />;
    }
  };

  // ソースバッジを取得
  const getSourceBadge = (source: ContentItem['source']) => {
    switch (source) {
      case 'db':
        return (
          <span className="px-1.5 py-0.5 text-xs rounded bg-purple-100 text-purple-700 font-medium">
            DB
          </span>
        );
      case 'file':
        return (
          <span className="px-1.5 py-0.5 text-xs rounded bg-green-100 text-green-700 font-medium">
            File
          </span>
        );
      case 'virtual':
        return (
          <span className="px-1.5 py-0.5 text-xs rounded bg-blue-100 text-blue-700 font-medium">
            Virtual
          </span>
        );
      default:
        return null;
    }
  };

  // バックエンドバッジを取得
  const getBackendBadge = (backend?: ContentItem['backend']) => {
    if (!backend) return null;
    switch (backend) {
      case 's3':
        return (
          <span className="px-1.5 py-0.5 text-xs rounded bg-orange-100 text-orange-700 font-medium">
            S3
          </span>
        );
      case 'local':
        return (
          <span className="px-1.5 py-0.5 text-xs rounded bg-teal-100 text-teal-700 font-medium">
            Local
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b flex items-center gap-3">
        <Folder className="w-5 h-5 text-blue-500" />
        <span className="text-sm font-semibold text-gray-700">Storage Browser</span>
        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
          Run #{runId}
        </span>
      </div>

      {/* ストレージ情報警告 */}
      {storageInfo?.warning && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center gap-2 text-sm text-yellow-700">
          <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          <span>{storageInfo.warning}</span>
        </div>
      )}

      {/* パンくずリスト */}
      <div className="px-4 py-2 bg-gray-50 border-b flex items-center gap-1 text-sm">
        <button
          onClick={() => { setCurrentPath(''); setPreviewItem(null); setPreviewContent(null); }}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Root</span>
        </button>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <button
              onClick={() => {
                const newPath = breadcrumbs.slice(0, index + 1).join('/') + '/';
                setCurrentPath(newPath);
                setPreviewItem(null);
                setPreviewContent(null);
              }}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              {crumb}
            </button>
          </React.Fragment>
        ))}
      </div>

      <div className="flex">
        {/* ファイル一覧 */}
        <div className={`${previewItem ? 'w-1/2' : 'w-full'} ${previewItem ? 'border-r' : ''}`}>
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
              <span className="text-gray-500 text-sm">Loading contents...</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <span className="text-red-500 text-sm">{error}</span>
            </div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center">
              <Folder className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <span className="text-gray-500 text-sm">No files in this directory</span>
            </div>
          ) : (
            <div className="divide-y max-h-96 overflow-y-auto">
              {/* 親ディレクトリへ */}
              {currentPath && (
                <div
                  onClick={handleGoUp}
                  className="px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <FolderUp className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <span className="text-gray-600 group-hover:text-gray-900">..</span>
                </div>
              )}

              {/* ファイル/ディレクトリ一覧 */}
              {items.map((item) => (
                <div
                  key={item.path}
                  onClick={() =>
                    item.type === 'directory'
                      ? handleDirectoryClick(item)
                      : handleFileClick(item)
                  }
                  className={`px-4 py-2.5 flex items-center gap-3 cursor-pointer transition-colors group ${
                    previewItem?.path === item.path
                      ? 'bg-blue-50 border-l-2 border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {/* アイコン */}
                  <div className="flex-shrink-0">
                    {item.type === 'directory'
                      ? getSourceIcon(item.source, currentPath.startsWith(item.path))
                      : getContentTypeIcon(item.contentType, item.source)}
                  </div>

                  {/* ファイル名とメタ情報 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-gray-800 group-hover:text-gray-900">
                        {item.name}
                      </span>
                      {getSourceBadge(item.source)}
                      {getBackendBadge(item.backend)}
                    </div>
                    {item.type === 'file' && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        {formatSize(item.size)}
                      </div>
                    )}
                  </div>

                  {/* ダウンロードボタン */}
                  {item.type === 'file' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(item);
                      }}
                      className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* プレビューパネル */}
        {previewItem && (
          <div className="w-1/2 bg-gray-50 flex flex-col">
            <div className="px-4 py-2.5 border-b bg-white flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                {getContentTypeIcon(previewItem.contentType, previewItem.source)}
                <span className="text-sm font-medium truncate text-gray-800">{previewItem.name}</span>
                {getSourceBadge(previewItem.source)}
                {getBackendBadge(previewItem.backend)}
              </div>
              <button
                onClick={() => { setPreviewItem(null); setPreviewContent(null); }}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto max-h-80">
              {previewLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  <span className="ml-2 text-gray-500 text-sm">Loading preview...</span>
                </div>
              ) : previewContent ? (
                <pre className="text-xs whitespace-pre-wrap font-mono bg-white p-3 rounded-lg border shadow-inner text-gray-700 leading-relaxed">
                  {previewContent}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <File className="w-6 h-6 mr-2" />
                  <span className="text-sm">No preview available</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileBrowserV2;
