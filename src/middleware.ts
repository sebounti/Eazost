import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';


const PROTECTED_ROUTES = {
  owner: [
    '/dashboard',
    '/dashboard/account',
    '/dashboard/acessCode',
    '/dashboard/infoCard',
    '/dashboard/Messages',
    '/dashboard/property',
    '/dashboard/ShopManage',
    '/api/dashboard',
    '/api/properties',
    '/api/stayInfo',
    '/api/users',
    '/api/shop',
    '/api/stream',
  ],
  user: [
    '/homePage',
    '/user',
    '/api/stays/user',
    '/api/users/profile',
    '/api/shop',
    '/api/stream',
  ],
} as const;

const PUBLIC_ROUTES = [
  '/login',
  '/registration',
  '/api/auth',
  '/home',
  '/_next',
  '/favicon.ico',
  '/images',
  '/public',
  '/logo.png',
  '/photo1.jpg',
  '/api/auth/callback',
  '/api/auth/signin',
  '/api/auth/session',
  '/_next/static',
  '/generate_204',
  '/verify-email',
  '/verify-email-notice',
  '/api/auth/validationEmail',
  '/api/auth/verify-email',
];


//----- MIDDLEWARE -----//
// Middleware pour vérifier les autorisations et les tokens //
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Vérifier si c'est une route publique
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 2. Vérifier le token
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Vérifier les autorisations
  const userRole = token.account_type as keyof typeof PROTECTED_ROUTES;
  const isAuthorized = PROTECTED_ROUTES[userRole]?.some(route =>
    pathname.startsWith(route)
  );

  // 4. Rediriger si l'utilisateur n'est pas autorisé
  if (!isAuthorized) {
    const defaultPath = userRole === 'owner' ? '/dashboard' : '/homePage';
    return NextResponse.redirect(new URL(defaultPath, request.url));
  }

  return NextResponse.next();
}


//----- CONFIGURATION -----//
// Configuration pour le middleware //
export const config = {
  matcher: [
    // Protéger toutes les routes sauf les ressources statiques et les routes d'API publiques
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
};
