import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Application } from '../types';
import { logger } from '../utils/logger';

interface UseApplicationsReturn {
  applications: Application[];
  loading: boolean;
  hasMore: boolean;
  addApplication: (application: Omit<Application, 'id'>) => Promise<void>;
  updateApplication: (id: string, application: Partial<Application>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  loadMore: () => Promise<void>;
}

const ITEMS_PER_PAGE = 20;

export const useApplications = (userId?: string): UseApplicationsReturn => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchApplications = useCallback(async (pageNum: number = 0, append: boolean = false) => {
    if (!userId) {
      logger.info('🔧 DEBUG: Нет userId, пропускаем загрузку заявок');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      logger.info(`🔧 DEBUG: Загрузка заявок, страница ${pageNum}`);

      const from = pageNum * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('applications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        logger.error('❌ DEBUG: Ошибка загрузки заявок', error);
        throw error;
      }

      logger.info(`📊 DEBUG: Загружено заявок: ${data?.length || 0}`);
      
      if (append) {
        setApplications(prev => [...prev, ...(data || [])]);
      } else {
        setApplications(data || []);
      }

      setHasMore((data?.length || 0) === ITEMS_PER_PAGE);
      setPage(pageNum);
    } catch (error) {
      logger.error('❌ DEBUG: Исключение при загрузке заявок', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addApplication = useCallback(async (application: Omit<Application, 'id'>) => {
    if (!userId) {
      logger.error('❌ DEBUG: Нет userId для добавления заявки');
      throw new Error('User ID is required');
    }

    try {
      logger.info('🔧 DEBUG: Добавление заявки', application);

      const { data, error } = await supabase
        .from('applications')
        .insert([{ ...application, user_id: userId }])
        .select()
        .single();

      if (error) {
        logger.error('❌ DEBUG: Ошибка добавления заявки', error);
        throw error;
      }

      logger.success('✅ DEBUG: Заявка добавлена', data);
      setApplications(prev => [data, ...prev]);
    } catch (error) {
      logger.error('❌ DEBUG: Исключение при добавлении заявки', error);
      throw error;
    }
  }, [userId]);

  const updateApplication = useCallback(async (id: string, updates: Partial<Application>) => {
    try {
      logger.info('🔧 DEBUG: Обновление заявки', { id, updates });

      const { data, error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('❌ DEBUG: Ошибка обновления заявки', error);
        throw error;
      }

      logger.success('✅ DEBUG: Заявка обновлена', data);
      setApplications(prev => 
        prev.map(app => app.id === id ? data : app)
      );
    } catch (error) {
      logger.error('❌ DEBUG: Исключение при обновлении заявки', error);
      throw error;
    }
  }, []);

  const deleteApplication = useCallback(async (id: string) => {
    try {
      logger.info('🔧 DEBUG: Удаление заявки', { id });

      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('❌ DEBUG: Ошибка удаления заявки', error);
        throw error;
      }

      logger.success('✅ DEBUG: Заявка удалена');
      setApplications(prev => prev.filter(app => app.id !== id));
    } catch (error) {
      logger.error('❌ DEBUG: Исключение при удалении заявки', error);
      throw error;
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    await fetchApplications(page + 1, true);
  }, [loading, hasMore, page, fetchApplications]);

  useEffect(() => {
    fetchApplications(0, false);
  }, [fetchApplications]);

  return {
    applications,
    loading,
    hasMore,
    addApplication,
    updateApplication,
    deleteApplication,
    loadMore
  };
};