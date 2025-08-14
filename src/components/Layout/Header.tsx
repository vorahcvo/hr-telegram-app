import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  rightElement
}) => {
  return (
    <header className="bg-[#1c1c1e] border-b border-[#3c3c3e] px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        {showBack && onBack && (
          <button
            onClick={onBack}
            className="mr-3 p-1 rounded-lg hover:bg-[#2c2c2e] transition-colors"
          >
            <ArrowLeft size={20} className="text-[#007aff]" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-white">{title}</h1>
      </div>
      
      {rightElement && (
        <div className="flex items-center">
          {rightElement}
        </div>
      )}
    </header>
  );
};

export default Header;