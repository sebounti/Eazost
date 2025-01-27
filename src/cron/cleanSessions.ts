import { cleanExpiredSessions } from '../app/api/services/sessionService';
import cron from 'node-cron';

// Tâche planifiée : Nettoyer les sessions expirées tous les jours à minuit
cron.schedule('0 0 * * *', async () => {
    console.log("🔄 Nettoyage des sessions expirées...");
    try {
        await cleanExpiredSessions(); // Appel à ta fonction pour supprimer les sessions expirées
        console.log("✅ Nettoyage terminé !");
    } catch (error) {
        console.error("❌ Erreur lors du nettoyage des sessions :", error);
    }
});
