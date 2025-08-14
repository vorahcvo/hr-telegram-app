import { supabase, supabaseServiceRole, testSupabaseConnection } from '../lib/supabase';
import { logger } from './logger';
import { SUPABASE_CONFIG } from '../config/env';

// Global debug functions for browser console and in-app debugging

export const debugCreateUser = async () => {
  logger.info('🔧 DEBUG: Создание тестового пользователя');
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

    const { data, error } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single();

    if (error) {
      logger.error('❌ DEBUG: Ошибка создания пользователя', error);
    } else {
      logger.success('✅ DEBUG: Пользователь создан', data);
    }
  } catch (e: any) {
    logger.error('❌ DEBUG: Исключение при создании пользователя', e);
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

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', tgUser.id)
      .single();

    if (error) {
      logger.error('❌ DEBUG: Ошибка получения пользователя', error);
    } else {
      logger.success('✅ DEBUG: Пользователь найден', data);
    }
  } catch (e: any) {
    logger.error('❌ DEBUG: Исключение при проверке пользователя', e);
  }
};

export const debugResetUser = async () => {
  logger.info('🔧 DEBUG: Сброс пользователя');
  try {
    const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
    if (!tgUser) {
      logger.error('❌ DEBUG: Нет данных Telegram пользователя');
      return;
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('user_id', tgUser.id);

    if (error) {
      logger.error('❌ DEBUG: Ошибка удаления пользователя', error);
    } else {
      logger.success('✅ DEBUG: Пользователь удален');
    }
  } catch (e: any) {
    logger.error('❌ DEBUG: Исключение при удалении пользователя', e);
  }
};

export const debugTestConnection = async () => {
  logger.info('🔧 DEBUG: Тестирование подключения к Supabase');
  
  // Test with SERVICE_ROLE_KEY
  const serviceResult = await testSupabaseConnection('service_role');
  
  // Test with ANON_KEY
  const anonResult = await testSupabaseConnection('anon');
  
  logger.info('📊 DEBUG: Результаты тестирования', {
    service_role: serviceResult,
    anon: anonResult
  });
};

export const debugTestFetch = async () => {
  logger.info('🔧 DEBUG: Тестирование прямого fetch');
  try {
    const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/users?select=*&limit=1`, {
      headers: {
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    logger.success('✅ DEBUG: Fetch успешен', { status: response.status, data });
  } catch (e: any) {
    logger.error('❌ DEBUG: Fetch exception', e);
  }
};

export const debugTestSimpleFetch = async () => {
  logger.info('🔧 DEBUG: Тестирование простого fetch без заголовков');
  
  // Test 1: Simple GET request
  logger.info('🌐 DEBUG: Тест 1 - Простой GET запрос');
  try {
    const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/users?select=*&limit=1`);
    const data = await response.json();
    logger.success('✅ DEBUG: Простой fetch успешен', { status: response.status, data });
  } catch (e: any) {
    logger.error('❌ DEBUG: Простой fetch exception', e);
  }
};

export const debugPingServer = async () => {
  logger.info('🔧 DEBUG: Пинг сервера - проверка сетевого подключения');
  const baseUrl = SUPABASE_CONFIG.url;
  const ip = SUPABASE_CONFIG.url.replace('http://', '').replace('https://', '').split(':')[0];

  // Test 1: HEAD request to base URL without port
  logger.info('🌐 DEBUG: Тест 1 - Ping без порта');
  try {
    const url = `http://${ip}/`;
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    logger.success('✅ DEBUG: Тест 1 - HEAD запрос выполнен', { status: response.status });
  } catch (e: any) {
    logger.error('❌ DEBUG: Тест 1 - HEAD запрос не удался', e);
  }

  // Test 2: HEAD request to URL with port 8000
  logger.info('🌐 DEBUG: Тест 2 - Ping с портом 8000');
  try {
    const url = `${baseUrl}/`;
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    logger.success('✅ DEBUG: Тест 2 - HEAD запрос выполнен', { status: response.status });
  } catch (e: any) {
    logger.error('❌ DEBUG: Тест 2 - HEAD запрос не удался', e);
  }

  // Test 3: Image load test (bypasses CORS)
  logger.info('🌐 DEBUG: Тест 3 - Проверка через image');
  try {
    const img = new Image();
    img.src = `${baseUrl}/favicon.ico?${Date.now()}`;
    await new Promise((resolve, reject) => {
      img.onload = () => {
        logger.success('✅ DEBUG: Тест 3 - Image загружена');
        resolve(true);
      };
      img.onerror = (e) => {
        logger.error('❌ DEBUG: Тест 3 - Image не загрузилась', e);
        reject(e);
      };
    });
  } catch (e) {
    // Error already logged by onerror
  }

  // Test 4: Script load test (bypasses CORS)
  logger.info('🌐 DEBUG: Тест 4 - Проверка через script');
  try {
    const script = document.createElement('script');
    script.src = `${baseUrl}/some-non-existent-script.js?${Date.now()}`;
    await new Promise((resolve, reject) => {
      script.onload = () => {
        logger.success('✅ DEBUG: Тест 4 - Script загружен');
        resolve(true);
      };
      script.onerror = (e) => {
        logger.error('❌ DEBUG: Тест 4 - Script не загрузился', e);
        reject(e);
      };
      document.head.appendChild(script);
    });
  } catch (e) {
    // Error already logged by onerror
  }
};

// Make functions globally available
(window as any).debugCreateUser = debugCreateUser;
(window as any).debugCheckUser = debugCheckUser;
(window as any).debugResetUser = debugResetUser;
(window as any).debugTestConnection = debugTestConnection;
(window as any).debugTestFetch = debugTestFetch;
(window as any).debugTestSimpleFetch = debugTestSimpleFetch;
(window as any).debugPingServer = debugPingServer;