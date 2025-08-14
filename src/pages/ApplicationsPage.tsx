import React, { useState, useEffect } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import { useUser } from '../hooks/useUser';
import { supabase } from '../lib/supabase';
import Header from '../components/Layout/Header';
import LoadingSpinner from '../components/UI/LoadingSpinner';

interface Application {
  id: string;
  full_name: string;
  phone: string;
  date: string;
  status: 'registered' | 'in_progress' | 'rejected' | 'contacted';
  comment: string | null;
}

const ApplicationsPage: React.FC = () => {
  const { user: tgUser } = useTelegram();
  const { user } = useUser();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('📋 ApplicationsPage: Rendering with state:', { 
    tgUser, 
    user, 
    applicationsCount: applications.length, 
    loading, 
    error 
  });

  useEffect(() => {
    if (user) {
      loadApplications();
    }
  }, [user]);

  const loadApplications = async () => {
    if (!user) {
      console.log('📋 ApplicationsPage: No user, skipping load');
      return;
    }

    console.log('📋 ApplicationsPage: Loading applications for user:', user.user_id);

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.user_id)
        .eq('deleted', false)
        .order('created_at', { ascending: false });

      console.log('📋 ApplicationsPage: Database query result:', { data, fetchError });

      if (fetchError) {
        console.error('📋 ApplicationsPage: Error fetching applications:', fetchError);
        setError('Ошибка загрузки заявок');
        throw fetchError;
      }

      setApplications(data || []);
      console.log('📋 ApplicationsPage: Applications loaded:', data?.length || 0);
    } catch (error) {
      console.error('📋 ApplicationsPage: Error in loadApplications:', error);
      setError('Ошибка загрузки заявок');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'registered': return 'Зарегистрирована';
      case 'in_progress': return 'В работе';
      case 'rejected': return 'Отклонена';
      case 'contacted': return 'Связались';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered': return 'text-blue-400';
      case 'in_progress': return 'text-yellow-400';
      case 'rejected': return 'text-red-400';
      case 'contacted': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Заявки" />
      
      <div className="flex-1 p-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center text-[#8e8e93]">
            <p>{error}</p>
            <button 
              onClick={loadApplications}
              className="mt-2 text-[#007aff] hover:underline"
            >
              Попробовать снова
            </button>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center text-[#8e8e93]">
            <p>Заявок пока нет</p>
            <p className="text-sm mt-1">Новые заявки появятся здесь</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="bg-[#2c2c2e] rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">{app.full_name}</h3>
                  <span className={`text-sm ${getStatusColor(app.status)}`}>
                    {getStatusText(app.status)}
                  </span>
                </div>
                <p className="text-[#8e8e93] text-sm mb-1">{app.phone}</p>
                <p className="text-[#8e8e93] text-sm mb-2">{app.date}</p>
                {app.comment && (
                  <p className="text-white text-sm">{app.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;