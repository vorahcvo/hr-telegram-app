import React from 'react';

interface ProgressBarProps {
  completed: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="bg-[#2c2c2e] rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-medium">Прогресс обучения</h3>
        <span className="text-[#8e8e93] text-sm">
          {completed} из {total}
        </span>
      </div>
      
      <div className="w-full bg-[#3c3c3e] rounded-full h-2">
        <div
          className="bg-[#007aff] h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="mt-2 text-center">
        <span className="text-[#8e8e93] text-sm">
          {percentage.toFixed(0)}% завершено
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;