import React from 'react';
import { Edit } from 'lucide-react';
import { User } from '../../types';

interface RequisitesSectionProps {
  profile: User;
  onEdit: () => void;
}

const RequisitesSection: React.FC<RequisitesSectionProps> = ({ profile, onEdit }) => {
  const hasRequisites = profile.inn || profile.corporate_card || profile.account_number || profile.bik;

  return (
    <div className="bg-[#2c2c2e] rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">Реквизиты</h3>
        <button
          onClick={onEdit}
          className="p-2 bg-[#2c2c2e] text-white hover:bg-[#3c3c3e] rounded-lg transition-colors"
        >
          <Edit size={16} />
        </button>
      </div>
      
      {hasRequisites ? (
        <div className="space-y-2">
          {profile.inn && (
            <div>
              <span className="text-[#8e8e93]">ИНН:</span>
              <span className="text-white ml-2">{profile.inn}</span>
            </div>
          )}
          {profile.corporate_card && (
            <div>
              <span className="text-[#8e8e93]">Корпоративная карта:</span>
              <span className="text-white ml-2">{profile.corporate_card}</span>
            </div>
          )}
          {profile.account_number && (
            <div>
              <span className="text-[#8e8e93]">Номер счета:</span>
              <span className="text-white ml-2">{profile.account_number}</span>
            </div>
          )}
          {profile.bik && (
            <div>
              <span className="text-[#8e8e93]">БИК:</span>
              <span className="text-white ml-2">{profile.bik}</span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-[#8e8e93]">Реквизиты не заполнены</p>
      )}
    </div>
  );
};

export default RequisitesSection;