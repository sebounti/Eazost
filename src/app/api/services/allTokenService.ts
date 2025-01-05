import jwt from 'jsonwebtoken';
import db from '@/db/db';
import { usersVerification } from '@/db/appSchema';
import { eq, lt, and } from 'drizzle-orm/expressions';
import { clearAuthCookies, parseCookies } from './cookieService';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();
import { setAuthCookies } from '@/app/api/services/cookieService';
import { usersSession } from '@/db/appSchema';

// Configuration des tokens
export const TOKEN_CONFIG = {
  NAMES: {
    ACCESS: 'accesstoken',
    REFRESH: 'refreshtoken',
    SESSION: 'sessiontoken',
  },
  DURATION: {
    ACCESS: '15m',
    REFRESH: '7d',
    ACCESS_COOKIE: 900, // 15 minutes en secondes
    REFRESH_COOKIE: 604800, // 7 jours en secondes
  },
};

// Types et interfaces
interface JwtPayload {
  userId: number;
  role?: string;
  accountType?: string;
}

type TokenVerificationResult = {
  success: boolean;
  userId?: number;
  role?: string;
  message: string;
  tokenType?: 'account' | 'session' | 'refresh' | 'access';
};

// Configuration
const secretKey: string =
  process.env.JWT_SECRET ?? (() => {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  })();


  export function generateAccountToken(userId: number, role: string) {
    return jwt.sign({ userId, role, tokenType: 'account' }, secretKey, {
      expiresIn: TOKEN_CONFIG.DURATION.ACCESS,
      algorithm: 'HS256',
    });
  }



// Fonction pour générer un Access Token
export function generateAccessToken(userId: number, role: string) {
  if (!userId || !role) {
    throw new Error('UserId and role are required to generate access token');
  }

  const payload = { userId, role, tokenType: 'access' };

  return jwt.sign(payload, secretKey, {
    expiresIn: TOKEN_CONFIG.DURATION.ACCESS,
    algorithm: 'HS256',
  });
}


// Fonction pour générer un Refresh Token
export function generateRefreshToken(userId: number, role: string) {
  return jwt.sign(
    { userId, role },
    secretKey,
    { expiresIn: TOKEN_CONFIG.DURATION.REFRESH }
  );
}



// Fonction pour enregistrer un token account dans la base de données
export async function saveTokenToDatabase(userId: number, token: string) {
  await db.insert(usersVerification).values({
    users_id: userId,
    token,
  });
  console.log(`Token enregistré pour userId: ${userId}`);
}




export async function baseVerifyToken(
  token: string,
  options: {
    checkDatabase?: boolean;
    tokenType: 'account' | 'session' | 'refresh' | 'access';
    uuid?: string;
  }
): Promise<TokenVerificationResult> {
  console.log(`🔄 Vérification du token de type: ${options.tokenType}`);

  try {
    // Vérification pour les Refresh Tokens (hachés)
    if (options.checkDatabase) {
		console.log('📝 Vérification en base de données...');
		const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
		console.log('🔒 Token haché généré :', hashedToken);


      // Rechercher le token haché en base
      const tokenRecord = await db
        .select()
        .from(usersSession)
        .where(
          options.uuid
            ? and(eq(usersSession.token, hashedToken), eq(usersSession.uuid, options.uuid))
            : eq(usersSession.token, hashedToken)
        )
        .limit(1);

		console.log('Résultat de la recherche en base:', tokenRecord);


      if (tokenRecord.length > 0) {
        console.log('✅ Token trouvé en base');

        // Vérifier la validité (expiration)
        const isExpired = tokenRecord[0].expired_at < new Date();
        if (isExpired) {
          console.log('⏰ Refresh Token expiré');
          return { success: false, message: 'Refresh Token expired', tokenType: options.tokenType };
        }

        console.log(' Décodage du token JWT...');
        try {
          const decoded = jwt.verify(token, secretKey) as JwtPayload;
          console.log('✅ Token JWT décodé:', decoded);
          return {
            success: true,
            userId: tokenRecord[0].users_id,
            role: decoded.accountType || decoded.role,
            message: 'Refresh Token verified successfully',
            tokenType: options.tokenType,
          };
        } catch (jwtError) {
          console.error('❌ Erreur de décodage JWT:', jwtError);
          return { success: false, message: 'Invalid JWT', tokenType: options.tokenType };
        }
      }

      console.log('❌ Refresh Token introuvable');
      return { success: false, message: 'Refresh Token not foufound', tokenType: options.tokenType };
    }

    // Vérification pour les autres types de tokens (JWT uniquement)
    console.log('🔑 Vérification du token JWT...');
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    console.log('✅ Token vérifié avec succès pour userId:', decoded.userId);

    return {
      success: true,
      userId: decoded.userId,
      role: decoded.role,
      message: 'Token verified successfully',
      tokenType: options.tokenType,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log('⏰ Token expiré');
      return { success: false, message: 'Token expired', tokenType: options.tokenType };
    }
    console.log('❌ Token invalide:', error);
    return { success: false, message: 'Invalid token', tokenType: options.tokenType };
  }
}




// Fonction pour gérer l'expiration des tokens
export async function handleTokenExpiration(response: Response, request: Request) {
  try {
    console.log('🔄 Début du processus de rafraîchissement du token');
    const cookieHeader = request.headers.get('Cookie');
    const cookies = parseCookies(cookieHeader);

    const refreshToken = cookies[TOKEN_CONFIG.NAMES.REFRESH.toLowerCase()];
    if (!refreshToken) {
      console.log('❌ Refresh token non trouvé');
      clearAuthCookies(response);
      return { success: false, message: 'No refresh token found' };
    }

    const refreshResult = await baseVerifyToken(refreshToken, {
      checkDatabase: false,
      tokenType: 'refresh',
    });

    if (refreshResult.success && refreshResult.userId && refreshResult.role) {
      const newAccessToken = generateAccessToken(refreshResult.userId, refreshResult.role);
      const newRefreshToken = generateRefreshToken(refreshResult.userId, refreshResult.role);

      setAuthCookies(response, newAccessToken, newRefreshToken);

      return {
        success: true,
        newAccessToken,
        userId: refreshResult.userId,
        role: refreshResult.role,
      };
    }

    clearAuthCookies(response);
    return { success: false, message: 'Invalid refresh token' };
  } catch (error) {
    console.error('❌ Erreur lors du rafraîchissement :', error);
    clearAuthCookies(response);
    return { success: false, message: 'Error during token refresh' };
  }
}



// Fonction pour obtenir l'utilisateur à partir d'un token
export async function getUserFromToken(req: Request) {
	console.log('🔍 Début de vérification des cookies');
	const cookieHeader = req.headers.get('Cookie');

	if (!cookieHeader) {
	  console.log('❌ Aucun cookie trouvé');
	  return { success: false, message: "No cookies found" };
	}

	const cookies = cookieHeader.split(';').reduce((acc: { [key: string]: string }, cookie) => {
	  const [key, value] = cookie.trim().split('=');
	  acc[key.toLowerCase()] = value;
	  return acc;
	}, {});

	console.log('🍪 Cookies trouvés:', Object.keys(cookies));
	const token = cookies[TOKEN_CONFIG.NAMES.ACCESS];
	if (!token) {
	  console.log('❌ Access token non trouvé dans les cookies');
	  return { success: false, message: "Access token not found in cookies" };
	}

	console.log('🎫 Access token trouvé, vérification...');
	const result = await baseVerifyToken(token, {
	  checkDatabase: false,
	  tokenType: 'access',
	});

	console.log('🔐 Résultat de la vérification:', result);

	return result;
  }

  export { setAuthCookies } from './cookieService';

// Fonction pour nettoyer les tokens expirés
  export async function cleanExpiredTokens() {
	const now = new Date();
	console.log('🔄 Début de la suppression des tokens expirés');

	const deletedCount = await db
	  .delete(usersSession)
	  .where(lt(usersSession.expired_at, now));

	console.log(`🧹 ${deletedCount} tokens expirés supprimés`);
  }
