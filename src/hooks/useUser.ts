import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import { logger } from '../utils/logger';

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  hasRequisites: boolean;
}

export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasRequisites, setHasRequisites] = useState(false);
  const initializationRef = useRef(false);

  useEffect(() => {
    const initializeUser = async () => {
      if (initializationRef.current) return;
      initializationRef.current = true;

      try {
        const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
        
        if (!tgUser) {
          logger.info('🔧 DEBUG: Нет данных Telegram пользователя');
          setLoading(false);
          return;
        }

        logger.info('🔧 DEBUG: Инициализация пользователя', { tgUser });

        // Проверяем, существует ли пользователь
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', tgUser.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          logger.error('❌ DEBUG: Ошибка получения пользователя', fetchError);
          setError(`Ошибка получения данных пользователя: ${fetchError.message}`);
          setLoading(false);
          return;
        }

        if (existingUser) {
          logger.success('✅ DEBUG: Пользователь найден', existingUser);
          setUser(existingUser);
          setHasRequisites(!!existingUser.requisites);
        } else {
          // Создаем нового пользователя
          const newUser = {
            user_id: tgUser.id,
            name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
            username: tgUser.username || null,
            avatar: tgUser.photo_url || null,
          };

          logger.info('🔧 DEBUG: Создание нового пользователя', newUser);

          const { data: createdUser, error: createError } = await supabase
            .from('users')
            .insert(newUser)
            .select()
            .single();

          if (createError) {
            logger.error('❌ DEBUG: Ошибка создания пользователя', createError);
            setError(`Ошибка создания пользователя: ${createError.message}`);
            setLoading(false);
            return;
          }

          logger.success('✅ DEBUG: Пользователь создан', createdUser);
          setUser(createdUser);
          setHasRequisites(false);
        }
      } catch (error: any) {
        logger.error('❌ DEBUG: Исключение при инициализации пользователя', error);
        setError(`Ошибка инициализации пользователя: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  return {
    user,
    loading,
    error,
    hasRequisites
  };
};