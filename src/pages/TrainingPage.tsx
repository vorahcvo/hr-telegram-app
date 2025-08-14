import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { supabase } from '../lib/supabase';
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

  console.log('📚 TrainingPage: Rendering with state:', { 
    user, 
    lessonsCount: lessons.length, 
    loading, 
    error 
  });

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    console.log('📚 TrainingPage: Loading lessons');

    try {
      setLoading(true);
      setError(null);

      // Загружаем все уроки
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: true });

      console.log('📚 TrainingPage: Lessons query result:', { lessonsData, lessonsError });

      if (lessonsError) {
        console.error('📚 TrainingPage: Error fetching lessons:', lessonsError);
        setError('Ошибка загрузки уроков');
        throw lessonsError;
      }

      // Если есть пользователь, загружаем прогресс
      if (user) {
        console.log('📚 TrainingPage: Loading user progress for user:', user.user_id);
        
        const { data: progressData, error: progressError } = await supabase
          .from('user_lessons')
          .select('*')
          .eq('user_id', user.user_id);

        console.log('📚 TrainingPage: Progress query result:', { progressData, progressError });

        if (progressError) {
          console.error('📚 TrainingPage: Error fetching progress:', progressError);
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
        }
      } else {
        setLessons(lessonsData || []);
      }

      console.log('📚 TrainingPage: Lessons loaded:', lessonsData?.length || 0);
    } catch (error) {
      console.error('📚 TrainingPage: Error in loadLessons:', error);
      setError('Ошибка загрузки уроков');
    } finally {
      setLoading(false);
    }
  };

  const markLessonCompleted = async (lessonId: string) => {
    if (!user) {
      console.log('📚 TrainingPage: No user, cannot mark lesson completed');
      return;
    }

    console.log('📚 TrainingPage: Marking lesson as completed:', lessonId);

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
        console.error('📚 TrainingPage: Error marking lesson completed:', error);
      } else {
        console.log('📚 TrainingPage: Lesson marked as completed');
        // Обновляем локальное состояние
        setLessons(prev => prev.map(lesson => 
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson
        ));
      }
    } catch (error) {
      console.error('📚 TrainingPage: Error in markLessonCompleted:', error);
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