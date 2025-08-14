import React, { useState } from 'react';
import { Source } from '../../types';
import Modal from '../UI/Modal';
import Button from '../UI/Button';

interface ApplicationsFilterProps {
  isOpen: boolean;
  onClose: () => void;
  sources: Source[];
  onApplyFilter: (filters: any) => void;
  currentFilters: any;
}

const ApplicationsFilter: React.FC<ApplicationsFilterProps> = ({
  isOpen,
  onClose,
  sources,
  onApplyFilter,
  currentFilters
}) => {
  const [filters, setFilters] = useState(currentFilters);

  const handleApply = () => {
    onApplyFilter(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      status: '',
      source: '',
      dateFrom: '',
      dateTo: ''
    };
    setFilters(resetFilters);
    onApplyFilter(resetFilters);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Фильтры">
      <div className="space-y-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Статус
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-2 bg-[#2c2c2e] border border-[#3c3c3e] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:border-transparent"
          >
            <option value="">Все статусы</option>
            <option value="registered">Зарегистрирован</option>
            <option value="in_progress">В работе</option>
            <option value="contacted">Связались</option>
            <option value="rejected">Отклонен</option>
          </select>
        </div>

        {/* Source Filter */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Источник
          </label>
          <select
            value={filters.source}
            onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
            className="w-full px-3 py-2 bg-[#2c2c2e] border border-[#3c3c3e] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:border-transparent"
          >
            <option value="">Все источники</option>
            {sources.map(source => (
              <option key={source.id} value={source.id}>
                {source.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Дата с
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="w-full px-3 py-2 bg-[#2c2c2e] border border-[#3c3c3e] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Дата по
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className="w-full px-3 py-2 bg-[#2c2c2e] border border-[#3c3c3e] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:border-transparent"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="secondary"
            fullWidth
            onClick={handleReset}
          >
            Сбросить
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={handleApply}
          >
            Применить
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ApplicationsFilter;