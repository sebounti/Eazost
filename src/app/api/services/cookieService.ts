import { NextResponse } from 'next/server';
import { TOKEN_CONFIG } from '@/app/api/services/tokenService';

//---- COOKIE CONFIGURATION ----//
// Gere la creation et la gestion des cookies //


interface CookieOptions {
  maxAge?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  domain?: string;
  path?: string;
}

export const setCookie = (
  cookies: NextResponse['cookies'],
  name: string,
  value: string,
  options: CookieOptions = {}
) => {
  cookies.set(name, value, {
    ...options,
    path: '/',
    domain: process.env.COOKIE_DOMAIN || 'localhost',
  });
};

// Parse les cookies en un objet
export function parseCookies(cookieHeader: string | null): Record<string, string> {
	if (!cookieHeader) return {};
	return cookieHeader.split(';').reduce((acc, cookie) => {
	  const [key, value] = cookie.trim().split('=');
	  acc[key.toLowerCase()] = value;
	  return acc;
	}, {} as Record<string, string>);
  }

// Efface les cookies d'authentification
export function clearAuthCookies(response: NextResponse) {
	console.log('🧹 Nettoyage des cookies d\'authentification');

	const options: CookieOptions = {
	  path: '/',
	  httpOnly: true,
	  secure: process.env.NODE_ENV === 'production',
	  sameSite: 'strict',
	  maxAge: 0, // Expire immédiatement
	};

	// Supprime les cookies d'authentification
	response.cookies.set(TOKEN_CONFIG.NAMES.ACCESS, '', options);
	response.cookies.set(TOKEN_CONFIG.NAMES.REFRESH, '', options);

	console.log('✅ Cookies d\'authentification supprimés');
  }

  function serializeCookieOptions(options: Record<string, any>) {
	return Object.entries(options)
	  .map(([key, value]) => `${key}=${value}`)
	  .join('; ');
  }
