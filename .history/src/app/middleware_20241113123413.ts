import { NextRequest, NextResponse } from "next/server";
import { verifyToken, generateAccessToken } from '@/app/api/services/tokenService';

export default async function middleware(req: NextRequest) {
  console.log('Middleware exécuté pour la route:', req.nextUrl.pathname);

  if (req.nextUrl.pathname.startsWith('/api')) {
    console.log('Middleware pour une route API');

    const publicRoutes = ['/login', '/registration', '/api/auth'];
    if (publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
      console.log('Route publique détectée, aucune vérification de token nécessaire');
      return NextResponse.next();
    }

    const accessToken = req.cookies.get('accesstoken')?.value;
    console.log('Token récupéré :', accessToken);

    if (accessToken) {
      const { success, userId, role } = await verifyToken(accessToken);
      console.log('Résultat de la vérification du token :', success);

      if (success) {
        console.log('Token valide. Vérification des permissions utilisateur');

        const requiredRole = req.nextUrl.pathname.startsWith('/api/admin') ? 'admin' : 'user';
        if (role !== requiredRole) {
          console.log("L'utilisateur n’a pas les permissions nécessaires pour accéder à cette ressource");
          return NextResponse.redirect(new URL('/access-denied', req.url));
        }

        console.log('Permissions utilisateur validées');
        return NextResponse.next();
      }
    }

    console.log('Token d’accès expiré ou invalide. Vérification du refresh token...');
    const refreshToken = req.cookies.get('refreshtoken')?.value;

    if (refreshToken) {
      const { success: refreshSuccess, userId, account_type } = await verifyToken(refreshToken);
      if (refreshSuccess) {
        console.log('Refresh token valide');

        const newAccessToken = generateAccessToken(userId, role);
        console.log('Nouveau token d’accès généré:', newAccessToken);

        const response = NextResponse.next();
        response.cookies.set('accesstoken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60,
          sameSite: 'strict',
        });

        console.log('Nouveau token d’accès enregistré dans le cookie');
        return response;
      }
    }

    console.log('Aucun refresh token trouvé ou invalide. Redirection vers la page de login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
