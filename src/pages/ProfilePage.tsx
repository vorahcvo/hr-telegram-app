import React, { useState } from 'react';
import { MessageCircle, UserX } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';
import { useUser } from '../hooks/useUser';
import { logger } from '../utils/logger';
import Header from '../components/Layout/Header';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Modal from '../components/UI/Modal';
import ProfileInfo from '../components/Profile/ProfileInfo';
import RequisitesSection from '../components/Profile/RequisitesSection';
import RequisitesForm from '../components/Profile/RequisitesForm';

const ProfilePage: React.FC = () => {
  const { sendCallback, hapticFeedback } = useTelegram();
  const { user, loading, updateUser, hasRequisites } = useUser();
  const [showRequisitesModal, setShowRequisitesModal] = useState(false);
  const [showTerminateConfirm, setShowTerminateConfirm] = useState(false);

  logger.info('ProfilePage рендеринг', { 
    user: user ? { id: user.id, name: user.name, user_id: user.user_id } : null, 
    loading, 
    hasRequisites 
  });

  if (loading) {
    logger.info('ProfilePage: показываем состояние загрузки');
    return (
      <div className="flex flex-col h-full">
        <Header title="Профиль" />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!user) {
    logger.error('ProfilePage: нет данных пользователя, показываем ошибку');
    return (
      <div className="flex flex-col h-full">
        <Header title="Профиль" />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-[#8e8e93] mb-2">Ошибка загрузки профиля</p>
            <p className="text-sm text-[#8e8e93]">Попробуйте перезагрузить приложение</p>
          </div>
        </div>
      </div>
    );
  }

  logger.info('ProfilePage: данные пользователя загружены', { 
    id: user.id, 
    name: user.name, 
    user_id: user.user_id 
  });

  const handleSaveRequisites = async (requisites: any) => {
    logger.info('Сохранение реквизитов', requisites);
    try {
      await updateUser(requisites);
      setShowRequisitesModal(false);
      hapticFeedback('success');
      logger.success('Реквизиты успешно сохранены');
    } catch (error) {
      logger.error('Ошибка сохранения реквизитов', error);
    }
  };

  const handleSupportRequest = () => {
    logger.info('Запрос поддержки');
    sendCallback('support_request');
    hapticFeedback('light');
  };

  const handleTerminateContract = () => {
    logger.info('Расторжение договора');
    sendCallback('fired_request');
    setShowTerminateConfirm(false);
    hapticFeedback('light');
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Профиль" />

      <div className="flex-1 p-4 pb-20 overflow-y-auto">
        <ProfileInfo profile={user} />
        
        <RequisitesSection 
          profile={user}
          onEdit={() => setShowRequisitesModal(true)}
        />

        <div className="space-y-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={handleSupportRequest}
          >
            <div className="flex items-center justify-center gap-2">
              <MessageCircle size={16} />
              <span>Обратиться в поддержку</span>
            </div>
          </Button>

          {hasRequisites && (
            <Button
              variant="danger"
              fullWidth
              onClick={() => setShowTerminateConfirm(true)}
            >
              <div className="flex items-center justify-center gap-2">
                <UserX size={16} />
                <span>Расторгнуть договор</span>
              </div>
            </Button>
          )}
        </div>
      </div>

      {/* Модальное окно для редактирования реквизитов */}
      <Modal
        isOpen={showRequisitesModal}
        onClose={() => setShowRequisitesModal(false)}
        title="Редактировать реквизиты"
      >
        <RequisitesForm
          profile={user}
          onSave={handleSaveRequisites}
          onCancel={() => setShowRequisitesModal(false)}
        />
      </Modal>

      {/* Модальное окно подтверждения расторжения */}
      <Modal
        isOpen={showTerminateConfirm}
        onClose={() => setShowTerminateConfirm(false)}
        title="Подтверждение"
      >
        <div className="p-4">
          <p className="text-center mb-4">
            Вы уверены, что хотите расторгнуть договор?
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowTerminateConfirm(false)}
            >
              Отмена
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={handleTerminateContract}
            >
              Расторгнуть
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;