import { NextRequest, NextResponse } from "next/server";
import { verifyToken, generateAccessToken} from '@/app/api/services/tokenService';

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
    const accessToken = req.cookies.get('accesstoken')?.value;
    console.log('Token récupéré :', accessToken);

    if (accessToken) {
      // Vérifie la validité du token avec la fonction `verifyToken`
      const { success } = await verifyToken(accessToken);
      console.log('Résultat de la vérification du token :', success);

      if (!success) {
        // Token invalide -> Redirection vers la page de login
		console.log('Token d’accès expiré ou invalide. Vérification du refresh token...');

		const refreshToken = req.cookies.get('refreshtoken')?.value;

		if (refreshToken) {
			// Vérifie la validité du token avec la fonction `verifyToken`
			const { success: refreshSuccess, userId, role } = await verifyToken(refreshToken);

			if (refreshSuccess) {
				// Token valide
				console.log('Refresh token valide');

				// Génère un nouveau token d'accès
				const newAccessToken = generateAccessToken(userId, role);
				console.log('Nouveau token d’accès généré:', newAccessToken);

				// Enregistre le nouveau token dans le cookie
				const response = NextResponse.next();
				response.cookies.set('accesstoken', newAccessToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					maxAge: 60 * 60, // 1 heure
					sameSite: 'strict',
			});

			console.log('Nouveau token d’accès enregistré dans le cookie');
			return response;
			}
		}

		console.log('Aucun refresh token trouvé ou invalide. Redirection vers la page de login');
		return NextResponse.redirect(new URL('/login', req.url));


		if(success) {
			console.log('Token valide. verification des pernmissioms utilisateur');


			// Vérifie les permissions de l'utilisateur
			const requireRole = req.nextUrl.pathname.startsWith('/api/admin') ? 'admin' : 'user';

			if(role !== requireRole) {
				console.log('L’utilisateur n’a pas les permissions nécessaires pour accéder à cette ressource');
				return NextResponse.redirect(new URL('/acces-denied', req.url));
			}

			console.log('role utilisateur validées');
			return NextResponse.next();
		}




// Matcher pour toutes les routes API
export const config = {
  matcher: ['/api/:path*'],
};
