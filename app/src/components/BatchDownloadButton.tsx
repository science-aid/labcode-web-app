import React, { useState } from 'react';
import { Download, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { downloadRunsAsZip, estimateBatchDownload, APIError, BatchDownloadEstimate } from '../api/api';

type DownloadStatus = 'idle' | 'estimating' | 'confirming' | 'downloading' | 'completed' | 'error';

interface BatchDownloadButtonProps {
  /** 選択されたランIDリスト */
  selectedRunIds: string[];
  /** 処理中フラグ（親コンポーネントの状態） */
  isProcessing?: boolean;
  /** ダウンロード開始コールバック */
  onDownloadStart?: () => void;
  /** ダウンロード完了コールバック */
  onDownloadComplete?: () => void;
  /** ダウンロードエラーコールバック */
  onDownloadError?: (error: Error) => void;
}

/**
 * 複数ランの一括ダウンロードボタンコンポーネント
 *
 * Phase A (MVP): 基本的なダウンロードボタン
 * Phase B: 確認ダイアログ、進捗表示を追加予定
 */
export const BatchDownloadButton: React.FC<BatchDownloadButtonProps> = ({
  selectedRunIds,
  isProcessing = false,
  onDownloadStart,
  onDownloadComplete,
  onDownloadError,
}) => {
  const [status, setStatus] = useState<DownloadStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<BatchDownloadEstimate | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // ダウンロードが有効かどうか
  const canDownload = selectedRunIds.length > 0 && !isProcessing && status === 'idle';

  // 5件以上の場合は確認ダイアログを表示
  const needsConfirmation = selectedRunIds.length >= 5;

  const handleClick = async () => {
    if (!canDownload) return;

    // Phase B: 確認ダイアログ対応
    if (needsConfirmation) {
      setStatus('estimating');
      try {
        const estimateResult = await estimateBatchDownload(selectedRunIds);
        setEstimate(estimateResult);

        if (!estimateResult.can_download) {
          setStatus('error');
          setErrorMessage(estimateResult.message || 'ダウンロードサイズが上限を超えています');
          return;
        }

        setShowConfirmDialog(true);
        setStatus('confirming');
      } catch (err) {
        handleError(err);
      }
      return;
    }

    // 直接ダウンロード
    await executeDownload();
  };

  const executeDownload = async () => {
    setStatus('downloading');
    setErrorMessage(null);
    onDownloadStart?.();

    try {
      await downloadRunsAsZip(selectedRunIds);
      setStatus('completed');
      onDownloadComplete?.();

      // 3秒後にアイドル状態に戻す
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (err: unknown) => {
    setStatus('error');
    let message = 'ダウンロードに失敗しました';

    if (err instanceof APIError) {
      switch (err.status) {
        case 400:
          message = 'ランが選択されていません';
          break;
        case 404:
          message = '選択したランが見つかりません';
          break;
        case 413:
          message = 'ダウンロードサイズが上限を超えています';
          break;
        case 503:
          message = 'ストレージに接続できません';
          break;
        default:
          message = err.message || message;
      }
    }

    setErrorMessage(message);
    onDownloadError?.(err instanceof Error ? err : new Error(message));
  };

  const handleConfirm = () => {
    setShowConfirmDialog(false);
    executeDownload();
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    setStatus('idle');
    setEstimate(null);
  };

  const handleRetry = () => {
    setStatus('idle');
    setErrorMessage(null);
    handleClick();
  };

  // ボタンの状態に応じたレンダリング
  const renderButton = () => {
    switch (status) {
      case 'estimating':
        return (
          <button
            disabled
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
          >
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            推定中...
          </button>
        );

      case 'downloading':
        return (
          <button
            disabled
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-400 rounded-md cursor-not-allowed"
          >
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ダウンロード中...
          </button>
        );

      case 'completed':
        return (
          <button
            disabled
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            完了
          </button>
        );

      case 'error':
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRetry}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              リトライ
            </button>
            {errorMessage && (
              <span className="text-sm text-red-600">{errorMessage}</span>
            )}
          </div>
        );

      default:
        return (
          <button
            onClick={handleClick}
            disabled={!canDownload}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              canDownload
                ? 'text-white bg-blue-600 hover:bg-blue-700'
                : 'text-gray-400 bg-gray-200 cursor-not-allowed'
            }`}
          >
            <Download className="w-4 h-4 mr-2" />
            選択したランをダウンロード ({selectedRunIds.length}件)
          </button>
        );
    }
  };

  return (
    <>
      {renderButton()}

      {/* Phase B: 確認ダイアログ */}
      {showConfirmDialog && estimate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                ダウンロード確認
              </h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-700 mb-4">
                {estimate.run_count}件のランをダウンロードします。
              </p>
              <p className="text-sm text-gray-500 mb-2">
                推定サイズ: 約 {estimate.estimated_size_mb.toFixed(1)}MB
              </p>
              <p className="text-sm text-gray-500">
                ファイルサイズによっては時間がかかる場合があります。
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                ダウンロード
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
