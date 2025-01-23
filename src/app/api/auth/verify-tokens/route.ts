import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_CONFIG } from '@/app/api/services/tokenService';
import { verifyAndRefreshTokens } from '@/app/api/services/tokenService';

//----- VERIFY TOKENS -----//
// Permet de vérifier si les tokens sont valides //


//----- GET -----//
// Route pour vérifier si les tokens sont valides //
export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get(TOKEN_CONFIG.NAMES.ACCESS)?.value;
    const refreshToken = request.cookies.get(TOKEN_CONFIG.NAMES.REFRESH)?.value;

    return NextResponse.json({
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      isValid: true
    });
  } catch (error) {
    console.error('❌ Erreur vérification tokens:', error);
    return NextResponse.json({
      hasAccessToken: false,
      hasRefreshToken: false,
      isValid: false
    });
  }
}

export async function POST(request: Request) {
  try {
    const { accessToken, refreshToken } = await request.json();
    const result = await verifyAndRefreshTokens(accessToken, refreshToken);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid tokens' }, { status: 401 });
  }
}
