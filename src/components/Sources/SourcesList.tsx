import React from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Source } from '../../types';
import Button from '../UI/Button';

interface SourcesListProps {
  sources: Source[];
  loading: boolean;
  onEdit: (source: Source) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const SourcesList: React.FC<SourcesListProps> = ({
  sources,
  loading,
  onEdit,
  onDelete,
  onAdd
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007aff]"></div>
      </div>
    );
  }

  if (sources.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-[#8e8e93] mb-4">
          <Plus className="mx-auto h-12 w-12" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">
          Нет источников
        </h3>
        <p className="text-[#8e8e93] mb-4">
          Добавьте первый источник для отслеживания заявок
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={onAdd}
        >
          Добавить источник
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sources.map((source) => (
        <div
          key={source.id}
          className="bg-[#2c2c2e] rounded-lg p-4 border border-[#3c3c3e]"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">
                {source.name}
              </h3>
              {source.description && (
                <p className="text-[#8e8e93] text-sm">
                  {source.description}
                </p>
              )}
              <div className="flex items-center mt-2 text-xs text-[#8e8e93]">
                <span>Заявок: {source.applications_count || 0}</span>
                {source.created_at && (
                  <>
                    <span className="mx-2">•</span>
                    <span>
                      {new Date(source.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(source)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(source.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SourcesList;