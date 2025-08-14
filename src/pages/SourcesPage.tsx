import React from 'react';
import Header from '../components/Layout/Header';

const SourcesPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <Header title="Источники" />
      <div className="flex-1 p-4">
        <p className="text-center text-gray-400">Загрузка источников...</p>
      </div>
    </div>
  );
};

export default SourcesPage;