import { NextRequest, NextResponse } from 'next/server';
import { baseVerifyToken, generateAccessToken, generateRefreshToken, TOKEN_CONFIG, setAuthCookies } from '@/app/api/services/allTokenService';
import db from '@/db/db';
import { eq } from 'drizzle-orm/expressions';
import { usersSession } from '@/db/appSchema';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(TOKEN_CONFIG.NAMES.REFRESH)?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token missing' }, { status: 401 });
    }

    const verificationResult = await baseVerifyToken(refreshToken, {
      checkDatabase: true,
      tokenType: 'refresh'
    });

    if (!verificationResult.success || !verificationResult.userId || !verificationResult.role) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    // Générer un nouveau access token avec l'userId ET le rôle
    const newAccessToken = generateAccessToken(
      verificationResult.userId,
      verificationResult.role  // S'assurer que le rôle est bien passé
    );

    const response = NextResponse.json({ success: true });
    setAuthCookies(response, newAccessToken, refreshToken);
    return response;

  } catch (error) {
    console.error('❌ Erreur lors du rafraîchissement des tokens:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
