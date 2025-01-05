import jwt from 'jsonwebtoken';
import db from '@/db/db';
import { usersVerification } from '@/db/schema'; // Schéma Drizzle ORM pour la table users_verification
import { and, eq } from 'drizzle-orm/expressions';
import dotenv from 'dotenv';

dotenv.config();

// Clé secrète pour signer les tokens JWT
const secretKey = process.env.JWT_SECRET || 'default_secret_key'; // Assurer une valeur par défaut en cas d'absence

// Fonction pour extraire le token JWT depuis les cookies et le vérifier
export async function getUserFromToken(request: Request) {
    // Récupérer le header cookie
    const cookieHeader = request.headers.get('cookie');

    if (!cookieHeader) {
        throw new Error("Authorization token missing or invalid");
    }

    // Extraire le token JWT depuis les cookies
    const tokenPart = cookieHeader.split('; ').find(row => row.startsWith('token='));
    const token = tokenPart ? decodeURIComponent(tokenPart.split('=')[1]) : null;

    console.log('Token extrait:', token); // Vérification du token

    if (!token) {
        throw new Error("Token not found in cookies");
    }

    try {
        // Décoder et vérifier directement le token
        const decoded = jwt.verify(token, secretKey as string);

        console.log('Token décodé:', decoded); // Vérification du contenu décodé

        // S'assurer que `decoded` est bien un objet et qu'il contient `userId`
        if (typeof decoded === 'object' && 'userId' in decoded) {

            console.log('userId récupéré du token JWT:', decoded['userId']);

            return { userId: decoded['userId'], role: decoded['role'] };
        } else {
            throw new Error("User ID not found in token");
        }
    } catch (error) {

        console.error('Erreur de vérification du token:', error);

        throw new Error('Invalid or expired token');
    }
}



// Fonction pour générer un token JWT avec userId a la connexion
export function generateAccessToken(userId: number, account_type: string) {

	console.log(`Génération du token pour userId: ${userId}, rôle: ${account_type}`); // Log pour vérifier les données

	return jwt.sign({ userId, role: account_type }, secretKey, { expiresIn: '15m' }); // Expiration après 5 heures
}

// Fonction pour rafraîchir le token JWT
export function refreshToken(userId: number, account_type: string) {

	console.log(`Rafraichissement du token pour userId: ${userId}, rôle: ${account_type}`); // Log pour vérifier les données

	return jwt.sign({ userId, role: account_type }, secretKey, { expiresIn: '7d' }); // Expiration après 5 heures
}


// Fonction pour envoie les token en tant que cookies securisés
export function setAuthCookies(response: Response, accessToken: string, refreshToken: string) {
	response.headers.append('Set-Cookie', `token=${accessToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600`);
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

        // Vérification en base de données
        const verification = await db
            .select()
            .from(usersVerification)
            .where(eq(usersVerification.token, token), eq(usersVerification.used, false));

        if (verification.length === 0) {
            throw new Error('Token invalide ou déjà utilisé.');
        }

        // Marquer le token comme utilisé
        await db.update(usersVerification).set({ used: true }).where(eq(usersVerification.token, token));
        console.log('Token d\'activation validé et marqué comme utilisé.');

        return { success: true, userId };

    } catch (error) {
        console.error('Erreur lors de la vérification du token d\'inscription:', error);
        return { success: false, message: 'Le lien de validation est invalide ou expiré.' };
    }
}



