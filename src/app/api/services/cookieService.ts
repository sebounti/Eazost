import { NextResponse } from 'next/server';
import { TOKEN_CONFIG } from './allTokenService';

export const setCookie = (
  cookies: NextResponse['cookies'],
  name: string,
  value: string,
  options: {
    maxAge?: number;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    domain?: string;
  } = {}
) => {
  cookies.set(name, value, {
    ...options,
    path: '/',
    domain: process.env.COOKIE_DOMAIN || 'localhost',
  });
};



// Fonction pour envoyer les tokens en tant que cookies sécurisés
export function setAuthCookies(response: Response, accessToken: string, refreshToken: string) {
	console.log('🍪 Configuration des cookies d\'authentification');

	const domain = process.env.COOKIE_DOMAIN || 'localhost'; // Utilise "localhost" en local
	const isSecure = process.env.NODE_ENV === 'production'; // Active "Secure" uniquement en production

	// Configure les cookies d'accès et de rafraîchissement
	const accessCookie = `${TOKEN_CONFIG.NAMES.ACCESS}=${accessToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${TOKEN_CONFIG.DURATION.ACCESS_COOKIE}; Domain=${domain}; ${isSecure ? 'Secure;' : ''}`;
	const refreshCookie = `${TOKEN_CONFIG.NAMES.REFRESH}=${refreshToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${TOKEN_CONFIG.DURATION.REFRESH_COOKIE}; Domain=${domain}; ${isSecure ? 'Secure;' : ''}`;

	response.headers.append('Set-Cookie', accessCookie);
	response.headers.append('Set-Cookie', refreshCookie);

	console.log('✅ Cookies configurés :', {
	  accessCookie,
	  refreshCookie,
	});

	console.log('📝 Access Token expire dans :', TOKEN_CONFIG.DURATION.ACCESS_COOKIE, 'secondes');
	console.log('📝 Refresh Token expire dans :', TOKEN_CONFIG.DURATION.REFRESH_COOKIE, 'secondes');
  }




// Parse les cookies en un objet
export function parseCookies(cookieHeader: string | null): { [key: string]: string } {
	if (!cookieHeader) return {};
	return cookieHeader.split(';').reduce((acc: { [key: string]: string }, cookie) => {
	  const [key, value] = cookie.trim().split('=');
	  acc[key.toLowerCase()] = value;
	  return acc;
	}, {});
  }



// Efface les cookies d'authentification
export function clearAuthCookies(response: Response) {
	console.log('🧹 Nettoyage des cookies d\'authentification');

	const options = {
	  path: '/',
	  httpOnly: true,
	  secure: process.env.NODE_ENV === 'production',
	  sameSite: 'strict' as const,
	  maxAge: 0, // Expire immédiatement
	};

	// Supprime les cookies d'authentification
	response.headers.append('Set-Cookie', `${TOKEN_CONFIG.NAMES.ACCESS}=; ${serializeCookieOptions(options)}`);
	response.headers.append('Set-Cookie', `${TOKEN_CONFIG.NAMES.REFRESH}=; ${serializeCookieOptions(options)}`);

	console.log('✅ Cookies d\'authentification supprimés');
  }

  function serializeCookieOptions(options: Record<string, any>) {
	return Object.entries(options)
	  .map(([key, value]) => `${key}=${value}`)
	  .join('; ');
  }
