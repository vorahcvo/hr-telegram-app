import React, { useState, useEffect } from 'react';
import { TabType } from './types';
import { useTelegram } from './hooks/useTelegram';
import { useUser } from './hooks/useUser';
import { logger } from './utils/logger';
import TabBar from './components/Layout/TabBar';
import ApplicationsPage from './pages/ApplicationsPage';
import SourcesPage from './pages/SourcesPage';
import TrainingPage from './pages/TrainingPage';
import ProfilePage from './pages/ProfilePage';
import LogWindow from './components/UI/LogWindow';

function App() {
  const { tg, user: tgUser } = useTelegram();
  const { user, loading, error } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('applications');
  const [showLogs, setShowLogs] = useState(false);

  logger.info('🏠 App компонент рендеринг', { 
    tgUser: tgUser ? { id: tgUser.id, first_name: tgUser.first_name } : null,
    user: user ? { id: user.id, name: user.name } : null,
    loading,
    error
  });

  // Слушаем событие переключения вкладок
  useEffect(() => {
    const handleSwitchTab = (event: CustomEvent) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('switchTab', handleSwitchTab as EventListener);
    return () => {
      window.removeEventListener('switchTab', handleSwitchTab as EventListener);
    };
  }, []);

  // Set Telegram theme colors
  useEffect(() => {
    if (tg) {
      logger.info('🎨 Установка цветов Telegram темы');
      // Set theme colors for better integration
      document.documentElement.style.setProperty('--tg-theme-bg-color', '#1c1c1e');
      document.documentElement.style.setProperty('--tg-theme-text-color', '#ffffff');
      document.documentElement.style.setProperty('--tg-theme-hint-color', '#8e8e93');
      document.documentElement.style.setProperty('--tg-theme-link-color', '#007aff');
      document.documentElement.style.setProperty('--tg-theme-button-color', '#007aff');
      document.documentElement.style.setProperty('--tg-theme-button-text-color', '#ffffff');
    }
  }, [tg]);

  if (loading) {
    logger.info('⏳ App: показываем состояние загрузки');
    return (
      <div className="min-h-screen bg-[#1c1c1e] text-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#007aff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'applications':
        return <ApplicationsPage />;
      case 'sources':
        return <SourcesPage />;
      case 'training':
        return <TrainingPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <ApplicationsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1c1e] text-white">
      <div className="flex flex-col h-screen">
        <main className="flex-1 overflow-hidden">
          {renderCurrentPage()}
        </main>
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Кнопка логов */}
        <button
          onClick={() => setShowLogs(true)}
          className="fixed bottom-20 right-4 w-12 h-12 bg-[#007aff] rounded-full flex items-center justify-center shadow-lg z-40"
          title="Показать логи"
        >
          <span className="text-white text-lg">📋</span>
        </button>
      </div>

      {/* Окно логов */}
      <LogWindow isOpen={showLogs} onClose={() => setShowLogs(false)} />
    </div>
  );
}

export default App;