import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log('🔒 Middleware exécuté pour la route:', req.nextUrl.pathname);
    console.log('Token:', req.nextauth.token);

    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login');

    // Gestion des pages d'authentification
    if (isAuthPage) {
      if (isAuth) {
        console.log('🔄 Utilisateur déjà connecté, redirection vers dashboard');
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.next();
    }

    // Vérification de l'authentification
    if (!isAuth) {
      console.log('🚫 Utilisateur non authentifié');
      let callbackUrl = req.nextUrl.pathname;
      return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url));
    }

    // Si account_type est undefined, rediriger vers la page de login
    if (!token?.account_type) {
      console.log('❌ Type de compte non défini');
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Vérification des permissions basées sur account_type
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      console.log('Vérification des permissions pour le dashboard');
      if (token.account_type !== 'owner' && token.account_type !== 'user') {
        console.log('🚫 Accès refusé : type de compte invalide');
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    console.log('✅ Accès autorisé pour:', req.nextUrl.pathname);
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log('🔑 Autorisation réussie pour:', token);
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/login',
    '/dashboard/:path*'
  ]
};
