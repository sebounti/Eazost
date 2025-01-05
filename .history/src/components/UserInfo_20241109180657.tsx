'use client';

import React from 'react';
import { useUser } from '@/context/userContext';

const TestPage = () => {
  // Utilisation du hook useUser pour accéder aux données utilisateur
  const { currentUser, setCurrentUser } = useUser();

  // Fonction pour simuler la connexion
  const handleLogin = () => {
    setCurrentUser({ id: '1', name: 'lenne sebastien', role: 'owner' });
  };

  // Fonction pour simuler la déconnexion
  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <main>
      <h1>Page de Test pour UserContext</h1>
      {currentUser ? (
        <p>Utilisateur connecté : {currentUser.name}</p>
		<p
      ) : (
        <p>Aucun utilisateur connecté.</p>
      )}
      <button onClick={handleLogin}>Se connecter</button>
      <button onClick={handleLogout}>Se déconnecter</button>
    </main>
  );
};

export default TestPage;
