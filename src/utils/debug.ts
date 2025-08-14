import { supabase } from '../lib/supabase';
import { logger } from './logger';

// Глобальная функция для отладки
declare global {
  interface Window {
    debugCreateUser: () => Promise<void>;
    debugCheckUser: () => Promise<void>;
    debugResetUser: () => Promise<void>;
  }
}

export const debugCreateUser = async () => {
  try {
    // Получаем данные пользователя из Telegram WebApp
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    
    if (!tgUser) {
      logger.error('Нет данных пользователя Telegram');
      return;
    }

    logger.info('Принудительное создание пользователя', tgUser);

    const newUser = {
      user_id: tgUser.id,
      name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
      username: tgUser.username || null,
      avatar: tgUser.photo_url || null,
    };

    const { data: createdUser, error: createError } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single();

    if (createError) {
      logger.error('Ошибка создания пользователя', createError);
    } else {
      logger.success('Пользователь создан', createdUser);
      
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
        logger.error('Ошибка создания источника', sourceError);
      } else {
        logger.success('Источник создан');
      }
    }
  } catch (error) {
    logger.error('Ошибка в debugCreateUser', error);
  }
};

export const debugCheckUser = async () => {
  try {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    
    if (!tgUser) {
      logger.error('Нет данных пользователя Telegram');
      return;
    }

    logger.info('Проверка пользователя в базе данных', { user_id: tgUser.id });

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', tgUser.id)
      .single();

    if (error) {
      logger.error('Ошибка проверки пользователя', error);
    } else {
      logger.success('Пользователь найден в базе', user);
    }
  } catch (error) {
    logger.error('Ошибка в debugCheckUser', error);
  }
};

export const debugResetUser = async () => {
  try {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    
    if (!tgUser) {
      logger.error('Нет данных пользователя Telegram');
      return;
    }

    logger.info('Удаление пользователя из базы данных', { user_id: tgUser.id });

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('user_id', tgUser.id);

    if (error) {
      logger.error('Ошибка удаления пользователя', error);
    } else {
      logger.success('Пользователь удален из базы данных');
    }
  } catch (error) {
    logger.error('Ошибка в debugResetUser', error);
  }
};

// Добавляем функции в глобальный объект window
if (typeof window !== 'undefined') {
  window.debugCreateUser = debugCreateUser;
  window.debugCheckUser = debugCheckUser;
  window.debugResetUser = debugResetUser;
  
  logger.info('Отладочные функции добавлены в window');
  logger.info('Доступные функции:');
  logger.info('- window.debugCreateUser() - создать пользователя');
  logger.info('- window.debugCheckUser() - проверить пользователя');
  logger.info('- window.debugResetUser() - удалить пользователя');
}