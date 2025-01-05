import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/api/services/tokenService';

export async function GET(request: NextRequest) {
  // Récupérer le token depuis les cookies
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  // Vérification de la présence du token
  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Token manquant' },
      { status: 401 }
    );
  }

  // Utiliser verifyToken pour vérifier la validité
  const result = await verifyToken(token);

  // Retourner le succès si la vérification est positive
  if (result.success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json(
      { success: false, message: 'Token invalide ou expiré' },
      { status: 401 }
    );
  }
}
