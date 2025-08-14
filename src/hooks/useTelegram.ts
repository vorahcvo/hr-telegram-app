import { useEffect, useState } from 'react';

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
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();
      setTg(webApp);
      setUser(webApp.initDataUnsafe?.user);
    }
  }, []);

  const sendCallback = (data: string) => {
    if (tg) {
      tg.sendData(data);
    }
  };

  const hapticFeedback = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' | 'success' | 'warning' | 'error') => {
    if (tg) {
      tg.HapticFeedback.impactOccurred(style);
    }
  };

  return { tg, user, sendCallback, hapticFeedback };
};