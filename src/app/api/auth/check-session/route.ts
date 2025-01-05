import { NextRequest, NextResponse } from 'next/server';
import { baseVerifyToken } from '@/app/api/services/allTokenService';
import { TOKEN_CONFIG } from '@/app/api/services/allTokenService';
import db from '@/db/db';
import { eq } from 'drizzle-orm';
import { usersInfo } from '@/db/appSchema';

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token depuis les cookies
    const accessToken = request.cookies.get(TOKEN_CONFIG.NAMES.ACCESS)?.value;

    console.log('🍪 AccessToken reçu :', accessToken);

    if (!accessToken) {
      return NextResponse.json({ success: false, message: 'Token manquant' }, { status: 401 });
    }

    // Vérifier le token
	const verificationResult = await baseVerifyToken(accessToken, {
		checkDatabase: false,
		tokenType: 'access',
	  });

    console.log('🔍 Résultat de la vérification du token :', verificationResult);


	// Si le token est valide, retourner les informations de l'utilisateur
    if (verificationResult.success && verificationResult.userId) {
		const userId = verificationResult.userId;

		const userProfile = await db
		.select()
		.from(usersInfo)
		.where(eq(usersInfo.users_id, userId))
		.limit(1);


		const isProfileComplete = userProfile.length > 0;

		console.log('👤 Informations de l\'utilisateur :', userProfile);
		console.log('🔍 Profil complet :', isProfileComplete);


      return NextResponse.json({
		success: true,
		message: 'Token vérifié',
		userId,
		role: verificationResult.role,
		isProfileComplete,
	  });
    } else {
      return NextResponse.json({ success: false, message: verificationResult.message }, { status: 401 });
    }
  } catch (error) {
    console.error('❌ Erreur dans la route /api/auth/verify :', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
