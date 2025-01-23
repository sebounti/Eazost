import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, TOKEN_CONFIG } from '@/app/api/services/tokenService';
import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import { usersInfo } from '@/db/appSchema';

//----- CHECK SESSION -----//
// Vérifie si l'utilisateur est connecté //

//----- GET -----//
// Vérifie si l'utilisateur est connecté //
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(TOKEN_CONFIG.NAMES.ACCESS)?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Token manquant' }, { status: 401 });
    }

    const result = await verifyToken(token, 'access');

    if (result.success && result.data?.userId) {
      const userProfile = await db
        .select()
        .from(usersInfo)
        .where(eq(usersInfo.users_id, String(result.data.userId)))
        .limit(1);

      return NextResponse.json({
        success: true,
        userId: result.data.userId,
        role: result.data.role,
        isProfileComplete: userProfile.length > 0
      });
    }

    return NextResponse.json({ success: false, message: 'Token invalide' }, { status: 401 });
  } catch (error) {
    console.error('❌ Erreur vérification session:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
