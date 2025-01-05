import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log('\n🔒 --- Début Middleware ---');
    console.log(`📍 Route demandée: ${req.nextUrl.pathname}`);

    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login');

    console.log('🔑 État authentification:', {
      isAuth,
      isAuthPage,
      userRole: token?.role || 'non connecté'
    });

    // Gestion des pages d'authentification
    if (isAuthPage) {
      if (isAuth) {
        console.log('⤴️ Redirection: Utilisateur déjà connecté -> dashboard');
        return NextResponse.redirect(new URL(`/${token.role}/dashboard`, req.url));
      }
      console.log('✅ Accès autorisé à la page de login');
      return null;
    }

    // Vérification de l'authentification
    if (!isAuth) {
      console.log('❌ Accès refusé: Utilisateur non authentifié');
      let callbackUrl = req.nextUrl.pathname;
      console.log(`⤴️ Redirection vers: /login?callbackUrl=${callbackUrl}`);
      return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url));
    }

    // Vérification des permissions basées sur account_type
    if (req.nextUrl.pathname.startsWith('/owner')) {
      console.log('🔍 Vérification des permissions /owner');
      if (token?.role !== 'owner') {
        console.log('❌ Accès refusé: Rôle incorrect', { required: 'owner', actual: token?.role });
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    if (req.nextUrl.pathname.startsWith('/user')) {
      console.log('🔍 Vérification des permissions /user');
      if (token?.role !== 'user') {
        console.log('❌ Accès refusé: Rôle incorrect', { required: 'user', actual: token?.role });
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    console.log('✅ Accès autorisé');
    console.log('🔒 --- Fin Middleware ---\n');
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Configuration des chemins protégés
export const config = {
  matcher: [
    '/owner/:path*',
    '/traveler/:path*',
    '/dashboard/:path*',
    '/login'
  ]
};
