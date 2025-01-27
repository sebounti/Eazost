import { db } from '@/db/db';
import { sessions } from '@/db/authSchema';
import crypto from 'crypto';
import { lt } from 'drizzle-orm/expressions';

//---- SESSION CONFIGURATION ----//
// Gere la creation et la gestion des sessions //


// Sauvegarde de la session
export async function saveSession(userId: string | number, token: string) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const expiryDate = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)); // 7 jours en ms

  await db.insert(sessions).values({
    sessionToken: hashedToken,
    userId: String(userId),
    expires: expiryDate
  });
}

// Nettoyage des sessions expirées
export async function cleanExpiredSessions() {
  await db
    .delete(sessions)
    .where(lt(sessions.expires, new Date()));
}
