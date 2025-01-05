import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, generateAccessToken } from '@/app/api/services/tokenService';

export default async function middleware(req: NextRequest) {
  console.log('Middleware exécuté pour la route:', req.nextUrl.pathname);


  // Vérifier si la route est une route API
  if (req.nextUrl.pathname.startsWith('/api')) {
    console.log('Middleware pour une route API');

	// Vérifier si la route est publique
    const publicRoutes = ['/login', '/registration', '/api/auth'];
    if (publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
      console.log('Route publique détectée, aucune vérification de token nécessaire');
      return NextResponse.next();
    }

	//
    const accessToken = req.cookies.get('accesstoken')?.value; // Accès à `accesstoken` uniquement
    console.log('Token récupéré :', accessToken);

    if (accessToken) {
      const { success, userId, role } = await verifySessionToken(accessToken); // Utilisation de `role` ici pour la cohérence
      console.log('Résultat de la vérification du token :', success);

      if (success && userId !== undefined) {
        console.log('Token valide. Vérification des permissions utilisateur');

        const requiredRole = req.nextUrl.pathname.startsWith('/api/admin') ? 'admin' : 'user';
        if (role !== requiredRole) { // Utilisation de `role` ici
          console.log("L'utilisateur n’a pas les permissions nécessaires pour accéder à cette ressource");
          return NextResponse.redirect(new URL('/access-denied', req.url));
        }

        console.log('Permissions utilisateur validées');
        return NextResponse.next();
      }
    }

    console.log('Token d’accès expiré ou invalide. Vérification du refresh token...');
    const refreshToken = req.cookies.get('refreshtoken')?.value;
    let newAccessToken;

    if (refreshToken) {
      const { success: refreshSuccess, userId, role } = await verifySessionToken(refreshToken); // Même chose ici
      if (refreshSuccess && userId !== undefined) {
        console.log('Refresh token valide');
        newAccessToken = generateAccessToken(userId, role); // Utilisation de `role` ici
        console.log('Nouveau token d’accès généré:', newAccessToken);

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

    if (!newAccessToken) {
      console.log('Échec du renouvellement du token d’accès. Redirection vers login.');
      return NextResponse.redirect(new URL('/login', req.url));
    }

    console.log('Aucun refresh token trouvé ou invalide. Redirection vers la page de login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
