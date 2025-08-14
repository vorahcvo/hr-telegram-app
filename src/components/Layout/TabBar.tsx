import React from 'react';
import { TabType } from '../../types';
import { Home, Users, Book, Link } from 'lucide-react';
import { useTelegram } from '../../hooks/useTelegram';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  const { hapticFeedback } = useTelegram();

  const tabs = [
    { id: 'applications' as TabType, label: 'Заявки', icon: Home },
    { id: 'sources' as TabType, label: 'Источники', icon: Link },
    { id: 'training' as TabType, label: 'Обучение', icon: Book },
    { id: 'profile' as TabType, label: 'Профиль', icon: Users },
  ];

  const handleTabClick = (tab: TabType) => {
    hapticFeedback('light');
    onTabChange(tab);
  };

  return (
    <nav className="bg-[#1c1c1e] border-t border-[#3c3c3e] px-2 py-1">
      <div className="flex justify-around">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-[#007aff] bg-[#007aff] bg-opacity-10'
                  : 'text-[#8e8e93] hover:text-white hover:bg-[#2c2c2e]'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default TabBar;