'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
/**
 * Error page.
 *
 * Cette page affiche la page d'erreur authentification
 */

type ErrorProps = {
  error: Error & {
    type?: string;
    message: string;
  };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps): JSX.Element {
  const router = useRouter();

  const getErrorMessage = () => {
    switch (error.type) {
      case 'CredentialsSignin':
        return 'Email ou mot de passe incorrect';
      case 'OAuthSignin':
        return 'Erreur lors de la connexion avec le provider';
      case 'OAuthCallback':
        return 'Erreur lors de la réponse du provider';
      case 'EmailSignin':
        return 'Erreur lors de l\'envoi de l\'email';
      case 'SessionRequired':
        return 'Veuillez vous connecter pour accéder à cette page';
      default:
        return error.message || 'Une erreur est survenue';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Image
        src="/error.png"
        alt="Error"
        width={200}
        height={200}
        className="mb-8"
      />

      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Oups ! Une erreur est survenue
        </h1>

        <p className="text-xl text-gray-600">
          {getErrorMessage()}
        </p>

        <div className="space-x-4">
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Retour à la connexion
          </button>

          <button
            onClick={reset}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>
  );
}
