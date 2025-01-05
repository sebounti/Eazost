// Exemple de composant CookieConsent pour le RGPD
'use client';
import { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true); // Afficher le toast si l'utilisateur n'a pas déjà donné son consentement
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowConsent(false); // Cacher le toast après acceptation
  };

  const refuseCookies = () => {
    localStorage.setItem('cookieConsent', 'refused');
    setShowConsent(false); // Cacher le toast après refus
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 w-full bg-gray-800 text-white p-4 flex justify-between items-center">
      <p>
        Nous utilisons des cookies pour vous offrir une meilleure expérience et analyser le trafic du site.
        Consultez notre <a href="/cookie-policy" className="underline">politique de confidentialité</a> pour en savoir plus.
      </p>
      <div className="flex space-x-2">
        <button onClick={acceptCookies} className="bg-amber-500 px-4 py-2 rounded-xl">
          Accepter
        </button>
        <button onClick={refuseCookies} className="bg-red-500 px-4 py-2 rounded-xl">
          Refuser
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
