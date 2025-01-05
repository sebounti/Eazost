import jwt from 'jsonwebtoken';
import db from '@/db/db';
import { usersVerification } from '@/db/schema'; // Schéma Drizzle ORM pour la table users_verification
import { and, eq } from 'drizzle-orm/expressions';
import dotenv from 'dotenv';

dotenv.config();

// Clé secrète pour signer les tokens JWT
const secretKey = process.env.JWT_SECRET || 'default_secret_key'; // Assurer une valeur par défaut en cas d'absence

const TOKEN_DURATION = {
  ACCESS: '15m',    // Pour access token
  REFRESH: '7d',    // Pour refresh token
  ACCESS_COOKIE: 900,    // 15 minutes en secondes
  REFRESH_COOKIE: 604800 // 7 jours en secondes
}

// Fonction pour extraire le token JWT depuis les cookies et le vérifier
export async function getUserFromToken(request: Request) {
    // R��cupérer le header cookie
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




// Fonction pour générer un token JWT avec userId a la connexion
export function generateAccessToken(userId: number, account_type: string) {

	console.log(`Génération du token pour userId: ${userId}, rôle: ${account_type}`); // Log pour vérifier les données

	return jwt.sign({ userId, role: account_type }, secretKey, { expiresIn: '15m' }); // Expiration après 15 mn
}



// Fonction pour rafraîchir le token JWT
export function refreshToken(userId: number, account_type: string) {

	console.log(`Rafraichissement du token pour userId: ${userId}, rôle: ${account_type}`); // Log pour vérifier les données

	return jwt.sign({ userId, role: account_type }, secretKey, { expiresIn: '7d' }); // Expiration après 7 jours
}



// Fonction pour envoie les token en tant que cookies securisés
export function setAuthCookies(response: Response, accessToken: string, refreshToken: string) {
	response.headers.append('Set-Cookie', `token=${accessToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=900`);
	response.headers.append('Set-Cookie', `refreshToken=${refreshToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`);
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



// Fonction pour vérifier et valider le token inscription utilisateur
export async function verifyAccountToken(token: string) {
    console.log('Token reçu pour validation de l\'inscription:', token);

    try {
        const decoded = jwt.verify(token, secretKey) as { userId: number, role: string };
        console.log('Token décodé dans verifyAccountToken:', decoded);

        const userId = decoded.userId;
		const account_type = decoded.role;

        // Vérification en base de données
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

        // Marquer le token comme utilisé
        await db.update(usersVerification).set({ used: true }).where(eq(usersVerification.token, token));
        console.log('Token d\'activation validé et marqué comme utilisé.');

        return { success: true, userId, account_type };

    } catch (error) {
        console.error('Erreur lors de la vérification du token d\'inscription:', error);
        return { success: false, message: 'Le lien de validation est invalide ou expiré.' };
    }
}


export async function verifySessionToken(token: string) {
	try {
	  const decoded = jwt.verify(token, secretKey) as { userId: number, role: string }; // `role` est nécessaire ici
	  const userId = decoded.userId;
	  const role = decoded.role;  // On extrait `role` ou `account_type` pour la cohérence

	  return { success: true, userId, role };  // Retourner `role` aussi
	} catch (error) {
	  console.error('Erreur lors de la vérification du token de session:', error);
	  return { success: false, message: 'Token de session invalide ou expiré.' };
	}
  }
