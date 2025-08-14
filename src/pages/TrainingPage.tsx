import React from 'react';
import Header from '../components/Layout/Header';

const TrainingPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <Header title="Обучение" />
      <div className="flex-1 p-4">
        <p className="text-center text-gray-400">Загрузка уроков...</p>
      </div>
    </div>
  );
};

export default TrainingPage;