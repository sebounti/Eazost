// src/components/UserInfo.tsx

import React from 'react';
import { useUser } from '@/context';

const UserInfo = () => {
  const { currentUser, setCurrentUser } = useUser();

  // Fonction pour simuler la connexion
  const handleLogin = () => {
    setCurrentUser({ id: "1", name: "Utilisateur Test" });
  };

  // Fonction pour simuler la déconnexion
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

      {/* Boutons pour se connecter et se déconnecter */}
      <button onClick={handleLogin}>Se connecter</button>
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  );
};

export default UserInfo;
