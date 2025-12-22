/**
 * StorageModeBadge - ストレージモードを表示するバッジコンポーネント
 *
 * 新しいストレージタイプを追加する場合:
 * 1. STORAGE_CONFIG オブジェクトに新しいエントリを追加
 * 2. バックエンドの StorageMode enum と同期させる
 */

import React from 'react';
import { Cloud, HardDrive, Layers, HelpCircle, Server, Database } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

/** ストレージモードの設定 */
interface StorageModeConfig {
  label: string;
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
}

/**
 * ストレージモード設定
 *
 * 新しいストレージタイプを追加する場合は、ここにエントリを追加してください。
 * 例: 'azure': { label: 'Azure', icon: Cloud, bgColor: 'bg-blue-100', textColor: 'text-blue-800' }
 */
const STORAGE_CONFIG: Record<string, StorageModeConfig> = {
  s3: {
    label: 'S3',
    icon: Cloud,
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
  },
  local: {
    label: 'Local',
    icon: HardDrive,
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
  },
  hybrid: {
    label: 'Hybrid',
    icon: Layers,
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
  },
  unknown: {
    label: 'Unknown',
    icon: HelpCircle,
    bgColor: 'bg-gray-200',
    textColor: 'text-gray-600',
  },
  // 新しいストレージタイプの例（コメントアウト）
  // azure: {
  //   label: 'Azure',
  //   icon: Cloud,
  //   bgColor: 'bg-blue-100',
  //   textColor: 'text-blue-800',
  // },
  // gcs: {
  //   label: 'GCS',
  //   icon: Cloud,
  //   bgColor: 'bg-red-100',
  //   textColor: 'text-red-800',
  // },
};

interface StorageModeBadgeProps {
  /** ストレージモード ('s3', 'local', 'hybrid', 'unknown', または null/undefined) */
  mode: string | null | undefined;
  /** サイズ（デフォルト: 'md'） */
  size?: 'sm' | 'md' | 'lg';
  /** アイコンを表示するか（デフォルト: true） */
  showIcon?: boolean;
}

/**
 * ストレージモードを表示するバッジコンポーネント
 *
 * S3、Local、Hybrid、Unknown などのモードをビジュアル的に区別できるバッジとして表示します。
 */
export const StorageModeBadge: React.FC<StorageModeBadgeProps> = ({
  mode,
  size = 'md',
  showIcon = true,
}) => {
  // モードに対応する設定を取得（未知のモードはunknown扱い）
  const normalizedMode = mode?.toLowerCase() || 'unknown';
  const config = STORAGE_CONFIG[normalizedMode] || STORAGE_CONFIG.unknown;
  const Icon = config.icon;

  // サイズに応じたスタイル
  const sizeClasses = {
    sm: {
      badge: 'px-1.5 py-0.5 text-xs',
      icon: 'w-3 h-3',
    },
    md: {
      badge: 'px-2 py-0.5 text-xs',
      icon: 'w-3.5 h-3.5',
    },
    lg: {
      badge: 'px-2.5 py-1 text-sm',
      icon: 'w-4 h-4',
    },
  };

  const classes = sizeClasses[size];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded font-medium ${config.bgColor} ${config.textColor} ${classes.badge}`}
    >
      {showIcon && <Icon className={classes.icon} />}
      {config.label}
    </span>
  );
};

/**
 * ストレージモードのリストを取得
 *
 * フィルターやドロップダウンで使用する場合に便利です。
 */
export const getStorageModes = (): Array<{ value: string; label: string }> => {
  return Object.entries(STORAGE_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  }));
};

/**
 * ストレージモードが有効かどうかをチェック
 */
export const isValidStorageMode = (mode: string | null | undefined): boolean => {
  if (!mode) return false;
  return mode.toLowerCase() in STORAGE_CONFIG;
};

export default StorageModeBadge;
