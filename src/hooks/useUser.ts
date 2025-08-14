import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTelegram } from './useTelegram';
import { logger } from '../utils/logger';
import { User } from '../types';

export const useUser = () => {
  const { user: tgUser } = useTelegram();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    logger.info('useUser эффект сработал');
    logger.info('Telegram пользователь', tgUser);
    
    if (tgUser) {
      logger.info('Telegram пользователь найден, инициализация...');
      initializeUser();
    } else {
      logger.info('Telegram пользователь еще не загружен, ожидание...');
    }
  }, [tgUser]);

  const initializeUser = async () => {
    if (!tgUser) {
      logger.warning('Нет tgUser, пропускаем инициализацию');
      return;
    }

    logger.info('Начало инициализации пользователя', { user_id: tgUser.id });

    try {
      // Проверяем, существует ли пользователь
      logger.info('Проверка существования пользователя в базе данных');
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', tgUser.id)
        .single();

      logger.info('Результат запроса к базе данных', { existingUser, fetchError });

      if (fetchError && fetchError.code !== 'PGRST116') {
        logger.error('Ошибка получения пользователя', fetchError);
        throw fetchError;
      }

      if (existingUser) {
        logger.success('Существующий пользователь найден', existingUser);
        setUser(existingUser);
      } else {
        logger.info('Существующий пользователь не найден, создание нового');
        // Создаем нового пользователя
        const newUser = {
          user_id: tgUser.id,
          name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
          username: tgUser.username || null,
          avatar: tgUser.photo_url || null,
        };

        logger.info('Данные нового пользователя для вставки', newUser);

        const { data: createdUser, error: createError } = await supabase
          .from('users')
          .insert(newUser)
          .select()
          .single();

        logger.info('Результат создания пользователя', { createdUser, createError });

        if (createError) {
          logger.error('Ошибка создания пользователя', createError);
          throw createError;
        }

        logger.success('Пользователь успешно создан', createdUser);

        // Создаем источник по умолчанию
        logger.info('Создание источника по умолчанию');
        const { error: sourceError } = await supabase
          .from('sources')
          .insert({
            user_id: tgUser.id,
            name: 'Отклики компании',
            status: 'active',
            is_default: true,
          });

        if (sourceError) {
          logger.error('Ошибка создания источника по умолчанию', sourceError);
        } else {
          logger.success('Источник по умолчанию успешно создан');
        }

        setUser(createdUser);
      }
    } catch (error) {
      logger.error('Ошибка в initializeUser', error);
    } finally {
      logger.info('Установка loading в false');
      setLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) {
      logger.warning('Нет пользователя для обновления');
      return;
    }

    logger.info('Обновление пользователя', updates);

    try {
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        logger.error('Ошибка обновления пользователя', error);
        throw error;
      }

      logger.success('Пользователь успешно обновлен', updatedUser);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      logger.error('Ошибка обновления пользователя', error);
      throw error;
    }
  };

  const hasRequisites = user && (user.inn || user.corporate_card || user.account_number || user.bik);

  logger.info('Текущее состояние useUser', { 
    user: user ? { id: user.id, name: user.name } : null, 
    loading, 
    hasRequisites: !!hasRequisites 
  });

  return {
    user,
    loading,
    updateUser,
    hasRequisites: !!hasRequisites,
  };
};