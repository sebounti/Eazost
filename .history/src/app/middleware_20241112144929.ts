import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from '@/app/api/';

// Middleware pour intercepter les requêtes
export default async function middleware(req: NextRequest) {
  console.log('Middleware exécuté !', req.nextUrl.pathname);

  // Vérifie si la requête concerne une route API
  if (req.nextUrl.pathname.startsWith('/api')) {
    console.log('Middleware pour une route API');

    // Exclut les routes d'authentification (par exemple, /api/auth)
	if (!req.nextUrl.pathname.startsWith('/login') && !req.nextUrl.pathname.startsWith('/registration')) {
		// Logique de redirection seulement si la route n'est pas '/login' ou '/registration'
	  }
			console.log('Vérification de token en cours');

      // Récupère le token dans le cookie
      const token = req.cookies.get('token')?.value;
      console.log('Token récupéré :', token);

      if (token) {
        // Vérifie la validité du token avec ta fonction `verifyToken`
        const { success } = await verifyToken(token);
        console.log('Résultat de la vérification du token :', success);

        if (!success) {
          // Token invalide -> Envoie une redirection vers la page de login
          console.log('Token invalide');
          // Redirige l'utilisateur vers la page de login
          return NextResponse.redirect(new URL('/login', req.url));  // Redirection vers /login
        } else {
          // Token valide
          console.log('Token valide');
          return NextResponse.next();  // Passe à la suite de la requête si le token est valide
        }
      } else {
        // Erreur : Aucun token trouvé
        console.log('Aucun token trouvé');
        // Redirige vers la page de login si aucun token est trouvé
        return NextResponse.redirect(new URL('/login', req.url));  // Redirection vers /login
      }
    }
  }
  // Permet la requête de passer si elle n'est pas concernée par le middleware
  return NextResponse.next();
}

// Matcher pour toutes les routes API
export const config = {
  matcher: ['/api/:path*'],
};
