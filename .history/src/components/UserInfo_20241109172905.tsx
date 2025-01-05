// src/components/UserInfo.tsx

import React from 'react';
import { useUser } from '@/context/userContext';

const UserInfo = () => {
  const { currentUser } = useUser();

  return (
    <div>
      {currentUser ? (
        <p>Utilisateur connecté : {currentUser.name}</p>
      ) : (
        <p>Aucun utilisateur connecté.</p>
      )}
    </div>
  );
};

export default UserInfo;
