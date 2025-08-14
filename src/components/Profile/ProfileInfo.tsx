import React from 'react';
import { User } from '../../types';

interface ProfileInfoProps {
  profile: User;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile }) => {
  return (
    <div className="bg-[#2c2c2e] rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-3 mb-4">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <div className="w-12 h-12 bg-[#007aff] rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {profile.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-white">{profile.name}</h2>
          {profile.username && (
            <p className="text-[#8e8e93]">@{profile.username}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;