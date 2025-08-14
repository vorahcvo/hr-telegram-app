import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Source } from '../types';
import { logger } from '../utils/logger';

interface UseSourcesReturn {
  sources: Source[];
  loading: boolean;
  hasMore: boolean;
  addSource: (source: Omit<Source, 'id'>) => Promise<void>;
  updateSource: (id: string, source: Partial<Source>) => Promise<void>;
  deleteSource: (id: string) => Promise<void>;
  loadMore: () => Promise<void>;
}

const ITEMS_PER_PAGE = 20;

export const useSources = (userId?: string): UseSourcesReturn => {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchSources = useCallback(async (pageNum: number = 0, append: boolean = false) => {
    if (!userId) {
      logger.info('🔧 DEBUG: Нет userId, пропускаем загрузку источников');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      logger.info(`🔧 DEBUG: Загрузка источников, страница ${pageNum}`);

      const from = pageNum * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('sources')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        logger.error('❌ DEBUG: Ошибка загрузки источников', error);
        throw error;
      }

      logger.info(`📊 DEBUG: Загружено источников: ${data?.length || 0}`);
      
      if (append) {
        setSources(prev => [...prev, ...(data || [])]);
      } else {
        setSources(data || []);
      }

      setHasMore((data?.length || 0) === ITEMS_PER_PAGE);
      setPage(pageNum);
    } catch (error) {
      logger.error('❌ DEBUG: Исключение при загрузке источников', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addSource = useCallback(async (source: Omit<Source, 'id'>) => {
    if (!userId) {
      logger.error('❌ DEBUG: Нет userId для добавления источника');
      throw new Error('User ID is required');
    }

    try {
      logger.info('🔧 DEBUG: Добавление источника', source);

      const { data, error } = await supabase
        .from('sources')
        .insert([{ ...source, user_id: userId }])
        .select()
        .single();

      if (error) {
        logger.error('❌ DEBUG: Ошибка добавления источника', error);
        throw error;
      }

      logger.success('✅ DEBUG: Источник добавлен', data);
      setSources(prev => [data, ...prev]);
    } catch (error) {
      logger.error('❌ DEBUG: Исключение при добавлении источника', error);
      throw error;
    }
  }, [userId]);

  const updateSource = useCallback(async (id: string, updates: Partial<Source>) => {
    try {
      logger.info('🔧 DEBUG: Обновление источника', { id, updates });

      const { data, error } = await supabase
        .from('sources')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('❌ DEBUG: Ошибка обновления источника', error);
        throw error;
      }

      logger.success('✅ DEBUG: Источник обновлен', data);
      setSources(prev => 
        prev.map(source => source.id === id ? data : source)
      );
    } catch (error) {
      logger.error('❌ DEBUG: Исключение при обновлении источника', error);
      throw error;
    }
  }, []);

  const deleteSource = useCallback(async (id: string) => {
    try {
      logger.info('🔧 DEBUG: Удаление источника', { id });

      const { error } = await supabase
        .from('sources')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('❌ DEBUG: Ошибка удаления источника', error);
        throw error;
      }

      logger.success('✅ DEBUG: Источник удален');
      setSources(prev => prev.filter(source => source.id !== id));
    } catch (error) {
      logger.error('❌ DEBUG: Исключение при удалении источника', error);
      throw error;
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    await fetchSources(page + 1, true);
  }, [loading, hasMore, page, fetchSources]);

  useEffect(() => {
    fetchSources(0, false);
  }, [fetchSources]);

  return {
    sources,
    loading,
    hasMore,
    addSource,
    updateSource,
    deleteSource,
    loadMore
  };
};