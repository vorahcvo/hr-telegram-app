import React from 'react';
import Header from '../components/Layout/Header';

const ApplicationsPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <Header title="Заявки" />
      <div className="flex-1 p-4">
        <p className="text-center text-gray-400">Загрузка заявок...</p>
      </div>
    </div>
  );
};

export default ApplicationsPage;