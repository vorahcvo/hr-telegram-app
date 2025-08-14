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

  return { tg, user };
};