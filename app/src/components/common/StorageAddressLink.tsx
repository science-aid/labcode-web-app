import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, FolderOpen, HardDrive, Cloud, Copy, Check, HelpCircle, Layers } from 'lucide-react';
import { isExternalUrl, getFullStorageAddress, getStorageModeLabel, isStorageModeUnknown } from '../../utils/storageAddress';
import { useStorage } from '../../contexts/StorageContext';

interface StorageAddressLinkProps {
  /** storage_addressの値 */
  address: string | null | undefined;
  /** S3パスクリック時に遷移するRunのID */
  runId?: number | string;
  /** フルパスを表示するか（デフォルト: false） */
  showFullPath?: boolean;
  /** S3パスクリック時のカスタムハンドラ */
  onS3Click?: (address: string) => void;
  /** コピー機能を有効にするか（デフォルト: true） */
  enableCopy?: boolean;
  /** モードバッジを表示するか（デフォルト: true） */
  showModeBadge?: boolean;
  /** Run固有のストレージモード（指定時はこちらを優先） */
  storageMode?: 's3' | 'local' | 'unknown' | null;
  /** ハイブリッドモードかどうか */
  isHybrid?: boolean;
  /** S3パス（ハイブリッド時） */
  s3Path?: string;
  /** ローカルパス（ハイブリッド時） */
  localPath?: string;
}

/**
 * storage_addressを表示するリンクコンポーネント
 *
 * - S3パス: クリック時にコピー、モードバッジ付き
 * - ローカルパス: クリック時にコピー、モードバッジ付き
 * - 外部URL: 新しいタブで開く
 * - 空: 「-」表示、クリック不可
 */
export const StorageAddressLink: React.FC<StorageAddressLinkProps> = ({
  address,
  runId,
  showFullPath = false,
  onS3Click,
  enableCopy = true,
  showModeBadge = true,
  storageMode,
  isHybrid = false,
  s3Path,
  localPath
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [copiedS3, setCopiedS3] = useState(false);
  const [copiedLocal, setCopiedLocal] = useState(false);
  const { storageInfo } = useStorage();

  // Run固有のstorage_modeがあればそれを使用、なければサーバーのモードを使用
  const effectiveMode = storageMode ?? storageInfo?.mode;

  // モードバッジ用の設定
  const modeLabel = getStorageModeLabel(effectiveMode);
  const isS3 = effectiveMode === 's3';
  const isLocal = effectiveMode === 'local';
  const isUnknown = isStorageModeUnknown(effectiveMode);
  const ModeIcon = isS3 ? Cloud : isLocal ? HardDrive : isUnknown ? HelpCircle : FolderOpen;
  const modeBadgeClass = isS3
    ? 'bg-orange-100 text-orange-800'
    : isLocal
    ? 'bg-green-100 text-green-800'
    : isUnknown
    ? 'bg-gray-200 text-gray-600'
    : 'bg-gray-100 text-gray-800';

  // ハイブリッドモードの場合は両方のバッジとアドレスを表示
  if (isHybrid && (s3Path || localPath)) {
    const handleCopyS3 = async (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (s3Path) {
        try {
          await navigator.clipboard.writeText(s3Path);
          setCopiedS3(true);
          setTimeout(() => setCopiedS3(false), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      }
    };

    const handleCopyLocal = async (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (localPath) {
        try {
          await navigator.clipboard.writeText(localPath);
          setCopiedLocal(true);
          setTimeout(() => setCopiedLocal(false), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      }
    };

    return (
      <div className="flex flex-col gap-1">
        {/* Hybridバッジ */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
            <Layers className="w-3 h-3" />
            Hybrid
          </span>
        </div>

        {/* S3アドレス */}
        {s3Path && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
              <Cloud className="w-3 h-3" />
              S3
            </span>
            <button
              onClick={handleCopyS3}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline group text-sm"
              title={`クリックしてコピー: ${s3Path}`}
            >
              <span className="max-w-xs truncate">{showFullPath ? s3Path : 'S3'}</span>
              <span className="transition-opacity">
                {copiedS3 ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                )}
              </span>
            </button>
            {copiedS3 && (
              <span className="text-xs text-green-600 animate-pulse">Copied!</span>
            )}
          </div>
        )}

        {/* ローカルアドレス */}
        {localPath && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              <HardDrive className="w-3 h-3" />
              Local
            </span>
            <button
              onClick={handleCopyLocal}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline group text-sm"
              title={`クリックしてコピー: ${localPath}`}
            >
              <span className="max-w-xs truncate">{showFullPath ? localPath : 'DB'}</span>
              <span className="transition-opacity">
                {copiedLocal ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                )}
              </span>
            </button>
            {copiedLocal && (
              <span className="text-xs text-green-600 animate-pulse">Copied!</span>
            )}
          </div>
        )}
      </div>
    );
  }

  // 空の場合もモードバッジは表示
  if (!address || address.trim() === '') {
    return (
      <div className="flex items-center gap-2">
        {showModeBadge && modeLabel && (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${modeBadgeClass}`}>
            <ModeIcon className="w-3 h-3" />
            {modeLabel}
          </span>
        )}
        <span className="text-gray-400">-</span>
      </div>
    );
  }

  // 外部URLの場合
  if (isExternalUrl(address)) {
    return (
      <a
        href={address}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
      >
        <span>{showFullPath ? address : 'URL'}</span>
        <ExternalLink className="w-4 h-4" />
      </a>
    );
  }

  // 完全なアドレスを生成（Run固有のモードがあればoverride）
  const effectiveStorageInfo = storageMode
    ? {
        ...storageInfo,
        mode: storageMode as 's3' | 'local',
        // ローカルモードの場合、db_pathがなければデフォルト値を設定
        db_path: storageMode === 'local' ? (storageInfo?.db_path || '/data/sql_app.db') : storageInfo?.db_path
      }
    : storageInfo;
  const fullAddress = getFullStorageAddress(address, effectiveStorageInfo);

  // コピー処理
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // 表示用テキスト
  const displayText = showFullPath ? fullAddress : address;

  return (
    <div className="flex items-center gap-2">
      {/* モードバッジ */}
      {showModeBadge && modeLabel && (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${modeBadgeClass}`}>
          <ModeIcon className="w-3 h-3" />
          {modeLabel}
        </span>
      )}

      {/* アドレス表示とコピーボタン */}
      <button
        onClick={enableCopy ? handleCopy : () => {
          if (onS3Click) {
            onS3Click(address);
          } else if (runId) {
            navigate(`/runs/${runId}`);
          }
        }}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline group"
        title={enableCopy ? `クリックしてコピー: ${fullAddress}` : displayText}
      >
        <span className="max-w-xs truncate">{displayText}</span>
        {enableCopy && (
          <span className="transition-opacity">
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 opacity-50 group-hover:opacity-100" />
            )}
          </span>
        )}
      </button>

      {/* コピー成功メッセージ */}
      {copied && (
        <span className="text-xs text-green-600 animate-pulse">
          Copied!
        </span>
      )}
    </div>
  );
};
