import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Calendar } from 'lucide-react';
import { Application, Source } from '../types';
import { useApplications } from '../hooks/useApplications';
import { useSources } from '../hooks/useSources';
import { useTelegram } from '../hooks/useTelegram';
import { useUser } from '../hooks/useUser';
import Header from '../components/Layout/Header';
import Button from '../components/UI/Button';
import EmptyState from '../components/UI/EmptyState';
import LoadMoreButton from '../components/UI/LoadMoreButton';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ApplicationsList from '../components/Applications/ApplicationsList';
import ApplicationForm from '../components/Applications/ApplicationForm';
import ApplicationsFilter from '../components/Applications/ApplicationsFilter';

const ApplicationsPage: React.FC = () => {
  const { hapticFeedback, sendCallback } = useTelegram();
  const { user, hasRequisites } = useUser();
  const { 
    applications, 
    loading, 
    hasMore, 
    addApplication, 
    updateApplication, 
    deleteApplication,
    loadMore 
  } = useApplications(user?.user_id);
  const { sources } = useSources(user?.user_id);
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    dateFrom: '',
    dateTo: ''
  });

  // Если реквизиты не заполнены, показываем заглушку
  if (!hasRequisites) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Заявки" />
        <div className="flex-1 flex items-center justify-center p-4">
          <EmptyState
            icon={Plus}
            title="Для начала работы заполните реквизиты"
            description="Добавьте свои реквизиты в разделе профиля для доступа к функциям приложения"
            actionText="Заполнить реквизиты"
            onAction={() => {
              window.dispatchEvent(new CustomEvent('switchTab', { detail: 'profile' }));
            }}
          />
        </div>
      </div>
    );
  }

  // Фильтрация заявок
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = !searchQuery || 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !filters.status || app.status === filters.status;
      const matchesSource = !filters.source || app.source_id === filters.source;
      
      const matchesDateFrom = !filters.dateFrom || 
        new Date(app.created_at) >= new Date(filters.dateFrom);
      const matchesDateTo = !filters.dateTo || 
        new Date(app.created_at) <= new Date(filters.dateTo);

      return matchesSearch && matchesStatus && matchesSource && matchesDateFrom && matchesDateTo;
    });
  }, [applications, searchQuery, filters]);

  const handleAddApplication = async (applicationData: Omit<Application, 'id'>) => {
    try {
      await addApplication(applicationData);
      setCurrentView('list');
      hapticFeedback('success');
    } catch (error) {
      console.error('Error adding application:', error);
    }
  };

  const handleEditApplication = async (applicationData: Omit<Application, 'id'>) => {
    if (selectedApplication) {
      try {
        await updateApplication(selectedApplication.id, applicationData);
        setCurrentView('list');
        setSelectedApplication(null);
        hapticFeedback('success');
      } catch (error) {
        console.error('Error updating application:', error);
      }
    }
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      await deleteApplication(id);
      setCurrentView('list');
      setSelectedApplication(null);
      hapticFeedback('success');
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const handleEditClick = (application: Application) => {
    setSelectedApplication(application);
    setCurrentView('edit');
  };

  const handleRequestResponses = () => {
    sendCallback('phones_request');
    hapticFeedback('light');
  };

  const hasActiveFilters = filters.status || filters.source || filters.dateFrom || filters.dateTo;

  if (currentView === 'add') {
    return (
      <div className="flex flex-col h-full">
        <Header 
          title="Добавить заявку" 
          showBack
          onBack={() => setCurrentView('list')}
        />
        <div className="flex-1 p-4 pb-20 overflow-y-auto">
          <ApplicationForm
            sources={sources}
            onSave={handleAddApplication}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'edit' && selectedApplication) {
    return (
      <div className="flex flex-col h-full">
        <Header 
          title="Редактировать заявку" 
          showBack
          onBack={() => {
            setCurrentView('list');
            setSelectedApplication(null);
          }}
        />
        <div className="flex-1 p-4 pb-20 overflow-y-auto">
          <ApplicationForm
            application={selectedApplication}
            sources={sources}
            onSave={handleEditApplication}
            onDelete={handleDeleteApplication}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Заявки" 
        rightElement={
          <Button variant="primary" size="sm" onClick={() => setCurrentView('add')}>
            <Plus size={16} />
          </Button>
        }
      />

      <div className="flex-1 p-4 pb-20 space-y-4 overflow-y-auto">
        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8e8e93]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по имени или телефону"
              className="w-full pl-10 pr-3 py-2 bg-[#1c1c1e] border border-[#3c3c3e] rounded-lg text-white placeholder-[#8e8e93] focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className={`p-2 rounded-lg transition-colors ${
              hasActiveFilters 
                ? 'bg-[#007aff] text-white' 
                : 'bg-[#2c2c2e] text-[#8e8e93] hover:text-white'
            }`}
          >
            <Filter size={16} />
          </button>
        </div>

        {/* Request Responses Button */}
        {hasRequisites && (
          <Button variant="secondary" fullWidth onClick={handleRequestResponses}>
            Запросить отклики
          </Button>
        )}

        {loading && applications.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <>
            <ApplicationsList 
              applications={filteredApplications}
              onEdit={handleEditClick}
            />
            <LoadMoreButton
              onLoadMore={loadMore}
              loading={loading}
              hasMore={hasMore}
            />
          </>
        )}
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <ApplicationsFilter
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          sources={sources}
          onApplyFilter={setFilters}
          currentFilters={filters}
        />
      )}
    </div>
  );
};

export default ApplicationsPage;