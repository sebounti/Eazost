import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

//---- TOKEN CONFIGURATION ----//
// Gere la generation , verification et rafraichissement des tokens //


// Configuration
export const TOKEN_CONFIG = {
  DURATION: {
    ACCESS: '15m',
    REFRESH: '7d',
  }
};

interface JWTPayload {
  userId: string;
}

export function getUserFromToken(request: NextRequest): string {
  const token = request.cookies.get('next-auth.session-token')?.value;
  if (!token) throw new Error('No token found');

  const decoded = jwt.decode(token) as JWTPayload;
  if (!decoded?.userId) throw new Error('Invalid token');
  return decoded.userId;
}
