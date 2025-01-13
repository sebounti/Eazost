import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log('\n🔒 --- Début Middleware ---');
    console.log(`📍 Route demandée: ${req.nextUrl.pathname}`);
    console.log('🔑 Token complet:', req.nextauth.token);

    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login');

    console.log('🔑 État détaillé:', {
      isAuth,
      isAuthPage,
      accountType: token?.account_type,
      userId: token?.id,
      email: token?.email
    });

    // Si c'est la page de login
    if (isAuthPage) {
      if (!isAuth) {
        // Permettre l'accès à la page de login si non authentifié
        return NextResponse.next();
      }


      const dashboardPath = token.account_type === 'owner'
        ? '/dashboard'
        : '/dashboard';

      return NextResponse.redirect(new URL(dashboardPath, req.url));
    }

    // Vérification de l'authentification
    if (!isAuth) {
      let callbackUrl = req.nextUrl.pathname;
      return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url));
    }

    // Vérification des accès selon account_type
    if (req.nextUrl.pathname.startsWith('/owner')) {
      if (token.account_type !== 'owner') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    // Vérification des accès selon account_type
    if (req.nextUrl.pathname.startsWith('/user')) {
      console.log('🔍 Vérification accès /user:', {
        actual: token.account_type,
        required: 'user'
      });

      if (token.account_type !== 'user') {
        console.log('❌ Accès refusé: mauvais type de compte');
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Permettre l'accès à /login sans token
        if (req.nextUrl.pathname.startsWith('/login')) {
          return true;
        }
        // Pour les autres routes, vérifier le token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/login',
    '/owner/:path*',
    '/user/:path*',
    '/dashboard/:path*'
  ]
};
