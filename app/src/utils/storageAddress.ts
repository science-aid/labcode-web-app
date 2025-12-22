/**
 * storage_address判定ユーティリティ
 *
 * storage_addressの値がS3パスか外部URLかを判定するための関数群
 */

import { StorageInfoResponse } from '../api/api';

/**
 * storage_addressが外部URLかどうかを判定
 * @param address storage_addressの値
 * @returns true: 外部URL, false: S3パスまたは空
 */
export const isExternalUrl = (address: string | null | undefined): boolean => {
  if (!address) return false;
  return address.startsWith('http://') || address.startsWith('https://');
};

/**
 * storage_addressの種類
 */
export type StorageAddressType = 'external_url' | 's3_path' | 'local_path' | 'empty';

/**
 * storage_addressの種類を取得
 * @param address storage_addressの値
 * @param storageMode ストレージモード（'s3' or 'local'）
 * @returns StorageAddressType
 */
export const getStorageAddressType = (
  address: string | null | undefined,
  storageMode?: 's3' | 'local'
): StorageAddressType => {
  if (!address || address.trim() === '') return 'empty';
  if (isExternalUrl(address)) return 'external_url';
  if (storageMode === 'local') return 'local_path';
  return 's3_path';
};

/**
 * 完全なストレージアドレスを生成
 * @param address 相対パス（例: runs/1/）
 * @param storageInfo ストレージ情報
 * @returns 完全なアドレス（S3 URI または SQLファイルパス）
 */
export const getFullStorageAddress = (
  address: string | null | undefined,
  storageInfo: StorageInfoResponse | null
): string => {
  if (!address || address.trim() === '') return '';
  if (isExternalUrl(address)) return address;

  if (!storageInfo) return address;

  if (storageInfo.mode === 's3' && storageInfo.bucket_name) {
    // S3 URIを生成: s3://bucket-name/path
    return `s3://${storageInfo.bucket_name}/${address}`;
  } else if (storageInfo.mode === 'local') {
    // ローカルモードではSQLファイルのパスを返す
    return storageInfo.db_path || '/data/sql_app.db';
  }

  return address;
};

/**
 * ストレージモードのラベルを取得
 * @param mode ストレージモード
 * @returns 表示用ラベル
 */
export const getStorageModeLabel = (mode: 's3' | 'local' | 'unknown' | null | undefined): string => {
  if (mode === 's3') return 'S3';
  if (mode === 'local') return 'Local';
  if (mode === 'unknown' || mode === null) return 'Unknown';
  return '';
};

/**
 * ストレージモードがUnknownかどうかを判定
 * @param mode ストレージモード
 * @returns true: Unknown (null含む)
 */
export const isStorageModeUnknown = (mode: string | null | undefined): boolean => {
  return mode === 'unknown' || mode === null || mode === undefined;
};
