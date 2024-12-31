// src/components/UserAvatar/index.jsx
import React, { useState } from 'react';

const UserAvatar = ({ user }) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (user?.user_metadata?.avatar_url && !imageError) {
    return (
      <img
        src={user.user_metadata.avatar_url}
        alt={user.user_metadata.full_name}
        className="h-8 w-8 rounded-full"
        onError={() => setImageError(true)}
      />
    );
  }

  // Fallback to initials
  return (
    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
      {getInitials(user?.user_metadata?.full_name || 'User')}
    </div>
  );
};

export default UserAvatar;