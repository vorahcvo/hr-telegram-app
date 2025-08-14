import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import Header from '../Layout/Header';
import Button from '../UI/Button';

interface LessonViewerProps {
  lesson: any;
  onComplete: (lessonId: string) => void;
  onBack: () => void;
}

const LessonViewer: React.FC<LessonViewerProps> = ({ lesson, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    onComplete(lesson.id);
  };

  const handleNext = () => {
    if (currentStep < (lesson.steps?.length || 1) - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header 
        title={lesson.title}
        showBack
        onBack={handleBack}
      />

      <div className="flex-1 p-4 pb-20 overflow-y-auto">
        {completed ? (
          <div className="text-center py-8">
            <div className="text-green-500 mb-4">
              <Check className="mx-auto h-16 w-16" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              Урок завершен!
            </h3>
            <p className="text-[#8e8e93] mb-6">
              Вы успешно прошли урок "{lesson.title}"
            </p>
            <Button
              variant="primary"
              onClick={onBack}
            >
              Вернуться к урокам
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {lesson.steps && lesson.steps.length > 0 ? (
              <div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#8e8e93]">
                      Шаг {currentStep + 1} из {lesson.steps.length}
                    </span>
                    <span className="text-sm text-[#8e8e93]">
                      {Math.round(((currentStep + 1) / lesson.steps.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-[#3c3c3e] rounded-full h-2">
                    <div
                      className="bg-[#007aff] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / lesson.steps.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-[#2c2c2e] rounded-lg p-4 border border-[#3c3c3e]">
                  <h3 className="text-white font-medium mb-3">
                    {lesson.steps[currentStep].title}
                  </h3>
                  <div className="text-[#8e8e93] mb-4">
                    {lesson.steps[currentStep].content}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#2c2c2e] rounded-lg p-4 border border-[#3c3c3e]">
                <h3 className="text-white font-medium mb-3">
                  {lesson.title}
                </h3>
                <div className="text-[#8e8e93] mb-4">
                  {lesson.description || 'Содержимое урока'}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Назад
                </Button>
              )}
              <Button
                variant="primary"
                fullWidth
                onClick={handleNext}
              >
                {currentStep < (lesson.steps?.length || 1) - 1 ? 'Далее' : 'Завершить'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonViewer;