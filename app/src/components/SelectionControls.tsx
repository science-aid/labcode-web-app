import React from 'react';

interface SelectionControlsProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

/**
 * 複数選択操作用コンポーネント
 *
 * 選択数の表示と、全選択・全解除のボタンを提供します。
 */
export const SelectionControls: React.FC<SelectionControlsProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll
}) => {
  return (
    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg mb-4">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">
          {selectedCount} / {totalCount} 選択中
        </span>
        <div className="flex space-x-2">
          <button
            onClick={onSelectAll}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            すべて選択
          </button>
          <span className="text-gray-400">|</span>
          <button
            onClick={onDeselectAll}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            選択解除
          </button>
        </div>
      </div>
    </div>
  );
};
