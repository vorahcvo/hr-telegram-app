import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-[#2c2c2e] rounded-full flex items-center justify-center mb-4">
        <Icon size={24} className="text-[#8e8e93]" />
      </div>
      
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      
      {description && (
        <p className="text-sm text-[#8e8e93] mb-6 max-w-sm">{description}</p>
      )}
      
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-[#007aff] text-white rounded-lg font-medium hover:bg-[#0056cc] transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;