import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Routes protégées par rôle
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
    '/api/stream'
  ],
  user: [
    '/homePage',
    '/user',
    '/api/stays/user',
    '/api/users/profile',
    '/api/shop',
    '/api/stream'
  ]
} as const;

// Seules routes publiques autorisées
const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/api/auth',  // Routes d'authentification
  '/_next',     // Ressources Next.js
  '/favicon.ico',
  '/images'     // Images publiques
];

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // 1. Autoriser les ressources statiques et routes d'auth
    if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
      // Si c'est /login et que l'utilisateur est connecté, rediriger
      if (pathname === '/login') {
        const token = await getToken({ req: request });
        if (token?.account_type) {
          const redirectPath = token.account_type === 'owner' ? '/dashboard' : '/homePage';
          return NextResponse.redirect(new URL(redirectPath, request.url));
        }
      }
      return NextResponse.next();
    }

    console.log('🚀 Middleware - Début pour:', pathname);

    // 2. Vérifier l'authentification
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token?.accessToken) {
      console.log('❌ Accès refusé - pas de token');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3. Vérifier le rôle et les permissions
    const userRole = token.account_type as keyof typeof PROTECTED_ROUTES;
    if (!userRole) {
      console.log('❌ Accès refusé - rôle non défini');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // 4. Vérifier les accès selon le rôle
    const ownerRoutes = PROTECTED_ROUTES.owner;
    const userRoutes = PROTECTED_ROUTES.user;

    // Rediriger les users qui tentent d'accéder aux routes owner
    if (userRole === 'user' && ownerRoutes.some(route => pathname.startsWith(route))) {
      console.log('❌ Accès refusé - route owner');
      return NextResponse.redirect(new URL('/homePage', request.url));
    }

    // Pour les API, renvoyer 403 au lieu de rediriger
    if (pathname.startsWith('/api/')) {
      const isAuthorized = PROTECTED_ROUTES[userRole].some(route =>
        pathname.startsWith(route)
      );

      if (!isAuthorized) {
        return new NextResponse(
          JSON.stringify({ error: 'Non autorisé' }),
          { status: 403 }
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('🔴 Erreur middleware:', error);
    const pathname = request.nextUrl.pathname;

    if (pathname.startsWith('/api/')) {

      return new NextResponse(
        JSON.stringify({ error: 'Erreur serveur' }),
        { status: 500 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
