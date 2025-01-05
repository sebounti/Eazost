import db from '@/db/db'; // Assure-toi d'importer correctement ta configuration Drizzle
import { usersSession } from '@/db/appSchema'; // Assure-toi d'importer ta table de sessions

export const insertSession = async (userId: number, token: string, ipAddress: string, userAgent: string) => {
    const expiredAt = new Date(Date.now() + 60 * 60 * 1000); // Exemple : 1 heure d'expiration

    try {
        // Insérer la nouvelle session dans la base de données
        const result = await db.insert(usersSession).values({
            users_id: userId,
            token: token,
            ip_address: ipAddress,
            user_agent: userAgent,
            expired_at: expiredAt,
        });

        console.log(`Session créée avec succès pour userId: ${userId}`);
        return result; // Retourner l'ID de session ou autre information selon ta configuration
    } catch (error) {
        console.error('Erreur lors de l\'insertion de la session:', error);
        throw error; // Relancer l'erreur pour la gérer plus haut si nécessaire
    }
};
