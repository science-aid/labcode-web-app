import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  X,
  Copy,
  Download,
  Loader2,
  AlertCircle,
  Check,
  AlertTriangle
} from 'lucide-react';
import { fetchStoragePreview, fetchStorageDownloadUrl } from '../../api/api';
import { StoragePreviewResponse } from '../../types/storage';

interface FilePreviewProps {
  /** ファイルパス（S3キー） */
  filePath: string;
  /** ファイル名（表示用） */
  fileName: string;
  /** モーダル開閉状態 */
  open: boolean;
  /** 閉じるコールバック */
  onClose: () => void;
}

/**
 * テキストファイルのプレビューをモーダルダイアログで表示するコンポーネント
 */
export const FilePreview: React.FC<FilePreviewProps> = ({
  filePath,
  fileName,
  open,
  onClose,
}) => {
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<'text' | 'json' | 'yaml' | 'binary'>('text');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [truncated, setTruncated] = useState(false);
  const [copied, setCopied] = useState(false);

  // プレビューを取得
  useEffect(() => {
    if (open && filePath) {
      const fetchPreview = async () => {
        setLoading(true);
        setError(null);
        try {
          const response: StoragePreviewResponse = await fetchStoragePreview(filePath);
          setContent(response.content);
          setContentType(response.content_type);
          setTruncated(response.truncated);
        } catch (err) {
          if (err instanceof Error) {
            // バイナリファイルの場合
            if (err.message.includes('Binary') || err.message.includes('415')) {
              setError('このファイル形式はプレビューできません。ダウンロードしてください。');
            } else {
              setError(err.message);
            }
          } else {
            setError('ファイルのプレビューに失敗しました');
          }
        } finally {
          setLoading(false);
        }
      };
      fetchPreview();
    }
  }, [open, filePath]);

  // コピー
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // ダウンロード
  const handleDownload = async () => {
    try {
      const response = await fetchStorageDownloadUrl(filePath);
      window.open(response.download_url, '_blank');
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  // シンタックスハイライトの言語を取得
  const getLanguage = (): string => {
    switch (contentType) {
      case 'json':
        return 'json';
      case 'yaml':
        return 'yaml';
      default:
        return 'text';
    }
  };

  // モーダル外クリックで閉じる
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ESCキーで閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col mx-4">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 truncate pr-4">
            {fileName}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Close"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600">読み込み中...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-12">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <span className="ml-2 text-red-600">{error}</span>
            </div>
          )}

          {!loading && !error && (
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <SyntaxHighlighter
                language={getLanguage()}
                style={tomorrow}
                showLineNumbers
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  maxHeight: '60vh',
                  fontSize: '0.875rem',
                }}
                lineNumberStyle={{
                  minWidth: '3em',
                  paddingRight: '1em',
                  color: '#6b7280',
                }}
              >
                {content}
              </SyntaxHighlighter>
            </div>
          )}

          {/* 切り詰め警告 */}
          {truncated && (
            <div className="flex items-center mt-4 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="ml-2 text-sm text-yellow-700">
                ファイルが大きいため、1000行までの表示です。完全な内容はダウンロードしてください。
              </span>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            {contentType.toUpperCase()} file
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleCopy}
              disabled={loading || !!error}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  コピーしました
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  コピー
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              ダウンロード
            </button>
            <button
              onClick={onClose}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
