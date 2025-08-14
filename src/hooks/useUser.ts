import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTelegram } from './useTelegram';
import { User } from '../types';

export const useUser = () => {
  const { user: tgUser } = useTelegram();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('👤 useUser: Effect triggered');
    console.log('👤 useUser: tgUser:', tgUser);
    
    if (tgUser) {
      console.log('👤 useUser: Telegram user found, initializing...');
      initializeUser();
    } else {
      console.log('👤 useUser: No Telegram user yet, waiting...');
    }
  }, [tgUser]);

  const initializeUser = async () => {
    if (!tgUser) {
      console.log('👤 useUser: No tgUser, skipping initialization');
      return;
    }

    console.log('👤 useUser: Starting user initialization for user_id:', tgUser.id);

    try {
      // Проверяем, существует ли пользователь
      console.log('👤 useUser: Checking if user exists in database...');
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', tgUser.id)
        .single();

      console.log('👤 useUser: Database query result:', { existingUser, fetchError });

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('👤 useUser: Error fetching user:', fetchError);
        throw fetchError;
      }

      if (existingUser) {
        console.log('👤 useUser: Existing user found:', existingUser);
        setUser(existingUser);
      } else {
        console.log('👤 useUser: No existing user found, creating new user...');
        // Создаем нового пользователя
        const newUser = {
          user_id: tgUser.id,
          name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
          username: tgUser.username || null,
          avatar: tgUser.photo_url || null,
        };

        console.log('👤 useUser: New user data to insert:', newUser);

        const { data: createdUser, error: createError } = await supabase
          .from('users')
          .insert(newUser)
          .select()
          .single();

        console.log('👤 useUser: User creation result:', { createdUser, createError });

        if (createError) {
          console.error('👤 useUser: Error creating user:', createError);
          throw createError;
        }

        console.log('👤 useUser: User created successfully:', createdUser);

        // Создаем источник по умолчанию
        console.log('👤 useUser: Creating default source...');
        const { error: sourceError } = await supabase
          .from('sources')
          .insert({
            user_id: tgUser.id,
            name: 'Отклики компании',
            status: 'active',
            is_default: true,
          });

        if (sourceError) {
          console.error('👤 useUser: Error creating default source:', sourceError);
        } else {
          console.log('👤 useUser: Default source created successfully');
        }

        setUser(createdUser);
      }
    } catch (error) {
      console.error('👤 useUser: Error in initializeUser:', error);
    } finally {
      console.log('👤 useUser: Setting loading to false');
      setLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) {
      console.log('👤 useUser: No user to update');
      return;
    }

    console.log('👤 useUser: Updating user with:', updates);

    try {
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('👤 useUser: Error updating user:', error);
        throw error;
      }

      console.log('👤 useUser: User updated successfully:', updatedUser);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('👤 useUser: Error updating user:', error);
      throw error;
    }
  };

  const hasRequisites = user && (user.inn || user.corporate_card || user.account_number || user.bik);

  console.log('👤 useUser: Current state:', { user, loading, hasRequisites: !!hasRequisites });

  return {
    user,
    loading,
    updateUser,
    hasRequisites: !!hasRequisites,
  };
};