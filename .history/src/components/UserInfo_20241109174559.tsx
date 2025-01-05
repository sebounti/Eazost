'use client';

import React from 'react';
import { useUser } from '@/context/userContext';

const UserInfo = () => {
  const { currentUser, setCurrentUser } = useUser();

  const handleLogin = () => {
    setCurrentUser({ id: '1', name: 'Utilisateur Test', role: 'user' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div>
      {currentUser ? (
        <p>Utilisateur connecté : {currentUser.name}</p>
      ) : (
        <p>Aucun utilisateur connecté.</p>
      )}
      <button onClick={handleLogin}>Se connecter</button>
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  );
};

export default UserInfo;
