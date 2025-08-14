import React, { useState, useEffect } from 'react';
import { TabType } from './types';
import { useTelegram } from './hooks/useTelegram';
import { useUser } from './hooks/useUser';
import { logger } from './utils/logger';
import { supabase } from './lib/supabase';
import TabBar from './components/Layout/TabBar';
import ApplicationsPage from './pages/ApplicationsPage';
import SourcesPage from './pages/SourcesPage';
import TrainingPage from './pages/TrainingPage';
import ProfilePage from './pages/ProfilePage';
import LogWindow from './components/UI/LogWindow';

function App() {
  const { tg, user: tgUser } = useTelegram();
  const { user, loading, updateUser } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('applications');
  const [showLogs, setShowLogs] = useState(false);
  const [appInitialized, setAppInitialized] = useState(false);

  logger.info('App компонент рендеринг', { 
    tgUser: tgUser ? { id: tgUser.id, first_name: tgUser.first_name } : null,
    user: user ? { id: user.id, name: user.name } : null,
    loading,
    appInitialized
  });

  // Принудительная инициализация пользователя
  useEffect(() => {
    if (tgUser && !user && !loading && !appInitialized) {
      logger.warning('Принудительная инициализация пользователя в App');
      setAppInitialized(true);
      
      // Создаем пользователя напрямую
      const createUser = async () => {
        try {
          const newUser = {
            user_id: tgUser.id,
            name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
            username: tgUser.username || null,
            avatar: tgUser.photo_url || null,
          };

          logger.info('Создание пользователя из App', newUser);

          const { data: createdUser, error: createError } = await supabase
            .from('users')
            .insert(newUser)
            .select()
            .single();

          if (createError) {
            logger.error('Ошибка создания пользователя из App', createError);
          } else {
            logger.success('Пользователь создан из App', createdUser);
            
            // Создаем источник по умолчанию
            const { error: sourceError } = await supabase
              .from('sources')
              .insert({
                user_id: tgUser.id,
                name: 'Отклики компании',
                status: 'active',
                is_default: true,
              });

            if (sourceError) {
              logger.error('Ошибка создания источника из App', sourceError);
            } else {
              logger.success('Источник создан из App');
            }
          }
        } catch (error) {
          logger.error('Ошибка в createUser из App', error);
        }
      };

      createUser();
    }
  }, [tgUser, user, loading, appInitialized]);

  // Дополнительная проверка - если пользователь есть в базе, но не загружен в состоянии
  useEffect(() => {
    if (tgUser && !user && !loading) {
      logger.info('Проверка существования пользователя в базе данных из App');
      
      const checkUser = async () => {
        try {
          const { data: existingUser, error } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', tgUser.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            logger.error('Ошибка проверки пользователя из App', error);
          } else if (existingUser) {
            logger.success('Пользователь найден в базе из App', existingUser);
            // Здесь мы не можем обновить состояние useUser, но можем создать источник
            const { error: sourceError } = await supabase
              .from('sources')
              .insert({
                user_id: tgUser.id,
                name: 'Отклики компании',
                status: 'active',
                is_default: true,
              });

            if (sourceError) {
              logger.error('Ошибка создания источника из App', sourceError);
            } else {
              logger.success('Источник создан из App');
            }
          }
        } catch (error) {
          logger.error('Ошибка в checkUser из App', error);
        }
      };

      checkUser();
    }
  }, [tgUser, user, loading]);

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
    logger.info('App: показываем состояние загрузки');
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