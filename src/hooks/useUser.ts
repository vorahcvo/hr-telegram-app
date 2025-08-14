import { useState, useEffect, useRef } from 'react';
import { supabase, supabaseAnon } from '../lib/supabase';
import { useTelegram } from './useTelegram';
import { logger } from '../utils/logger';
import { User } from '../types';

export const useUser = () => {
  const { user: tgUser } = useTelegram();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initializationRef = useRef(false);
  const effectRunCount = useRef(0);

  // Логируем каждый рендер
  logger.info('🔄 useUser рендер', { 
    tgUser: tgUser ? { id: tgUser.id, first_name: tgUser.first_name } : null,
    currentUser: user ? { id: user.id, name: user.name } : null,
    loading,
    error,
    initializationRef: initializationRef.current,
    effectRunCount: effectRunCount.current
  });

  // Основной эффект - срабатывает при изменении tgUser
  useEffect(() => {
    effectRunCount.current += 1;
    logger.info('🎯 useUser useEffect сработал', { 
      runCount: effectRunCount.current,
      tgUser: tgUser ? { id: tgUser.id, first_name: tgUser.first_name } : null,
      hasTgUser: !!tgUser,
      loading,
      error,
      initializationRef: initializationRef.current
    });
    
    if (!tgUser) {
      logger.warning('⚠️ Нет tgUser, ожидание...');
      return;
    }

    // ПРИНУДИТЕЛЬНО сбрасываем состояние инициализации
    logger.info('🔄 ПРИНУДИТЕЛЬНО сбрасываем состояние инициализации');
    initializationRef.current = false;

    logger.info('🚀 Начинаем инициализацию пользователя');
    initializationRef.current = true;
    initializeUser();
  }, [tgUser]); // Убираем user из зависимостей

  const initializeUser = async () => {
    if (!tgUser) {
      logger.error('❌ Нет tgUser в initializeUser');
      setLoading(false);
      return;
    }

    logger.info('🔍 Начало инициализации пользователя', { 
      user_id: tgUser.id,
      first_name: tgUser.first_name,
      last_name: tgUser.last_name,
      username: tgUser.username 
    });

    try {
      setError(null);
      
      // Тестируем подключение с SERVICE_ROLE_KEY
      logger.info('🔌 Тестируем подключение с SERVICE_ROLE_KEY');
      try {
        const { data: testData, error: testError } = await supabase
          .from('users')
          .select('count')
          .limit(1);

        if (testError) {
          logger.error('❌ Ошибка подключения с SERVICE_ROLE_KEY', testError);
        } else {
          logger.success('✅ Подключение с SERVICE_ROLE_KEY успешно');
        }
      } catch (serviceError) {
        logger.error('❌ Исключение при подключении с SERVICE_ROLE_KEY', serviceError);
      }

      // Тестируем подключение с ANON_KEY
      logger.info('🔌 Тестируем подключение с ANON_KEY');
      try {
        const { data: testDataAnon, error: testErrorAnon } = await supabaseAnon
          .from('users')
          .select('count')
          .limit(1);

        if (testErrorAnon) {
          logger.error('❌ Ошибка подключения с ANON_KEY', testErrorAnon);
        } else {
          logger.success('✅ Подключение с ANON_KEY успешно');
        }
      } catch (anonError) {
        logger.error('❌ Исключение при подключении с ANON_KEY', anonError);
      }

      // Пробуем простой fetch для диагностики
      logger.info('🌐 Тестируем прямой fetch к Supabase');
      try {
        const response = await fetch(`${supabase.supabaseUrl}/rest/v1/users?select=count&limit=1`, {
          headers: {
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${supabase.supabaseKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        logger.info('📡 Fetch response status:', response.status);
        logger.info('📡 Fetch response headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
          const data = await response.json();
          logger.success('✅ Fetch успешен', data);
        } else {
          const errorText = await response.text();
          logger.error('❌ Fetch failed', { status: response.status, text: errorText });
        }
      } catch (fetchError) {
        logger.error('❌ Fetch exception', fetchError);
      }

      // Проверяем, существует ли пользователь с SERVICE_ROLE_KEY
      logger.info('🔍 Проверка существования пользователя с SERVICE_ROLE_KEY');
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', tgUser.id)
        .single();

      logger.info('📊 Результат запроса к базе данных', { 
        existingUser: existingUser ? { id: existingUser.id, name: existingUser.name } : null, 
        fetchError: fetchError ? { code: fetchError.code, message: fetchError.message } : null 
      });

      if (fetchError && fetchError.code !== 'PGRST116') {
        logger.error('❌ Ошибка получения пользователя', fetchError);
        setError(`Ошибка получения данных пользователя: ${fetchError.message}`);
        setLoading(false);
        return;
      } else if (existingUser) {
        logger.success('✅ Существующий пользователь найден', { 
          id: existingUser.id, 
          name: existingUser.name,
          user_id: existingUser.user_id 
        });
        setUser(existingUser);
      } else {
        logger.info('🆕 Существующий пользователь не найден, создание нового');
        
        // Создаем нового пользователя
        const newUser = {
          user_id: tgUser.id,
          name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
          username: tgUser.username || null,
          avatar: tgUser.photo_url || null,
        };

        logger.info('📝 Данные нового пользователя для вставки', newUser);

        const { data: createdUser, error: createError } = await supabase
          .from('users')
          .insert(newUser)
          .select()
          .single();

        logger.info('📊 Результат создания пользователя', { 
          createdUser: createdUser ? { id: createdUser.id, name: createdUser.name } : null, 
          createError: createError ? { code: createError.code, message: createError.message } : null 
        });

        if (createError) {
          logger.error('❌ Ошибка создания пользователя', createError);
          setError(`Ошибка создания пользователя: ${createError.message}`);
          setLoading(false);
          return;
        } else {
          logger.success('✅ Пользователь успешно создан', { 
            id: createdUser.id, 
            name: createdUser.name,
            user_id: createdUser.user_id 
          });

          // Создаем источник по умолчанию
          logger.info('🔗 Создание источника по умолчанию');
          const { error: sourceError } = await supabase
            .from('sources')
            .insert({
              user_id: tgUser.id,
              name: 'Отклики компании',
              status: 'active',
              is_default: true,
            });

          if (sourceError) {
            logger.error('❌ Ошибка создания источника по умолчанию', sourceError);
          } else {
            logger.success('✅ Источник по умолчанию успешно создан');
          }

          setUser(createdUser);
        }
      }
    } catch (error) {
      logger.error('❌ Ошибка в initializeUser', error);
      setError(`Неизвестная ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      logger.info('🏁 Завершение инициализации, установка loading в false');
      setLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) {
      logger.warning('⚠️ Нет пользователя для обновления');
      return;
    }

    logger.info('🔄 Обновление пользователя', updates);

    try {
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        logger.error('❌ Ошибка обновления пользователя', error);
        throw error;
      }

      logger.success('✅ Пользователь успешно обновлен', updatedUser);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      logger.error('❌ Ошибка обновления пользователя', error);
      throw error;
    }
  };

  const hasRequisites = user && (user.inn || user.corporate_card || user.account_number || user.bik);

  // Логируем финальное состояние
  logger.info('📋 Финальное состояние useUser', { 
    user: user ? { id: user.id, name: user.name, user_id: user.user_id } : null, 
    loading, 
    error,
    hasRequisites: !!hasRequisites 
  });

  return {
    user,
    loading,
    error,
    updateUser,
    hasRequisites: !!hasRequisites,
  };
};