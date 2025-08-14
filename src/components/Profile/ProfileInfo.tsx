import React from 'react';
import { User } from '../../types';

interface ProfileInfoProps {
  profile: User;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile }) => {
  console.log('👤 ProfileInfo: Rendering with profile:', profile);

  return (
    <div className="bg-[#2c2c2e] rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-3 mb-4">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-12 h-12 rounded-full"
            onError={(e) => {
              console.log('👤 ProfileInfo: Avatar image failed to load');
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-12 h-12 bg-[#007aff] rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-white">{profile.name || 'Пользователь'}</h2>
          {profile.username && (
            <p className="text-[#8e8e93]">@{profile.username}</p>
          )}
          {profile.user_id && (
            <p className="text-xs text-[#8e8e93]">ID: {profile.user_id}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;