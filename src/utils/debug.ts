import { supabase, supabaseAnon } from '../lib/supabase';
import { logger } from './logger';

// Глобальные функции для отладки
declare global {
  interface Window {
    debugCreateUser: () => void;
    debugCheckUser: () => void;
    debugResetUser: () => void;
    debugTestConnection: () => void;
    debugTestFetch: () => void;
    debugTestSimpleFetch: () => void;
    debugPingServer: () => void;
  }
}

export const debugCreateUser = async () => {
  logger.info('🔧 DEBUG: Создание пользователя вручную');
  
  try {
    const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
    if (!tgUser) {
      logger.error('❌ DEBUG: Нет данных Telegram пользователя');
      return;
    }

    const newUser = {
      user_id: tgUser.id,
      name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
      username: tgUser.username || null,
      avatar: tgUser.photo_url || null,
    };

    logger.info('📝 DEBUG: Данные для создания', newUser);

    const { data: createdUser, error } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single();

    if (error) {
      logger.error('❌ DEBUG: Ошибка создания', error);
    } else {
      logger.success('✅ DEBUG: Пользователь создан', createdUser);
    }
  } catch (error) {
    logger.error('❌ DEBUG: Исключение при создании', error);
  }
};

export const debugCheckUser = async () => {
  logger.info('🔧 DEBUG: Проверка пользователя');
  
  try {
    const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
    if (!tgUser) {
      logger.error('❌ DEBUG: Нет данных Telegram пользователя');
      return;
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', tgUser.id)
      .single();

    if (error) {
      logger.error('❌ DEBUG: Ошибка проверки', error);
    } else {
      logger.success('✅ DEBUG: Пользователь найден', user);
    }
  } catch (error) {
    logger.error('❌ DEBUG: Исключение при проверке', error);
  }
};

export const debugResetUser = () => {
  logger.info('🔧 DEBUG: Сброс состояния пользователя');
  localStorage.removeItem('supabase.auth.token');
  window.location.reload();
};

export const debugTestConnection = async () => {
  logger.info('🔧 DEBUG: Тестирование подключения к Supabase');
  
  try {
    // Тест с SERVICE_ROLE_KEY
    logger.info('🔌 DEBUG: Тест с SERVICE_ROLE_KEY');
    const { data: serviceData, error: serviceError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    logger.info('📊 DEBUG: SERVICE_ROLE_KEY результат', { data: serviceData, error: serviceError });

    // Тест с ANON_KEY
    logger.info('🔌 DEBUG: Тест с ANON_KEY');
    const { data: anonData, error: anonError } = await supabaseAnon
      .from('users')
      .select('count')
      .limit(1);
    
    logger.info('📊 DEBUG: ANON_KEY результат', { data: anonData, error: anonError });

  } catch (error) {
    logger.error('❌ DEBUG: Исключение при тестировании', error);
  }
};

export const debugTestFetch = async () => {
  logger.info('🔧 DEBUG: Тестирование прямого fetch');
  
  try {
    const response = await fetch('http://5.129.230.57:8000/rest/v1/users?select=count&limit=1', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzQ1MDEwMDAsImV4cCI6MTkwMjc3NjQwMH0.LlGieQIb8ukhfR_qGM0yUBLWy1BYE9jno76YkLJBmRU',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzQ1MDEwMDAsImV4cCI6MTkwMjc3NjQwMH0.LlGieQIb8ukhfR_qGM0yUBLWy1BYE9jno76YkLJBmRU',
        'Content-Type': 'application/json'
      }
    });
    
    logger.info('📡 DEBUG: Fetch status', response.status);
    logger.info('📡 DEBUG: Fetch headers', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      logger.success('✅ DEBUG: Fetch успешен', data);
    } else {
      const errorText = await response.text();
      logger.error('❌ DEBUG: Fetch failed', { status: response.status, text: errorText });
    }
  } catch (error) {
    logger.error('❌ DEBUG: Fetch exception', error);
  }
};

export const debugTestSimpleFetch = async () => {
  logger.info('🔧 DEBUG: Тестирование простого fetch без заголовков');
  
  try {
    // Тест 1: Простой GET запрос
    logger.info('🌐 DEBUG: Тест 1 - Простой GET запрос');
    const response1 = await fetch('http://5.129.230.57:8000/rest/v1/');
    logger.info('📡 DEBUG: Тест 1 status', response1.status);
    
    // Тест 2: GET запрос с базовыми заголовками
    logger.info('🌐 DEBUG: Тест 2 - GET с базовыми заголовками');
    const response2 = await fetch('http://5.129.230.57:8000/rest/v1/users', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzQ1MDEwMDAsImV4cCI6MTkwMjc3NjQwMH0.LlGieQIb8ukhfR_qGM0yUBLWy1BYE9jno76YkLJBmRU'
      }
    });
    logger.info('📡 DEBUG: Тест 2 status', response2.status);
    
    // Тест 3: Проверка доступности сервера
    logger.info('🌐 DEBUG: Тест 3 - Проверка доступности сервера');
    const response3 = await fetch('http://5.129.230.57:8000/');
    logger.info('📡 DEBUG: Тест 3 status', response3.status);
    
  } catch (error) {
    logger.error('❌ DEBUG: Простой fetch exception', error);
  }
};

export const debugPingServer = async () => {
  logger.info('🔧 DEBUG: Пинг сервера - проверка сетевого подключения');
  
  try {
    // Тест 1: Простой ping без порта
    logger.info('🌐 DEBUG: Тест 1 - Ping без порта');
    try {
      const response1 = await fetch('http://5.129.230.57/', { 
        method: 'HEAD',
        mode: 'no-cors' // Пробуем обойти CORS
      });
      logger.info('📡 DEBUG: Тест 1 - HEAD запрос выполнен');
    } catch (error1) {
      logger.error('❌ DEBUG: Тест 1 - HEAD запрос не удался', error1);
    }
    
    // Тест 2: Ping с портом 8000
    logger.info('🌐 DEBUG: Тест 2 - Ping с портом 8000');
    try {
      const response2 = await fetch('http://5.129.230.57:8000/', { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      logger.info('📡 DEBUG: Тест 2 - HEAD запрос выполнен');
    } catch (error2) {
      logger.error('❌ DEBUG: Тест 2 - HEAD запрос не удался', error2);
    }
    
    // Тест 3: Проверка через image (часто обходит CORS)
    logger.info('🌐 DEBUG: Тест 3 - Проверка через image');
    try {
      const img = new Image();
      img.onload = () => {
        logger.success('✅ DEBUG: Тест 3 - Image загружена успешно');
      };
      img.onerror = () => {
        logger.error('❌ DEBUG: Тест 3 - Image не загрузилась');
      };
      img.src = 'http://5.129.230.57:8000/favicon.ico?' + Date.now();
    } catch (error3) {
      logger.error('❌ DEBUG: Тест 3 - Image exception', error3);
    }
    
  } catch (error) {
    logger.error('❌ DEBUG: Ping exception', error);
  }
};

// Привязываем функции к window
if (typeof window !== 'undefined') {
  window.debugCreateUser = debugCreateUser;
  window.debugCheckUser = debugCheckUser;
  window.debugResetUser = debugResetUser;
  window.debugTestConnection = debugTestConnection;
  window.debugTestFetch = debugTestFetch;
  window.debugTestSimpleFetch = debugTestSimpleFetch;
  window.debugPingServer = debugPingServer;
}