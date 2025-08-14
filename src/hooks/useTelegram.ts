import { useCallback } from 'react';
import { logger } from '../utils/logger';

interface UseTelegramReturn {
  hapticFeedback: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' | 'success' | 'warning' | 'error') => void;
  sendCallback: (data: string) => void;
  onEvent: (eventType: string, eventHandler: Function) => void;
  offEvent: (eventType: string, eventHandler: Function) => void;
  sendData: (data: any) => void;
}

export const useTelegram = (): UseTelegramReturn => {
  const hapticFeedback = useCallback((style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' | 'success' | 'warning' | 'error') => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred(style);
        logger.info(`🔧 DEBUG: Haptic feedback: ${style}`);
      }
    } catch (error) {
      logger.error('❌ DEBUG: Ошибка haptic feedback', error);
    }
  }, []);

  const sendCallback = useCallback((data: string) => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg && tg.sendData) {
        tg.sendData(data);
        logger.info(`🔧 DEBUG: Отправлен callback: ${data}`);
      }
    } catch (error) {
      logger.error('❌ DEBUG: Ошибка отправки callback', error);
    }
  }, []);

  const onEvent = useCallback((eventType: string, eventHandler: Function) => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg && tg.onEvent) {
        tg.onEvent(eventType, eventHandler);
        logger.info(`🔧 DEBUG: Подписка на событие: ${eventType}`);
      }
    } catch (error) {
      logger.error('❌ DEBUG: Ошибка подписки на событие', error);
    }
  }, []);

  const offEvent = useCallback((eventType: string, eventHandler: Function) => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg && tg.offEvent) {
        tg.offEvent(eventType, eventHandler);
        logger.info(`🔧 DEBUG: Отписка от события: ${eventType}`);
      }
    } catch (error) {
      logger.error('❌ DEBUG: Ошибка отписки от события', error);
    }
  }, []);

  const sendData = useCallback((data: any) => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg && tg.sendData) {
        tg.sendData(JSON.stringify(data));
        logger.info(`🔧 DEBUG: Отправлены данные:`, data);
      }
    } catch (error) {
      logger.error('❌ DEBUG: Ошибка отправки данных', error);
    }
  }, []);

  return {
    hapticFeedback,
    sendCallback,
    onEvent,
    offEvent,
    sendData
  };
};