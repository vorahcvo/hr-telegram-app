import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';
import Header from '../components/Layout/Header';
import LoadingSpinner from '../components/UI/LoadingSpinner';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  content: string;
  completed?: boolean;
}

const TrainingPage: React.FC = () => {
  const { user } = useUser();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  logger.info('TrainingPage рендеринг', { 
    user: user ? { id: user.id, user_id: user.user_id } : null, 
    lessonsCount: lessons.length, 
    loading, 
    error 
  });

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    logger.info('Загрузка уроков');

    try {
      setLoading(true);
      setError(null);

      // Загружаем все уроки
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: true });

      logger.info('Результат запроса уроков', { 
        lessonsCount: lessonsData?.length || 0, 
        lessonsError: lessonsError ? { code: lessonsError.code, message: lessonsError.message } : null 
      });

      if (lessonsError) {
        logger.error('Ошибка получения уроков', lessonsError);
        setError('Ошибка загрузки уроков');
        throw lessonsError;
      }

      // Если есть пользователь, загружаем прогресс
      if (user) {
        logger.info('Загрузка прогресса пользователя', { user_id: user.user_id });
        
        const { data: progressData, error: progressError } = await supabase
          .from('user_lessons')
          .select('*')
          .eq('user_id', user.user_id);

        logger.info('Результат запроса прогресса', { 
          progressCount: progressData?.length || 0, 
          progressError: progressError ? { code: progressError.code, message: progressError.message } : null 
        });

        if (progressError) {
          logger.error('Ошибка получения прогресса', progressError);
        } else {
          // Объединяем уроки с прогрессом
          const lessonsWithProgress = lessonsData?.map(lesson => {
            const progress = progressData?.find(p => p.lesson_id === lesson.id);
            return {
              ...lesson,
              completed: progress?.completed || false
            };
          });
          setLessons(lessonsWithProgress || []);
          logger.success('Уроки с прогрессом загружены', { count: lessonsWithProgress?.length || 0 });
        }
      } else {
        setLessons(lessonsData || []);
        logger.success('Уроки загружены (без прогресса)', { count: lessonsData?.length || 0 });
      }
    } catch (error) {
      logger.error('Ошибка в loadLessons', error);
      setError('Ошибка загрузки уроков');
    } finally {
      setLoading(false);
    }
  };

  const markLessonCompleted = async (lessonId: string) => {
    if (!user) {
      logger.warning('Нет пользователя, нельзя отметить урок как завершенный');
      return;
    }

    logger.info('Отметка урока как завершенного', { lessonId, user_id: user.user_id });

    try {
      const { error } = await supabase
        .from('user_lessons')
        .upsert({
          user_id: user.user_id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString()
        });

      if (error) {
        logger.error('Ошибка отметки урока как завершенного', error);
      } else {
        logger.success('Урок отмечен как завершенный');
        // Обновляем локальное состояние
        setLessons(prev => prev.map(lesson => 
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson
        ));
      }
    } catch (error) {
      logger.error('Ошибка в markLessonCompleted', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Обучение" />
      
      <div className="flex-1 p-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center text-[#8e8e93]">
            <p>{error}</p>
            <button 
              onClick={loadLessons}
              className="mt-2 text-[#007aff] hover:underline"
            >
              Попробовать снова
            </button>
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center text-[#8e8e93]">
            <p>Уроков пока нет</p>
            <p className="text-sm mt-1">Обучающие материалы появятся здесь</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="bg-[#2c2c2e] rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">{lesson.title}</h3>
                  {lesson.completed && (
                    <span className="text-green-400 text-sm">✓ Завершен</span>
                  )}
                </div>
                <p className="text-[#8e8e93] text-sm mb-2">{lesson.description}</p>
                <p className="text-[#8e8e93] text-xs mb-3">Длительность: {lesson.duration}</p>
                <div className="text-white text-sm mb-3">
                  {lesson.content}
                </div>
                {!lesson.completed && (
                  <button
                    onClick={() => markLessonCompleted(lesson.id)}
                    className="bg-[#007aff] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#0056cc] transition-colors"
                  >
                    Отметить как завершенный
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingPage;