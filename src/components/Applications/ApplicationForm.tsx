import React, { useState, useEffect } from 'react';
import { Application, Source } from '../../types';
import { useTelegram } from '../../hooks/useTelegram';
import Button from '../UI/Button';

interface ApplicationFormProps {
  application?: Application;
  sources: Source[];
  onSave: (application: Omit<Application, 'id'>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  application,
  sources,
  onSave,
  onDelete
}) => {
  const { hapticFeedback } = useTelegram();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    status: 'registered' as Application['status'],
    source_id: '',
    source: '',
    date: new Date().toISOString().split('T')[0],
    comment: ''
  });

  useEffect(() => {
    if (application) {
      setFormData({
        name: application.name,
        phone: application.phone,
        email: application.email || '',
        status: application.status,
        source_id: application.source_id,
        source: application.source,
        date: application.date,
        comment: application.comment || ''
      });
    }
  }, [application]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSave(formData);
      hapticFeedback('success');
    } catch (error) {
      console.error('Error saving application:', error);
      hapticFeedback('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!application || !onDelete) return;

    if (confirm('Вы уверены, что хотите удалить эту заявку?')) {
      setIsLoading(true);
      try {
        await onDelete(application.id);
        hapticFeedback('success');
      } catch (error) {
        console.error('Error deleting application:', error);
        hapticFeedback('error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSourceChange = (sourceId: string) => {
    const selectedSource = sources.find(s => s.id === sourceId);
    setFormData(prev => ({
      ...prev,
      source_id: sourceId,
      source: selectedSource?.name || ''
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Имя *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          className="w-full px-3 py-2 bg-[#2c2c2e] border border-[#3c3c3e] rounded-lg text-white placeholder-[#8e8e93] focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:border-transparent"
          placeholder="Введите имя"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Телефон *
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          required
          className="w-full px-3 py-2 bg-[#2c2c2e] border border-[#3c3c3e] rounded-lg text-white placeholder-[#8e8e93] focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:border-transparent"
          placeholder="+7 (999) 123-45-67"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-3 py-2 bg-[#2c2c2e] border border-[#3c3c3e] rounded-lg text-white placeholder-[#8e8e93] focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:border-transparent"
          placeholder="email@example.com"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Статус
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Application['status'] }))}
          className="w-full px-3 py-2 bg-[#2c2c2e] border border-[#3c3c3e] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:border-transparent"
        >
          <option value="registered">Зарегистрирован</option>
          <option value="in_progress">В работе</option>
          <option value="contacted">Связались</option>
          <option value="rejected">Отклонен</option>
        </select>
      </div>

      {/* Source */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Источник *
        </label>
        <select
          value={formData.source_id}
          onChange={(e) => handleSourceChange(e.target.value)}
          required
          className="w-full px-3 py-2 bg-[#2c2c2e] border border-[#3c3c3e] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:border-transparent"
        >
          <option value="">Выберите источник</option>
          {sources.map(source => (
            <option key={source.id} value={source.id}>
              {source.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Дата *
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          required
          className="w-full px-3 py-2 bg-[#2c2c2e] border border-[#3c3c3e] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:border-transparent"
        />
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Комментарий
        </label>
        <textarea
          value={formData.comment}
          onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 bg-[#2c2c2e] border border-[#3c3c3e] rounded-lg text-white placeholder-[#8e8e93] focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:border-transparent resize-none"
          placeholder="Дополнительная информация..."
        />
      </div>

      {/* Buttons */}
      <div className={`flex gap-3 pt-4 ${application && onDelete ? 'grid grid-cols-2' : ''}`}>
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          isLoading={isLoading}
        >
          Сохранить
        </Button>
        
        {application && onDelete && (
          <Button
            type="button"
            variant="danger"
            size="md"
            fullWidth
            onClick={handleDelete}
            disabled={isLoading}
          >
            Удалить
          </Button>
        )}
      </div>
    </form>
  );
};

export default ApplicationForm;