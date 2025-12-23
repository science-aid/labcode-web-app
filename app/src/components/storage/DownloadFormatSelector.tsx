/**
 * DownloadFormatSelector - ダウンロード形式選択コンポーネント
 *
 * Storage BrowserでRun単位のダウンロード形式を選択する。
 * - Metadata Dump (.db): SQLite形式のメタデータ
 * - ZIP Archive: Storage Browser相当のフォルダ構成
 */

import React, { useState, useRef, useEffect } from 'react';
import { Download, Database, FolderArchive, ChevronDown, Loader2 } from 'lucide-react';
import { downloadRunsAsZipV2 } from '../../api/api';

type DownloadFormat = 'db' | 'zip';

interface DownloadFormatSelectorProps {
  runId: number;
  disabled?: boolean;
}

export const DownloadFormatSelector: React.FC<DownloadFormatSelectorProps> = ({
  runId,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // クリック外でドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownload = async (format: DownloadFormat) => {
    setIsOpen(false);
    setDownloading(true);
    setDownloadFormat(format);

    try {
      if (format === 'db') {
        // Metadata Dump (.db)
        const link = document.createElement('a');
        link.href = `/log_server_api/v2/storage/dump/${runId}`;
        link.download = `run_${runId}_dump.db`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // ZIP Archive
        await downloadRunsAsZipV2([runId.toString()]);
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('ダウンロードに失敗しました');
    } finally {
      setDownloading(false);
      setDownloadFormat(null);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || downloading}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          disabled || downloading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {downloading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>ダウンロード中...</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>ダウンロード</span>
            <ChevronDown className="w-4 h-4" />
          </>
        )}
      </button>

      {/* ドロップダウンメニュー */}
      {isOpen && !downloading && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            {/* Metadata Dump オプション */}
            <button
              onClick={() => handleDownload('db')}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-start gap-3"
            >
              <Database className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900">Metadata Dump</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  SQLite形式 (.db) - メタデータのみ
                </div>
              </div>
            </button>

            <div className="border-t border-gray-100" />

            {/* ZIP Archive オプション */}
            <button
              onClick={() => handleDownload('zip')}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-start gap-3"
            >
              <FolderArchive className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900">ZIP Archive</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  フォルダ構成 (.zip) - 全ファイル + メタデータ
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadFormatSelector;
