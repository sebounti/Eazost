import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from '@/app/api/services/tokenService';

// Middleware pour intercepter les requêtes
export default async function middleware(req: NextRequest) {
  console.log('Middleware exécuté pour la route:', req.nextUrl.pathname);

  // Vérifie si la requête concerne une route API
  if (req.nextUrl.pathname.startsWith('/api')) {
    console.log('Middleware pour une route API');

    // Exclut les routes d'authentification et de création de compte (par exemple, /login et /registration)
    const publicRoutes = ['/login', '/registration', '/api/auth']; // Ajoutez ici les routes publiques

    // Si la route est publique, la requête passe sans vérification
    if (publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
      console.log('Route publique détectée, aucune vérification de token nécessaire');
      return NextResponse.next();
    }

    // Récupère le token dans le cookie pour les routes protégées
    const accesstoken = req.cookies.get('accesstoken')?.value;
    console.log('Token récupéré :', accesstoken);

    if (accesstoken) {
      // Vérifie la validité du token avec la fonction `verifyToken`
      const { success } = await verifyToken(token);
      console.log('Résultat de la vérification du token :', success);

      if (!success) {
        // Token invalide -> Redirection vers la page de login
        console.log('Token invalide');
        return NextResponse.redirect(new URL('/login', req.url));
      } else {
        // Token valide
        console.log('Token valide');
        return NextResponse.next();
      }
    } else {
      // Aucun token trouvé -> Redirection vers la page de login
      console.log('Aucun token trouvé');
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Permet la requête de passer si elle n'est pas concernée par le middleware
  return NextResponse.next();
}

// Matcher pour toutes les routes API
export const config = {
  matcher: ['/api/:path*'],
};
