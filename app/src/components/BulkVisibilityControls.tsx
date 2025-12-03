import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface BulkVisibilityControlsProps {
  selectedCount: number;
  onShowSelected: () => void;
  onHideSelected: () => void;
  isProcessing: boolean;
}

/**
 * 選択されたランの一括表示・非表示切り替えコンポーネント
 *
 * 選択されたランに対して、表示または非表示を一括適用するボタンを提供します。
 */
export const BulkVisibilityControls: React.FC<BulkVisibilityControlsProps> = ({
  selectedCount,
  onShowSelected,
  onHideSelected,
  isProcessing
}) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between bg-amber-50 p-3 rounded-lg mb-4 border border-amber-200">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">
          {selectedCount} 件のランを選択中
        </span>
        <div className="flex space-x-2">
          <button
            onClick={onShowSelected}
            disabled={isProcessing}
            className={`flex items-center space-x-1 px-3 py-1.5 text-sm font-medium rounded-md ${
              isProcessing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>表示</span>
          </button>
          <button
            onClick={onHideSelected}
            disabled={isProcessing}
            className={`flex items-center space-x-1 px-3 py-1.5 text-sm font-medium rounded-md ${
              isProcessing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
            }`}
          >
            <EyeOff className="w-4 h-4" />
            <span>非表示</span>
          </button>
        </div>
      </div>
    </div>
  );
};
