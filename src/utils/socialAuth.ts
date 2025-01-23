//----- socialAuth -----//
// gérer la connexion avec Google et Facebook //

import { signIn } from 'next-auth/react';

export const handleGoogleSignIn = async () => {
  try {
    // Utilise la fonction signIn de next-auth pour gérer la connexion avec Google
    const response = await signIn('google', { callbackUrl: '/dashboard' });
    if (!response) {
      throw new Error('Erreur lors de la connexion avec Google');
    }
  } catch (error) {
    console.error('Erreur lors de la connexion avec Google :', error);
  }
};

export const handleFacebookSignIn = async () => {
  try {
    // Utilise la fonction signIn de next-auth pour gérer la connexion avec Facebook
    const response = await signIn('facebook', { callbackUrl: '/dashboard' });
    if (!response) {
      throw new Error('Erreur lors de la connexion avec Facebook');
    }
  } catch (error) {
    console.error('Erreur lors de la connexion avec Facebook :', error);
  }
};
