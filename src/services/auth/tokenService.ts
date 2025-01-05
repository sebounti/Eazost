import { NextResponse } from 'next/server';
import { TOKEN_CONFIG } from '@/app/api/services/allTokenService';
import jwt from 'jsonwebtoken';

export const setAuthTokens = (response: NextResponse, accessToken: string, refreshToken: string) => {
  response.cookies.set('accesstoken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: TOKEN_CONFIG.DURATION.ACCESS_COOKIE
  });

  response.cookies.set('refreshtoken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: TOKEN_CONFIG.DURATION.REFRESH_COOKIE
  });
};

export const verifyToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: 'Token invalide' };
  }
};
