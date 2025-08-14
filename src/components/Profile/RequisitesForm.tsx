import React, { useState } from 'react';
import { User } from '../../types';
import Button from '../UI/Button';

interface RequisitesFormProps {
  profile: User;
  onSave: (requisites: Partial<User>) => void;
  onCancel: () => void;
}

const RequisitesForm: React.FC<RequisitesFormProps> = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    inn: profile.inn || '',
    corporate_card: profile.corporate_card || '',
    account_number: profile.account_number || '',
    bik: profile.bik || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          ИНН
        </label>
        <input
          type="text"
          value={formData.inn}
          onChange={handleChange('inn')}
          className="w-full px-3 py-2 bg-[#2c2c2e] border border-[#3c3c3e] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#007aff]"
          placeholder="Введите ИНН"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Корпоративная карта
        </label>
        <input
          type="text"
          value={formData.corporate_card}
          onChange={handleChange('corporate_card')}
          className="w-full px-3 py-2 bg-[#2c2c2e] border border-[#3c3c3e] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#007aff]"
          placeholder="Введите номер карты"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Номер счета
        </label>
        <input
          type="text"
          value={formData.account_number}
          onChange={handleChange('account_number')}
          className="w-full px-3 py-2 bg-[#2c2c2e] border border-[#3c3c3e] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#007aff]"
          placeholder="Введите номер счета"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          БИК
        </label>
        <input
          type="text"
          value={formData.bik}
          onChange={handleChange('bik')}
          className="w-full px-3 py-2 bg-[#2c2c2e] border border-[#3c3c3e] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#007aff]"
          placeholder="Введите БИК"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          fullWidth
        >
          Отмена
        </Button>
        <Button
          type="submit"
          variant="primary"
          fullWidth
        >
          Сохранить
        </Button>
      </div>
    </form>
  );
};

export default RequisitesForm;