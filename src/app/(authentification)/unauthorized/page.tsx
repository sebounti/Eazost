'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

/**
 * Unauthorized page.
 *
 * Cette page s'affiche quand l'utilisateur n'a pas les droits d'accès nécessaires
 */

export default function UnauthorizedPage(): JSX.Element {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Image
        src="/unauthorized.png"
        alt="Unauthorized Access"
        width={200}
        height={200}
        className="mb-8"
      />

      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Accès Non Autorisé
        </h1>

        <p className="text-xl text-gray-600">
          Désolé, vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>

        <div className="space-x-4">
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Se connecter
          </button>

          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Retour
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administrateur.
        </p>
      </div>
    </div>
  );
}
