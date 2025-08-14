import React from 'react';
import { TabType } from '../../types';
import { FileText, Source, BookOpen, User } from 'lucide-react';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'applications' as TabType, label: 'Заявки', icon: FileText },
    { id: 'sources' as TabType, label: 'Источники', icon: Source },
    { id: 'training' as TabType, label: 'Обучение', icon: BookOpen },
    { id: 'profile' as TabType, label: 'Профиль', icon: User },
  ];

  return (
    <nav className="bg-[#1c1c1e] border-t border-[#2c2c2e] px-2 py-2">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-full py-2 px-1 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#007aff] text-white'
                  : 'text-[#8e8e93] hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default TabBar;