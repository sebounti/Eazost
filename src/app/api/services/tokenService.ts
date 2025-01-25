import jwt, { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { sessions } from '@/db/authSchema';
import { lt } from 'drizzle-orm/expressions';
import crypto from 'crypto';
import { NextRequest } from 'next/server';



//---- TOKEN CONFIGURATION ----//
// Gere la generation , verification et rafraichissement des tokens //


// Configuration
export const TOKEN_CONFIG = {
  NAMES: {
    ACCESS: 'auth.access_token',
    REFRESH: 'auth.refresh_token',
    SESSION: 'next-auth.session-token',
  },
  DURATION: {
    ACCESS: '15m',
    REFRESH: '7d',
    ACCESS_COOKIE: 900,    // 15 minutes
    REFRESH_COOKIE: 604800 // 7 jours
  }
};


interface JwtPayload {
  userId: number | string;
  role?: string;
  type: 'access' | 'refresh' | 'account';
}

interface VerifyTokenResult {
  success: boolean;
  data?: {
    userId: string;
    role: string;
  };
  error?: string;
}

// Génération de tokens
export function generateAccessToken(
  userId: string | number,
  role: string = 'user',
  options: SignOptions = { expiresIn: TOKEN_CONFIG.DURATION.ACCESS as StringValue }
): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(
    { userId, role, type: 'access' },
    process.env.JWT_SECRET,
    options
  );
}

export function generateRefreshToken(userId: string | number): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(
    { userId, type: 'refresh' },
    String(process.env.JWT_SECRET),
    { expiresIn: TOKEN_CONFIG.DURATION.REFRESH as StringValue }
  );
}

// Gestion des cookies
export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
) {
  console.log('🍪 Setting auth cookies...');
  console.log('Access Token:', accessToken.substring(0, 20) + '...');
  console.log('Refresh Token:', refreshToken.substring(0, 20) + '...');

  response.cookies.set(TOKEN_CONFIG.NAMES.ACCESS, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });

  response.cookies.set(TOKEN_CONFIG.NAMES.REFRESH, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: TOKEN_CONFIG.DURATION.REFRESH_COOKIE
  });

  console.log('✅ Cookies set successfully');
}

// Vérification de token
export async function verifyToken(token: string, type: 'access' | 'refresh'): Promise<VerifyTokenResult> {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    if (decoded.type !== type) {
      return { success: false, error: 'Type de token invalide' };
    }

    return {
      success: true,
      data: {
        userId: decoded.userId.toString(),
        role: decoded.role || 'user'
      }
    };
  } catch (error) {
    return { success: false, error: 'Token invalide' };
  }
}

// Gestion des sessions
export async function saveSession(userId: string | number, token: string) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const expiryDate = new Date(Date.now() + TOKEN_CONFIG.DURATION.REFRESH_COOKIE * 1000);

  await db.insert(sessions).values({
    sessionToken: hashedToken,
    userId: String(userId),
    expires: expiryDate
  });
}

export async function cleanExpiredSessions() {
  await db
    .delete(sessions)
    .where(lt(sessions.expires, new Date()));
}

export async function verifyAndRefreshTokens(accessToken: string, refreshToken: string) {
    try {
        // Vérifier l'access token
        const accessResult = await verifyToken(accessToken, 'access');
        if (accessResult.success) {
            return { success: true, data: accessResult.data };
        }

        // Si access token invalide, utiliser le refresh token
        const refreshResult = await verifyToken(refreshToken, 'refresh');
        if (!refreshResult.success || !refreshResult.data) {
            return { success: false, error: 'Invalid refresh token' };
        }

        // Générer nouveaux tokens avec les données vérifiées
        const { userId, role = 'user' } = refreshResult.data;
        const newAccessToken = generateAccessToken(userId, role);
        const newRefreshToken = generateRefreshToken(userId);

        // Sauvegarder nouvelle session
        await saveSession(userId, newRefreshToken);

        return {
            success: true,
            data: refreshResult.data,
            newTokens: { accessToken: newAccessToken, refreshToken: newRefreshToken }
        };
    } catch (error) {
        return { success: false, error: 'Token verification failed' };
    }
}

export async function getUserFromToken(request: NextRequest): Promise<{ userId: string }> {
  const token = request.cookies.get('auth.access_token')?.value;
  if (!token) throw new Error('No token found');

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  return { userId: decoded.userId.toString() };
}
