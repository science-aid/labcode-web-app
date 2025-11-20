import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface VisibilityToggleProps {
  showHidden: boolean;
  onToggle: () => void;
}

/**
 * 非表示ランの表示切り替えコンポーネント
 *
 * ボタンをクリックすることで即座に非表示ランの表示/非表示を切り替えます。
 */
export const VisibilityToggle: React.FC<VisibilityToggleProps> = ({
  showHidden,
  onToggle
}) => {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {showHidden ? (
          <>
            <EyeOff className="w-4 h-4" />
            <span>非表示のランを隠す</span>
          </>
        ) : (
          <>
            <Eye className="w-4 h-4" />
            <span>非表示のランも表示する</span>
          </>
        )}
      </button>
    </div>
  );
};
