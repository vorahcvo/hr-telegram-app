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
    console.log('🔧 useTelegram: Initializing...');
    console.log('🔧 useTelegram: window.Telegram exists:', !!window.Telegram);
    console.log('🔧 useTelegram: window.Telegram.WebApp exists:', !!window.Telegram?.WebApp);
    
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      console.log('🔧 useTelegram: WebApp object:', webApp);
      
      try {
        webApp.ready();
        console.log('🔧 useTelegram: WebApp ready called');
        
        setTg(webApp);
        console.log('🔧 useTelegram: WebApp set to state');
        
        const userData = webApp.initDataUnsafe?.user;
        console.log('🔧 useTelegram: User data from WebApp:', userData);
        
        setUser(userData);
        console.log('🔧 useTelegram: User set to state');
      } catch (error) {
        console.error('🔧 useTelegram: Error initializing WebApp:', error);
      }
    } else {
      console.log('🔧 useTelegram: Telegram WebApp not available, using mock data');
      // Mock data for development
      const mockUser = {
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        photo_url: null
      };
      setUser(mockUser);
      setTg({ sendData: () => console.log('Mock sendData'), HapticFeedback: { impactOccurred: () => console.log('Mock haptic') } });
    }
  }, []);

  const sendCallback = (data: string) => {
    console.log('🔧 useTelegram: sendCallback called with:', data);
    if (tg) {
      tg.sendData(data);
    }
  };

  const hapticFeedback = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' | 'success' | 'warning' | 'error') => {
    console.log('🔧 useTelegram: hapticFeedback called with:', style);
    if (tg) {
      tg.HapticFeedback.impactOccurred(style);
    }
  };

  return { tg, user, sendCallback, hapticFeedback };
};