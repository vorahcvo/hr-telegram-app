import { useEffect, useState } from 'react';
import { logger } from '../utils/logger';

declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}

export const useTelegram = () => {
  const [tg, setTg] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    logger.info('Инициализация Telegram WebApp');
    logger.info('Telegram WebApp доступен', { 
      hasTelegram: !!window.Telegram, 
      hasWebApp: !!window.Telegram?.WebApp 
    });
    
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      logger.info('WebApp объект получен', webApp);
      
      try {
        webApp.ready();
        logger.success('WebApp готов к работе');
        
        setTg(webApp);
        logger.info('WebApp установлен в состояние');
        
        const userData = webApp.initDataUnsafe?.user;
        logger.info('Данные пользователя от WebApp', userData);
        
        setUser(userData);
        logger.success('Пользователь установлен в состояние');
      } catch (error) {
        logger.error('Ошибка инициализации WebApp', error);
      }
    } else {
      logger.warning('Telegram WebApp недоступен, используем mock данные');
      // Mock data for development
      const mockUser = {
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        photo_url: null
      };
      setUser(mockUser);
      setTg({ 
        sendData: () => logger.info('Mock sendData вызван'), 
        HapticFeedback: { 
          impactOccurred: () => logger.info('Mock haptic вызван') 
        } 
      });
      logger.info('Mock данные установлены', mockUser);
    }
  }, []);

  const sendCallback = (data: string) => {
    logger.info('Отправка callback', { data });
    if (tg) {
      tg.sendData(data);
    }
  };

  const hapticFeedback = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' | 'success' | 'warning' | 'error') => {
    logger.info('Haptic feedback', { style });
    if (tg) {
      tg.HapticFeedback.impactOccurred(style);
    }
  };

  return { tg, user, sendCallback, hapticFeedback };
};