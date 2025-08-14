import React from 'react';
import { Phone } from 'lucide-react';
import { Application } from '../../types';
import EmptyState from '../UI/EmptyState';

interface ApplicationsListProps {
  applications: Application[];
  onEdit: (application: Application) => void;
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({ applications, onEdit }) => {
  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'registered':
        return 'text-[#8e8e93] bg-[#2c2c2e]';
      case 'in_progress':
        return 'text-[#007aff] bg-[#1a2332]';
      case 'contacted':
        return 'text-[#34c759] bg-[#1e2d1e]';
      case 'rejected':
        return 'text-[#ff3b30] bg-[#2d1e1e]';
      default:
        return 'text-[#8e8e93] bg-[#2c2c2e]';
    }
  };

  const getStatusText = (status: Application['status']) => {
    switch (status) {
      case 'registered':
        return 'Зарегистрирован';
      case 'in_progress':
        return 'В работе';
      case 'contacted':
        return 'Связались';
      case 'rejected':
        return 'Отклонен';
      default:
        return status;
    }
  };

  if (applications.length === 0) {
    return (
      <EmptyState
        icon={Phone}
        title="Заявок пока нет"
        description="Добавьте первую заявку, нажав кнопку выше"
      />
    );
  }

  return (
    <div className="space-y-2">
      {applications.map((application) => (
        <div
          key={application.id}
          className={`bg-[#2c2c2e] rounded-xl p-4 transition-colors ${
            application.status !== 'registered' 
              ? 'hover:bg-[#3c3c3e] cursor-pointer' 
              : 'opacity-50'
          }`}
          onClick={() => application.status !== 'registered' && onEdit(application)}
        >
          <div className="flex items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium text-white truncate">{application.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                  {getStatusText(application.status)}
                </span>
              </div>
              
              <div className="space-y-1 text-sm text-[#8e8e93]">
                <p className="flex items-center gap-2">
                  <Phone size={14} />
                  {application.phone}
                </p>
                <p>Дата: {new Date(application.date).toLocaleDateString('ru-RU')}</p>
                <p>Источник: {application.source}</p>
                {application.comment && (
                  <p className="text-xs mt-2 text-[#ffffff] bg-[#1c1c1e] p-2 rounded-lg">
                    {application.comment}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationsList;