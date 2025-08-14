import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { supabase } from '../lib/supabase';
import Header from '../components/Layout/Header';
import LoadingSpinner from '../components/UI/LoadingSpinner';

interface Source {
  id: string;
  name: string;
  status: 'active' | 'moderation' | 'blocked';
  url: string | null;
  is_default: boolean;
}

const SourcesPage: React.FC = () => {
  const { user } = useUser();
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🔗 SourcesPage: Rendering with state:', { 
    user, 
    sourcesCount: sources.length, 
    loading, 
    error 
  });

  useEffect(() => {
    if (user) {
      loadSources();
    }
  }, [user]);

  const loadSources = async () => {
    if (!user) {
      console.log('🔗 SourcesPage: No user, skipping load');
      return;
    }

    console.log('🔗 SourcesPage: Loading sources for user:', user.user_id);

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('sources')
        .select('*')
        .eq('user_id', user.user_id)
        .eq('deleted', false)
        .order('created_at', { ascending: false });

      console.log('🔗 SourcesPage: Database query result:', { data, fetchError });

      if (fetchError) {
        console.error('🔗 SourcesPage: Error fetching sources:', fetchError);
        setError('Ошибка загрузки источников');
        throw fetchError;
      }

      setSources(data || []);
      console.log('🔗 SourcesPage: Sources loaded:', data?.length || 0);
    } catch (error) {
      console.error('🔗 SourcesPage: Error in loadSources:', error);
      setError('Ошибка загрузки источников');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'moderation': return 'На модерации';
      case 'blocked': return 'Заблокирован';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'moderation': return 'text-yellow-400';
      case 'blocked': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Источники" />
      
      <div className="flex-1 p-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center text-[#8e8e93]">
            <p>{error}</p>
            <button 
              onClick={loadSources}
              className="mt-2 text-[#007aff] hover:underline"
            >
              Попробовать снова
            </button>
          </div>
        ) : sources.length === 0 ? (
          <div className="text-center text-[#8e8e93]">
            <p>Источников пока нет</p>
            <p className="text-sm mt-1">Источник по умолчанию создается автоматически</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sources.map((source) => (
              <div key={source.id} className="bg-[#2c2c2e] rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">
                    {source.name}
                    {source.is_default && (
                      <span className="ml-2 text-xs bg-[#007aff] text-white px-2 py-1 rounded">
                        По умолчанию
                      </span>
                    )}
                  </h3>
                  <span className={`text-sm ${getStatusColor(source.status)}`}>
                    {getStatusText(source.status)}
                  </span>
                </div>
                {source.url && (
                  <p className="text-[#8e8e93] text-sm">{source.url}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SourcesPage;