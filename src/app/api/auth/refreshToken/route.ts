import { NextRequest, NextResponse } from 'next/server';
import {
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  TOKEN_CONFIG
} from '@/app/api/services/tokenService';

export async function POST(request: NextRequest) {
  try {
    // 1. Vérifier la présence du refresh token
    const refreshToken = request.cookies.get(TOKEN_CONFIG.NAMES.REFRESH)?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token missing' }, { status: 401 });
    }

    // 2. Valider le refresh token
    const verificationResult = await verifyToken(refreshToken, 'refresh');

    if (!verificationResult.success || !verificationResult.data) {
      return NextResponse.json({ error: 'Token verification failed' }, { status: 401 });
    }

    const { userId, role } = verificationResult.data;
    if (!userId) {
      return NextResponse.json({ error: 'User ID missing in token' }, { status: 401 });
    }
    if (!role) {
      return NextResponse.json({ error: 'Role missing in token' }, { status: 401 });
    }

    // 3. Générer un nouveau access token
    const newAccessToken = generateAccessToken(userId, role, { expiresIn: "15m" });

    // 4. Générer un nouveau refresh token
    const newRefreshToken = generateRefreshToken(userId);

    // 5. Mettre à jour les cookies
    const response = NextResponse.json({ success: true });
    setAuthCookies(response, newAccessToken, newRefreshToken);

    console.log('🔄 Refresh token utilisé pour:', userId);

    return response;
  } catch (error) {
    console.error('❌ Erreur lors du rafraîchissement des tokens:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
