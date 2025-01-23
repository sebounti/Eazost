import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/api/services/tokenService';
import {db} from '@/db/db';
import { usersInfo } from '@/db/appSchema';
import { eq } from 'drizzle-orm';

//----- route users -----//
// route pour les utilisateurs //

//----- PUT -----//
// Route pour mettre à jour la photo de profil //
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
	try {
	  const userId = params.id;
	  const token = request.cookies.get('accesstoken')?.value;

	  if (!token) {
		console.log('Token manquant dans les cookies');
		return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
	  }

	  console.log('Token trouvé:', token);

	  const isValidToken = await verifyToken(token, 'access');
	  if (!isValidToken) {
		console.log('Token invalide');
		return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 401 });
	  }

	  // Récupération et log du body
	  const body = await request.json();
	  console.log('Body reçu:', body);

	  const { photo_url } = body;
	  if (!photo_url) {
		console.log('Photo URL manquante dans le body');
		return NextResponse.json({ error: 'URL de la photo manquante' }, { status: 400 });
	  }

	  // Mise à jour de la photo dans la base de données
	  await db.update(usersInfo)
		.set({ photo_url })
		.where(eq(usersInfo.users_id, userId));

	  // Retourner l'URL de la photo en cas de succès
	  return NextResponse.json({ success: true, photo_url }, { status: 200 });
	} catch (error) {
	  console.error('Erreur lors de l’upload de la photo:', error);

	  // Gestion des erreurs serveur
	  return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
	}
  }
