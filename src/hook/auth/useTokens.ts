import { useEffect, useState } from 'react';

//----- useTokens -----//
// Hook pour vérifier les tokens d'authentification //

const TOKEN_NAMES = {
  ACCESS: 'auth.access_token',
  REFRESH: 'auth.refresh_token'
} as const;

export function useTokens() {
  const [tokenStatus, setTokenStatus] = useState({
    access: false,
    refresh: false,
    isLoading: true
  });

  useEffect(() => {
    const checkCookies = () => {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key.trim()] = value;
        return acc;
      }, {} as Record<string, string>);

      setTokenStatus({
        access: !!cookies[TOKEN_NAMES.ACCESS],
        refresh: !!cookies[TOKEN_NAMES.REFRESH],
        isLoading: false
      });

      console.log('🍪 Cookies trouvés:', {
        access: !!cookies[TOKEN_NAMES.ACCESS],
        refresh: !!cookies[TOKEN_NAMES.REFRESH]
      });
    };

    // Vérifier au montage
    checkCookies();

    // Vérifier à chaque changement de cookie
    window.addEventListener('storage', checkCookies);
    return () => window.removeEventListener('storage', checkCookies);
  }, []);

  return tokenStatus;
}
