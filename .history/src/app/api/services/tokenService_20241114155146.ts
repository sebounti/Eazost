import jwt from 'jsonwebtoken';
import db from '@/db/db';
import { usersVerification } from '@/db/schema'; // Schéma Drizzle ORM pour la table users_verification
import { and, eq } from 'drizzle-orm/expressions';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Test Suite: Token Service Tests
 *
 * Description:
 * Ce fichier contient une série de tests pour vérifier le fonctionnement des tokens JWT.
 * Il couvre les cas de génération, vérification et gestion d'erreurs pour les tokens d'accès et de rafraîchissement.
 *
 * Tests Inclus :
 *
 * 1. **Basic token generation and verification**
 *    - Vérifie que la génération et la vérification d'un token avec jsonwebtoken fonctionnent correctement.
 *
 * 2. **should verify a valid access token**
 *    - Vérifie que le token d'accès est correctement généré et décodé avec l'ID utilisateur et le rôle.
 *
 * 3. **should verify a valid refresh token**
 *    - Vérifie que le token de rafraîchissement est valide avec les valeurs correctes d'ID utilisateur et de rôle.
 *
 * 4. **should reject an expired access token**
 *    - Vérifie qu'un token d'accès expiré renvoie une erreur `Token expired`.
 *
 * 5. **should reject an invalid access token**
 *    - Vérifie qu'un token d'accès invalide ou mal formé retourne une erreur `Invalid token`.
 *
 * 6. **should reject an expired refresh token**
 *    - Vérifie qu'un token de rafraîchissement expiré renvoie l'erreur `Refresh token expired`.
 *
 * 7. **should reject an invalid refresh token**
 *    - Vérifie qu’un token de rafraîchissement invalide retourne une erreur `Invalid token`.
 *
 * Objectif :
 * Assurer la sécurité et la gestion des erreurs pour les tokens JWT en couvrant divers scénarios.
 */


const secretKey: string = process.env.JWT_SECRET ?? (() => {
	throw new Error('JWT_SECRET is not defined in the environment variables');
  })();

  console.log('Clé secrète utilisée :', secretKey);

// Noms des cookies pour les tokens JWT
const COOKIE_NAMES = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken'
};

// Durée de validité des tokens JWT
const TOKEN_DURATION = {
  ACCESS: '15m',    // Pour access token
  REFRESH: '7d',    // Pour refresh token
  ACCESS_COOKIE: 900,    // 15 minutes en secondes
  REFRESH_COOKIE: 604800 // 7 jours en secondes
};

// Fonction pour extraire le token JWT depuis les cookies et le vérifier
export async function getUserFromToken(request: Request) {
  // Récupérer le header cookie
  const cookieHeader = request.headers.get('cookie');

  if (!cookieHeader) {
    throw new Error("Authorization token missing or invalid");
  }

  // Dans tokenService.ts on utilise
  const token = cookieHeader?.split('; ').find(row => row.startsWith('token='));

  console.log('Token extrait:', token); // Vérification du token

  if (!token) {
    throw new Error("Token not found in cookies");
  }

  try {
    // Décoder et vérifier directement le token
    const decoded = jwt.verify(token, secretKey as string) as { userId: number, role: string };
    console.log('User ID extrait du token:', decoded['userId']);
    console.log('Token décodé:', decoded); // Vérification du contenu décodé

    // S'assurer que `decoded` contient bien un userId
    if (decoded && 'userId' in decoded) {
      console.log('userId récupéré du token JWT:', decoded['userId']);
      return { userId: decoded['userId'], role: decoded['role'] };
    } else {
      throw new Error("User ID not found in token");
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error('Token expired:', error);
      throw new Error('Token has expired');
    } else {
      console.error('Erreur de vérification du token:', error);
      throw new Error('Invalid or expired token');
    }
  }
}

interface JwtPayload {
	userId: number;
	role: string;
  }

// Fonction pour générer un token JWT avec userId à la connexion
export function generateAccessToken(userId: number, account_type: string) {
  return jwt.sign(
    { userId, role: account_type } as JwtPayload,
    secretKey,
    { expiresIn: TOKEN_DURATION.ACCESS }
  );
}

// Fonction pour rafraîchir le token JWT
export function refreshToken(userId: number, account_type: string) {
  return jwt.sign(
    { userId, role: account_type } as JwtPayload,
    secretKey,
    { expiresIn: TOKEN_DURATION.REFRESH }
  );
}

// Fonction pour envoyer les tokens en tant que cookies sécurisés
export function setAuthCookies(response: Response, accessToken: string, refreshToken: string) {
  response.headers.append('Set-Cookie',
    `${COOKIE_NAMES.ACCESS_TOKEN}=${accessToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${TOKEN_DURATION.ACCESS_COOKIE}`
  );
  response.headers.append('Set-Cookie',
    `${COOKIE_NAMES.REFRESH_TOKEN}=${refreshToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${TOKEN_DURATION.REFRESH_COOKIE}`
  );
}

// Fonction pour enregistrer le token dans la base de données
export async function saveTokenToDatabase(userId: number, token: string) {
  await db.insert(usersVerification).values({
    users_id: userId,
    token,
    used: false,
  });
  console.log(`Token enregistré pour userId: ${userId}`); // Confirmation de l'enregistrement
}

// Define the TokenVerificationResult type
type TokenVerificationResult = {
  success: boolean;
  userId?: number;
  role?: string;
  message: string;
};

export async function verifyAccountToken(token: string) {
  try {
    const decoded = jwt.verify(token, secretKey) as { userId: number, role: string };
    console.log('Token décodé dans verifyAccountToken:', decoded);

    const userId = decoded.userId;
    const account_type = decoded.role;

    const verification = await db
      .select()
      .from(usersVerification)
      .where(
        and(
          eq(usersVerification.token, token),
          eq(usersVerification.used, false)
        )
      )
      .limit(1);

    if (verification.length === 0) {
      throw new Error('Token invalide ou déjà utilisé.');
    }

    await db.update(usersVerification).set({ used: true }).where(eq(usersVerification.token, token));
    console.log("Token d'activation validé et marqué comme utilisé.");

    return { success: true, userId, account_type };
  } catch (error) {
    console.error("Erreur lors de la vérification du token d'inscription:", error);
    return { success: false, message: 'Le lien de validation est invalide ou expiré.' };
  }
}

export async function verifyRefreshToken(token: string) {
	try {
	  const decoded = jwt.verify(token, secretKey) as { userId: number, role: string };
	  const userId = decoded.userId;
	  const role = decoded.role;

	  return { success: true, userId, role };
	} catch (error) {
	  if (error instanceof jwt.TokenExpiredError) {
		console.error('Refresh Token expired at:', error.expiredAt);
		return { success: false, message: 'Refresh token expired' };
	  } else if (error instanceof jwt.JsonWebTokenError) {
		console.error('Invalid Refresh token:', error.message);
		return { success: false, message: 'Invalid refresh token' };
	  } else {
		console.error('Unknown error during refresh token verification:', error);
		return { success: false, message: 'Unknown error' };
	  }
	}
  }



export async function verifyToken(token: string): Promise<TokenVerificationResult> {
	try {
	  // Vérifiez d'abord si le token est marqué comme utilisé dans la base de données
	  const tokenRecord = await db.select().from(usersVerification).where(eq(usersVerification.token, token)).limit(1);
	  if (tokenRecord.length > 0 && tokenRecord[0].used) {
		return { success: false, message: 'Invalid or expired token' };
	  }

	  // Si non utilisé, procéder à la vérification du token
	  const decoded = jwt.verify(token, secretKey) as JwtPayload;
	  return {
		success: true,
		userId: decoded.userId,
		role: decoded.role,
		message: 'Token verified successfully'
	  };
	} catch (error) {
	  if (error instanceof jwt.TokenExpiredError) {
		return { success: false, message: 'Token expired' };
	  } else if (error instanceof jwt.JsonWebTokenError) {
		return { success: false, message: 'Invalid token' };
	  }
	  return { success: false, message: 'Unknown error' };
	}
  }
