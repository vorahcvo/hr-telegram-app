import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Lesson } from '../types';
import { logger } from '../utils/logger';

interface UseLessonsReturn {
  lessons: Lesson[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

const ITEMS_PER_PAGE = 20;

export const useLessons = (): UseLessonsReturn => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchLessons = useCallback(async (pageNum: number = 0, append: boolean = false) => {
    try {
      setLoading(true);
      logger.info(`🔧 DEBUG: Загрузка уроков, страница ${pageNum}`);

      const from = pageNum * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('lessons')
        .select('*', { count: 'exact' })
        .order('order_index', { ascending: true })
        .range(from, to);

      if (error) {
        logger.error('❌ DEBUG: Ошибка загрузки уроков', error);
        throw error;
      }

      logger.info(`📊 DEBUG: Загружено уроков: ${data?.length || 0}`);
      
      if (append) {
        setLessons(prev => [...prev, ...(data || [])]);
      } else {
        setLessons(data || []);
      }

      setHasMore((data?.length || 0) === ITEMS_PER_PAGE);
      setPage(pageNum);
    } catch (error) {
      logger.error('❌ DEBUG: Исключение при загрузке уроков', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    await fetchLessons(page + 1, true);
  }, [loading, hasMore, page, fetchLessons]);

  useEffect(() => {
    fetchLessons(0, false);
  }, [fetchLessons]);

  return {
    lessons,
    loading,
    hasMore,
    loadMore
  };
};