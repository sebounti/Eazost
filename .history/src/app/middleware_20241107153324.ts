import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from '@/app/api/services/tokenService';

// midlleware
export default async function middleware(req: NextRequest) {
	console.log('Middleware exécuté !', req.nextUrl.pathname);

	// verifie si la requete concerne une route api
	if (req.nextUrl.pathname.startsWith('/api')) {
		console.log('Middleware pour une route API');

		// exclutes les routes /api/auth
		if(!req.nextUrl.pathname.startsWith('/api/auth')) {
			console.log('Vérification de token en cours');

			// recupere le cookie
			const token = req.cookies.get('token')?.value;
			console.log('Token récupéré :', token);

			if (token) {
				//verify avec fonction verifyToken
				const { success } = await verifyToken(token);
				console.log('Résultat de la vérification du token :', success);

				if(!success) {
					// Erreur Token invalide
					console.log('Token invalide');
					return new NextResponse('Access non autorise',  {status: 401});
				} else {
					console.log('Token valide');
					// token valide
					return NextResponse.next();
				}
			} else {
				console.log('Aucun token trouvé');
					// Erreur Token absent
					return new NextResponse('Access non autorise',  {status: 401});
				}
			}
	}
	// la requete passe si elle n'est pas concerner
	return NextResponse.next();
}

// matcher pour tout les routes
export const config = {
	matcher:['/api/:path*'],
};
