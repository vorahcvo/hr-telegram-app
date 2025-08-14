import React from 'react';
import { Play, CheckCircle } from 'lucide-react';
import Button from '../UI/Button';

interface LessonCardProps {
  lesson: any;
  onStart: (lesson: any) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, onStart }) => {
  return (
    <div className="bg-[#2c2c2e] rounded-lg p-4 border border-[#3c3c3e]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-white font-medium mb-2">
            {lesson.title}
          </h3>
          {lesson.description && (
            <p className="text-[#8e8e93] text-sm mb-3">
              {lesson.description}
            </p>
          )}
          <div className="flex items-center text-xs text-[#8e8e93]">
            <span>Длительность: {lesson.duration || '5-10 мин'}</span>
            {lesson.completed && (
              <>
                <span className="mx-2">•</span>
                <span className="text-green-500">Завершено</span>
              </>
            )}
          </div>
        </div>
        
        <div className="ml-4">
          {lesson.completed ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onStart(lesson)}
            >
              <Play className="h-4 w-4 mr-1" />
              Начать
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonCard;