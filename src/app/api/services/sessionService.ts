import { db } from '@/db/db';
import { sessions } from '@/db/authSchema';
import crypto from 'crypto';
import { TOKEN_CONFIG } from './tokenService';

//---- SESSION CONFIGURATION ----//
// Gere la creation et la gestion des sessions //

export async function saveSession(userId: string | number, token: string) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const expiryDate = new Date(Date.now() + TOKEN_CONFIG.DURATION.REFRESH_COOKIE * 1000);

  await db.insert(sessions).values({
    sessionToken: hashedToken,
    userId: String(userId),
    expires: expiryDate
  });
}
